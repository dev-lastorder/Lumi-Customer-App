import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { CustomText } from '@/components';
import { router } from 'expo-router';

const main = () => {
  return (
    <View className="w-full h-full items-center justify-center bg-background dark:bg-dark-background px-4">
      {/* Heading Text */}
      <CustomText variant="heading2" fontWeight="semibold" className="mb-4 text-center">
        Hello, this is Profile Main Page
      </CustomText>

      {/* Button to go to Addresses */}
      <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg" onPress={() => router.push('/(food-delivery)/(profile)/my-addresses')}>
        <CustomText variant="body" fontWeight="medium" lightColor="#fff" darkColor="#fff">
          Go to My Addresses
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default main;
