// src/components/auth/AuthGuard.tsx - NEW COMPONENT
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { selectSuperAppIsAuthenticated, selectSuperAppLoading } from '@/redux';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// AuthGuard: Redirects authenticated users away from auth screens
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/home',
  fallback
}) => {
  const isAuthenticated = useSelector(selectSuperAppIsAuthenticated);
  const isLoading = useSelector(selectSuperAppLoading);

  // Show loading state while checking auth
  if (isLoading) {
    return fallback || (
      <GradientBackground style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#3853A4" />
          <Text className="text-gray-600 text-center mt-4">
            Checking authentication...
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // If authenticated, redirect to home
  if (isAuthenticated) {
    console.log('AuthGuard: User is authenticated, redirecting to:', redirectTo);
    return <Redirect href={'/home'} />;
  }

  // If not authenticated, show the auth screens
  console.log('AuthGuard: User not authenticated, showing auth screens');
  return <>{children}</>;
};

// ProtectedRoute: Redirects unauthenticated users to auth screens
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/(auth)/welcome',
  fallback
}) => {
  const isAuthenticated = useSelector(selectSuperAppIsAuthenticated);
  const isLoading = useSelector(selectSuperAppLoading);

  // Show loading state while checking auth
  if (isLoading) {
    return fallback || (
      <GradientBackground style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#3853A4" />
          <Text className="text-gray-600 text-center mt-4">
            Loading...
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // If not authenticated, redirect to auth
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User not authenticated, redirecting to:', redirectTo);
    return <Redirect href={'/(auth)/welcome'} />;
  }

  // If authenticated, show the protected content
  console.log('ProtectedRoute: User is authenticated, showing protected content');
  return <>{children}</>;
};

// Combined export for convenience
export const AuthComponents = {
  AuthGuard,
  ProtectedRoute,
};

export default { AuthGuard, ProtectedRoute };