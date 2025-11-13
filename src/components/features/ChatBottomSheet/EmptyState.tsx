// EmptyState.tsx
import React from 'react';
import { Image, Platform, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  imageError: boolean;
  onImageError: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ imageError, onImageError }) => {
  return (
    <View className="flex-1 items-center justify-center px-6 py-4">
      {/* GIF/Image Container - Much smaller */}
      <View className="items-center mb-6">
        {!imageError ? (
          <Image
            source={require('@/assets/GIFs/Final2.gif')}
            style={{
              width: 320,
              height: 270,
            }}
            onError={onImageError}
            resizeMode="contain"
            {...(Platform.OS === 'android' && {
              fadeDuration: 0,
            })}
          />
        ) : (
          <View 
            style={{
              width: 200,
              height: 150,
            }}
            className="justify-center items-center bg-gray-50 rounded-xl"
          >
            <Ionicons name="chatbubbles-outline" size={60} color="#007AFF" />
          </View>
        )}
      </View>
      
      {/* Main Text */}
      <Text className="text-lg font-semibold text-black text-center mb-3 leading-6">
        Need to ask or tell our courier partner something about this delivery?
      </Text>
      
      {/* Subtitle Text */}
      <Text className="text-sm text-gray-600 text-center leading-5 px-2">
        All Courier conversations are monitored and stored by Wolt Support. Wolt may participate in the conversations.
      </Text>
    </View>
  );
};

export default EmptyState;