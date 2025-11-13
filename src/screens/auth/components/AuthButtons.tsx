// src/components/auth/AuthButtons.tsx - FIXED VERSION
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface RequestOTPButtonProps {
  onPress: () => void;
  text?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

interface GuestButtonProps {
  onPress: () => void;
  text?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

// Request OTP Button (Blue primary button) with ActivityIndicator
export const RequestOTPButton: React.FC<RequestOTPButtonProps> = ({
  onPress,
  text = "Request OTP",
  loading = false,
  disabled = false,
  className = '',
}) => {
  const isDisabled = loading || disabled;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-full py-4 px-8 items-center justify-center w-full mb-6 ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      style={{ backgroundColor: '#3853A4' }}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text className="text-white text-lg font-semibold">
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Guest Button (Secondary/transparent button) with ActivityIndicator
export const GuestButton: React.FC<GuestButtonProps> = ({
  onPress,
  text = "Visit as Guest",
  className = '',
  loading = false,
  disabled = false,
}) => {
  const isDisabled = loading || disabled;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-full py-4 px-8 items-center justify-center w-full mb-6 bg-white/50 border border-gray-200 ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#969696" />
      ) : (
        <Text 
          className="text-lg font-medium"
          style={{ color: '#969696' }}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Combined export for convenience
export const AuthButtons = {
  RequestOTP: RequestOTPButton,
  Guest: GuestButton,
};

export default AuthButtons;