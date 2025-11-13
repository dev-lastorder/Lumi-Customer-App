// src/components/checkout/TypeToggle.tsx
import React, { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components/common/CustomText';
import { useAppSelector } from '@/redux';
import { Restaurant } from '@/utils/interfaces';

export interface TypeToggleProps {
  selected: 'Delivery' | 'Pickup';
  onChange: (mode: 'Delivery' | 'Pickup') => void;
  restaurant : Restaurant
}

export const TypeToggle: React.FC<TypeToggleProps> = ({ selected, onChange , restaurant }) => {

  const deliveryEnabled = restaurant?.deliveryOptions?.delivery;
  const pickupEnabled = restaurant?.deliveryOptions?.pickup;

  return (
    <View className="absolute top-safe-or-60 w-full z-50 px-6">
      <View className="flex-row bg-white/40 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
        {/* Delivery */}
        {
          deliveryEnabled && (
            <TouchableOpacity
              onPress={() => onChange('Delivery')}
              className={`flex-1 flex-row items-center rounded-full justify-center py-2 px-4 ${
                selected === 'Delivery' ? 'bg-primary' : 'bg-transparent'
              }`}
            >
              <CustomIcon
                icon={{
                  type: 'Ionicons',
                  name: 'bicycle-outline',
                  size: 18,
                  color: selected === 'Delivery' ? undefined : '#666',
                }}
              />
              <CustomText
                variant="body"
                fontWeight="medium"
                fontSize="sm"
                className={`ml-2 ${selected === 'Delivery' ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                Delivery
              </CustomText>
            </TouchableOpacity>
          )
        }

        {/* Pickup */}
        {
          pickupEnabled && (
            <TouchableOpacity
              onPress={() => onChange('Pickup')}
              className={`flex-1 flex-row items-center rounded-full justify-center py-2 px-4 ${selected === 'Pickup' ? 'bg-primary' : 'bg-transparent'}`}
            >
              <CustomIcon
                icon={{
                  type: 'Ionicons',
                  name: 'walk-outline',
                  size: 18,
                  color: selected === 'Pickup' ? undefined : '#666',
                }}
              />
              <CustomText
                variant="body"
                fontWeight="medium"
                fontSize="sm"
                className={`ml-2 ${selected === 'Pickup' ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                Pickup
              </CustomText>
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
};
