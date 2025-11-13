// ──────────────────────────────────────────────
// 📦 Imports
// ──────────────────────────────────────────────
import React from 'react';
import { View } from 'react-native';

// 🔧 Components
import { CustomText } from '@/components';
import { useLocalSearchParams } from 'expo-router';
import { Restaurant } from '@/utils';

// ──────────────────────────────────────────────
// 🧩 Component: RestaurantHeaderInfo
// ──────────────────────────────────────────────
const RestaurantHeaderInfo = () => {


  const {info} = useLocalSearchParams()
  const {name} = !!info ? JSON.parse(info as string) as unknown as Restaurant : {}

  return (
    <View>
      <CustomText variant="heading1" fontWeight="bold" className="text-3xl text-black dark:text-white">
        {name}
      </CustomText>

      <CustomText variant="body" fontWeight="normal" className="text-base text-text dark:text-gray-300 mt-3">
        Preservation of the authentic taste of all traditional foods is upheld here.
      </CustomText>
    </View>
  );
};

export default RestaurantHeaderInfo;
