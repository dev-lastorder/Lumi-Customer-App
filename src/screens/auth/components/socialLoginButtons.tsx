// src/components/auth/SocialLoginButtons.tsx - FIXED VERSION
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onApplePress: () => void;
  loading?: boolean;
  showApple?: boolean;
  className?: string;
  sectionTitle?: string;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onApplePress,
  loading = false,
  showApple = true,
  className = '',
  sectionTitle = "Log in with",
}) => {
  return (
    <View className={`w-full ${className}`}>
      {/* Section Title with Lines */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text 
          className="px-4 text-base font-medium"
          style={{ color: '#969696' }}
        >
          {sectionTitle}
        </Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Buttons Container */}
      <View className="flex-row gap-3 w-full">
        {/* Apple Button - Left Side with ActivityIndicator */}
        {showApple && (
          <TouchableOpacity
            onPress={onApplePress}
            disabled={loading}
            className={`flex-1 rounded-full py-4 px-6 flex-row items-center justify-center ${
              loading ? 'opacity-50' : ''
            }`}
            style={{ backgroundColor: '#000000' }}
            activeOpacity={0.8}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text className="text-white text-base font-semibold">
                  Apple
                </Text>
              </>
            ) : (
              <>
                <Ionicons 
                  name="logo-apple" 
                  size={20} 
                  color="#FFFFFF" 
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white text-base font-semibold">
                  Apple
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Google Button - Right Side with ActivityIndicator */}
        <TouchableOpacity
          onPress={onGooglePress}
          disabled={loading}
          className={`${showApple ? 'flex-1' : 'w-full'} rounded-full py-4 px-6 flex-row items-center justify-center bg-white border border-gray-200 ${
            loading ? 'opacity-50' : ''
          }`}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#1F2937" style={{ marginRight: 8 }} />
              <Text 
                className="text-base font-semibold"
                style={{ color: '#1F2937' }}
              >
                Google
              </Text>
            </>
          ) : (
            <>
              <Ionicons 
                name="logo-google" 
                size={20} 
                color="#1F2937" 
                style={{ marginRight: 8 }}
              />
              <Text 
                className="text-base font-semibold"
                style={{ color: '#1F2937' }}
              >
                Google
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Alternative version with your CustomIconButton integration
export const SocialLoginButtonsIntegrated: React.FC<SocialLoginButtonsProps & {
  CustomIconButton: any; // Your CustomIconButton component
}> = ({
  onGooglePress,
  onApplePress,
  loading = false,
  showApple = true,
  className = '',
  sectionTitle = "Log in with",
  CustomIconButton,
}) => {
  return (
    <View className={`w-full ${className}`}>
      {/* Section Title with Lines */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text 
          className="px-4 text-base font-medium"
          style={{ color: '#969696' }}
        >
          {sectionTitle}
        </Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Buttons Container */}
      <View className="flex-row gap-3 w-full">
        {/* Apple Button */}
        {showApple && (
          <View className="flex-1">
            <CustomIconButton
              icon={{ name: 'logo-apple', color: '#FFFFFF' }}
              label="Apple"
              onPress={onApplePress}
              backgroundColor="#000000"
              textColor="#FFFFFF"
              disabled={loading}
              className="rounded-full"
              height={50}
              textStyle={{ fontSize: 16, fontWeight: '600' }}
              loading={loading}
            />
          </View>
        )}

        {/* Google Button */}
        <View className={showApple ? 'flex-1' : 'w-full'}>
          <CustomIconButton
            icon={{ name: 'logo-google', color: '#4285F4' }}
            label="Google"
            onPress={onGooglePress}
            backgroundColor="#FFFFFF"
            textColor="#1F2937"
            borderColor="#E5E7EB"
            disabled={loading}
            className="rounded-full border"
            height={50}
            textStyle={{ fontSize: 16, fontWeight: '600' }}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default { SocialLoginButtons, SocialLoginButtonsIntegrated };