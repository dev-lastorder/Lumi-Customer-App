import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { CustomText } from '@/components';

export default function CheckoutButton({ count, total, onPress }: { count: number; total: number; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="absolute bottom-14 left-4 right-4 bg-primary rounded-md flex-row items-center px-6 py-4 shadow-base"
    >
      <View className="bg-white rounded-full w-8 h-8 items-center justify-center mr-4">
        <CustomText variant="body" fontWeight="bold" lightColor="#AAC810" darkColor="#AAC810">
          {count}
        </CustomText>
      </View>
      <CustomText variant="body" fontWeight="semibold" lightColor="white" darkColor="white" className="flex-1 text-white">
        Go to checkout
      </CustomText>
      <CustomText variant="body" fontWeight="bold" lightColor="white" darkColor="white" className="text-white">
        {total.toFixed(2)} €
      </CustomText>
    </TouchableOpacity>
  );
}
