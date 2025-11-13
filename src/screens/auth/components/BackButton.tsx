// src/components/auth/BackButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonProps {
  onPress?: () => void;
  className?: string;
  style?: any;
  iconSize?: number;
  iconColor?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  className = '',
  style,
  iconSize = 24,
  iconColor = '#000000',
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`w-14 h-14 rounded-full bg-transparent border border-gray-300 items-center justify-center ${className}`}
      style={style}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="arrow-back" 
        size={iconSize} 
        color={iconColor} 
      />
    </TouchableOpacity>
  );
};

export default BackButton;