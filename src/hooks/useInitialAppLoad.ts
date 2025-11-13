import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/client';
import * as Location from 'expo-location';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SplashScreen from 'expo-splash-screen';

import { GET_CONFIGURATION, GET_USER_PROFILE } from '@/api';
import { IConfiguration, RootState, setConfiguration, setUser } from '@/redux';

const useAuthToken = () => useSelector((state: RootState) => state.auth.token);

const useAppConfig = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useQuery(GET_CONFIGURATION, {
    fetchPolicy: 'network-only',
  });

  const initializeConfig = async () => {
    if (!data || loading || error) return;

    const enableAppleLogin = await AppleAuthentication.isAvailableAsync();
    const config = {
      ...(data.configuration as IConfiguration),
      enableAppleLogin,
    };

    dispatch(setConfiguration({ configuration: config }));
  };

  return { ready: !loading && !!data, initializeConfig };
};

const useUserProfile = () => {
  const dispatch = useDispatch();
  const [loadProfile, { data, loading }] = useLazyQuery(GET_USER_PROFILE, {
    fetchPolicy: 'network-only',
  });

  const initializeUser = async () => {
    loadProfile();
  };

  useEffect(() => {
    if (!loading && data?.profile) {
      dispatch(setUser(data.profile));
    }
  }, [loading, data]);

  return { initializeUser, loading, isAuthenticated: !!data?.profile };
};

const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location Permission', 'Location access was denied. Some features may not work properly.');
    }
  } catch (err) {
    
  }
};

export const useInitialAppLoad = () => {
  const token = useAuthToken();
  const { ready, initializeConfig } = useAppConfig();
  const { initializeUser, loading: profileLoading, isAuthenticated } = useUserProfile();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeConfig();
        await requestLocationPermission();

        if (token) {
          await initializeUser();
        } else {
          await SplashScreen.hideAsync();
          setInitialized(true);
        }
      } catch (err) {
        Alert.alert('Initialization Error', 'Something went wrong during startup.');
        await SplashScreen.hideAsync();
        setInitialized(true);
      }
    };

    if (ready) init();
  }, [ready]);

  useEffect(() => {
    if (!profileLoading && token) {
      SplashScreen.hideAsync();
      setInitialized(true);
    }
  }, [profileLoading]);

  return {
    isInitializing: !initialized,
    isAuthenticated,
  };
};
