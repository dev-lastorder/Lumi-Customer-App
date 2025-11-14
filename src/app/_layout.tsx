// app/_layout.tsx - COMPLETE FILE WITH TANSTACK QUERY + TOAST
import '@/global.css';
import '../../global.css';
import 'react-native-get-random-values';  

import React, { useEffect, useState } from 'react';
// app/_layout.tsx - COMPLETE FILE WITH TANSTACK QUERY + TOAST
import '@/global.css';
import '../../global.css';
import 'react-native-get-random-values';  

import { useFonts } from 'expo-font';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ApolloProvider } from '@apollo/client';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';

// 🔥 NEW: TanStack Query + Toast imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { persistor, store } from '@/redux';
import { setupApolloClient, useFontLoader } from '@/hooks';
import { LoadingPlaceholder, ThemeSync } from '@/components';
import ErrorBoundary from '@/components/error-boundary';
import SplashVideo from '@/components/splash-screen';
import { selectSuperAppIsAuthenticated, selectSuperAppToken, selectSuperAppUser } from '@/redux';
import { initializeApiWithStore } from '@/services/api/ApiInstance';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import SplashGif from '@/components/splash-screen/newIndex';
import twilioService from '../../services/twilio.service';
import { Alert } from 'react-native';

// 🔥 NEW: Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30,   // 30 minutes - cache cleanup time  
      retry: 1,                 // Retry failed queries once
      refetchOnWindowFocus: false, // Don't refetch when switching apps
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

export default function RootLayout() {
  const fontsLoaded = useFontLoader();
  
  useEffect(() => {
    // Initialize API with store for token management
    initializeApiWithStore(store);
  }, []);

  if (!fontsLoaded) {
    return (
      <GradientBackground style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3853A4" />
          <Text className="text-gray-600 text-center mt-4">
            Loading fonts...
          </Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate 
        loading={
          <GradientBackground style={{ flex: 1 }}>
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3853A4" />
              <Text className="text-gray-600 text-center mt-4">
                Loading app data...
              </Text>
            </View>
          </GradientBackground>
        } 
        persistor={persistor}
      >
        <ApolloRoot />
      </PersistGate>
    </ReduxProvider>
  );
}

// Apollo Root Component with Auth-Aware Routing
const ApolloRoot = () => {
  const [client, setClient] = useState<any>(null);
  const [splashDone, setSplashDone] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [twilioInitialized, setTwilioInitialized] = useState(false);
  
  // Auth state from Redux
  const isAuthenticated = useSelector(selectSuperAppIsAuthenticated);
  const token = useSelector(selectSuperAppToken);
  const user = useSelector(selectSuperAppUser);
  const router = useRouter();

  useEffect(() => {
    // Initialize Sentry
    // Setup Apollo client with current token
    const apolloClient = setupApolloClient({ 
      token: token, 
      userId: null 
    });
    setClient(apolloClient);

    // Give Redux time to rehydrate
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  // Initialize Twilio when user is authenticated
  useEffect(() => {
    const initializeTwilio = async () => {
      if (isAuthenticated && user?.id && !twilioInitialized) {
        try {
          console.log('🚀 Initializing Twilio for user ID:', user.id);
          console.log('📱 Generating Twilio token for customer app with user ID:', user.id);
          await twilioService.initialize(user.id, 'customer');
          setTwilioInitialized(true);
          console.log('✅ Twilio initialized successfully for user:', user.id);
        } catch (error) {
          console.error('❌ Failed to initialize Twilio:', error);
        }
      } else if (!isAuthenticated && twilioInitialized) {
        // Cleanup Twilio when user logs out
        twilioService.cleanup();
        setTwilioInitialized(false);
        console.log('🧹 Twilio cleaned up on logout');
      }
    };

    initializeTwilio();
  }, [isAuthenticated, user?.id, twilioInitialized]);

  // Global incoming call listener
  useEffect(() => {
    if (!twilioInitialized || !isAuthenticated) return;

    twilioService.onIncomingCall = (callInvite) => {
      const callerIdentity = callInvite.getFrom();
      console.log('📞 Incoming call from:', callerIdentity);
      
      Alert.alert(
        'Incoming Call',
        `Call from ${callerIdentity}`,
        [
          {
            text: 'Decline',
            style: 'cancel',
            onPress: () => {
              twilioService.rejectCall();
            }
          },
          {
            text: 'Answer',
            onPress: async () => {
              try {
                await twilioService.acceptCall();
                // Navigate to call screen if you have one
                // router.push('/call');
              } catch (error) {
                console.error('Failed to accept call:', error);
                Alert.alert('Error', 'Failed to answer call');
              }
            }
          }
        ]
      );
    };

    return () => {
      twilioService.onIncomingCall = null;
    };
  }, [twilioInitialized, isAuthenticated]);

  // Show splash screen
  if (!splashDone) {
    return <SplashGif onFinish={() => setSplashDone(true)} />;
  }

  // Show loading while Apollo client is setting up or app is initializing
  if (!client || isInitializing) {
    return (
      <GradientBackground style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3853A4" />
          <Text className="text-gray-600 text-center mt-4">
            {!client ? 'Setting up...' : 'Initializing...'}
          </Text>
        </View>
      </GradientBackground>
    );
  }

  console.log('App Layout - Auth state:', { 
    isAuthenticated, 
    hasToken: !!token, 
    userId: user?.id,
    twilioInitialized 
  });

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* 🔥 NEW: QueryClientProvider wrapper */}
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <ThemeSync />
            
            <Stack screenOptions={{ headerShown: false }}>
              {/* Root index - handles auth routing */}
              <Stack.Screen name="index" />
              
              {/* Authentication screens */}
              <Stack.Screen name="(auth)" /> 
              
              {/* Protected app screens */}
              <Stack.Screen name="home" />
              <Stack.Screen name="(food-delivery)" />
              <Stack.Screen name="(ride)" />
              <Stack.Screen name="(gym)" />
              <Stack.Screen name="(hotel)" />
              <Stack.Screen name="(ticket)" />
              <Stack.Screen name="customer-ride" />
              <Stack.Screen name="zone-selection" />

              {/* Ai Chat Screens */}
              <Stack.Screen name="(ai-chat)" />
              
              {/* 404 fallback */}
              <Stack.Screen name="+not-found" />
            </Stack>
            
            <StatusBar style="dark" />
          </ApolloProvider>
          
          {/* 🔥 NEW: Toast component at the very end */}
          <Toast />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};