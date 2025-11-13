// app/index.tsx - FIXED VERSION WITH AUTH CHECK
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { selectSuperAppIsAuthenticated, selectSuperAppLoading, selectSuperAppUser } from '@/redux';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';

export default function RootPage() {
  const isAuthenticated = useSelector(selectSuperAppIsAuthenticated);
  const isLoading = useSelector(selectSuperAppLoading);
  const user = useSelector(selectSuperAppUser);
  const [isInitializing, setIsInitializing] = useState(true);

  // Give Redux persist a moment to rehydrate state from storage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000); // Wait 1 second for Redux to rehydrate

    return () => clearTimeout(timer);
  }, []);

  console.log("🏠 app/index.tsx - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    isInitializing,
    userName: user?.name || 'No user',
    userPhone: user?.phone || 'No phone'
  });

  // Show loading screen while initializing or checking auth
  if (isInitializing || isLoading) {
    return (
      <GradientBackground style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#3853A4" />
          <Text className="text-gray-600 text-center mt-4">
            {isInitializing ? 'Loading app...' : 'Checking authentication...'}
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated && user) {
    console.log("✅ User is authenticated, redirecting to home");
    console.log("👤 User:", user.name, user.phone);
    return <Redirect href="/home" />;
  } else {
    console.log("❌ User not authenticated, redirecting to welcome");
    return <Redirect href="/(auth)/welcome" />;
  }
}