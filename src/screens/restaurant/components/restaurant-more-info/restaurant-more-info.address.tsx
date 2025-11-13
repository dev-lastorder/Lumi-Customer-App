// ──────────────────────────────────────────────
// 📦 Imports
// ──────────────────────────────────────────────
import React from 'react';
import { View, TouchableOpacity } from 'react-native';

// 🔧 Components
import { CustomText } from '@/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Restaurant } from '@/utils';
import { linkToMapsApp } from '@/utils/methods';

// ──────────────────────────────────────────────
// 🧩 Component: RestaurantAddress
// ──────────────────────────────────────────────
const RestaurantAddress = () => {

  const {info} = useLocalSearchParams()
  const {address, location} = !!info ? JSON.parse(info as string) as unknown as Restaurant : {}

  return (
    <View>
      {/* Seller Info */}
      {/* <CustomText variant="caption" fontSize="sm" className="text-sm text-gray-500 dark:text-gray-300 mt-4">
        E-Mail: support@wolt.com
      </CustomText> */}

      {/* Address Heading */}
      <CustomText variant="subheading" fontWeight="semibold" fontSize="lg" className="text-xl text-black dark:text-white mt-6 mb-2">
        Address
      </CustomText>

      {/* Address Details & Button */}
      <View className="flex-row justify-between items-center mb-4 gap-3 flex-1">
        <View className="flex-1">
          <CustomText variant="body" fontSize="sm">
            {address}
          </CustomText>
        </View>

        <TouchableOpacity onPress={() => linkToMapsApp({latitude: location?.coordinates[1] ?? 0, longitude: location?.coordinates[0] ?? 0},"Store")}>
          <CustomText variant="body" fontWeight="semibold" darkColor="#AAC810" lightColor="#AAC810">
            Directions
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestaurantAddress;
