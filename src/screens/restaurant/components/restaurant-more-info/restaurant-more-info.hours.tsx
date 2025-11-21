// ─────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────
import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';

// 🔧 Components
import { CustomText } from '@/components';
import { useLocalSearchParams } from 'expo-router';
import { Restaurant } from '@/utils';

// ─────────────────────────────────────────────
// 🧩 Component: RestaurantHours
// ─────────────────────────────────────────────
const RestaurantHours = () => {
  const { info } = useLocalSearchParams();
  const { openingTimes } = !!info ? (JSON.parse(info as string) as unknown as Restaurant) : {};

  return (
    <View className="mb-6">
      <View className="d-flex flex-row items-center justify-between">
        {/* ── Section Title */}
        <CustomText variant="subheading" fontWeight="semibold" fontSize="lg" className="mb-2 text-black dark:text-white ">
          Opening hours
        </CustomText>
      </View>

      {/* ── Schedule List */}
      {openingTimes?.map((item) => (
        <View key={item.day} className="flex-row justify-between px-2 py-2 border-b border-gray-100 dark:border-gray-700">
          <CustomText className="text-base text-text dark:text-dark-text">{item.day}</CustomText>
          <View>
            {item.times.map((dayTime, _) => {
              return (
                <CustomText key={_ + Math.random()} className="text-base text-text dark:text-dark-text">
                  {dayTime.startTime[0]}:{dayTime.startTime[1]} - {dayTime.endTime[0]}:{dayTime.endTime[1]}
                </CustomText>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
};

export default RestaurantHours;
