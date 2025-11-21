import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CustomIcon, CustomText } from '@/components';
import { useAppSelector } from '@/redux';
import { useRouter } from 'expo-router';

export default function EmptyCart() {
  const router = useRouter();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  return (
    <View className="flex-1 bg-background dark:bg-dark-background items-center justify-center px-6">
      <View className="m-6">
        <Image source={require('@/assets/GIFs/empty-cart.gif')} style={styles.gif} resizeMode="contain" />
      </View>

      <CustomText variant="heading1" fontWeight="bold">
        Your cart is empty
      </CustomText>

      <CustomText variant="caption" fontSize="sm" className="mt-2 text-center">
        When you add items from a restaurant or store, your order will be right here, so you can make changes whenever you want.
      </CustomText>

      <TouchableOpacity className="bg-primary mt-8 px-12 py-4 rounded-xl" onPress={() => router.back()}>
        <CustomText className="text-text" fontWeight="semibold" variant="label">
          Start shopping
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gif: {
    width: 250,
    height: 250,
  },
});
