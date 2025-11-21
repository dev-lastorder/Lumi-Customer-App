// src/components/zone/ZoneFooterButton.tsx

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { CustomText } from '@/components/common/CustomText';

interface ZoneFooterButtonProps {
  insets: any;
  onPress: () => void;
}

export default function ZoneFooterButton({ insets, onPress }: ZoneFooterButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="absolute left-4 right-4 rounded-lg bg-primary items-center justify-center py-4"
      style={{ borderRadius:200, bottom:insets.bottom + 32 }}
      onPress={onPress}
    >
      <CustomText variant="button" fontWeight="medium" fontSize="sm" lightColor="white" darkColor="white">
        Explore More Zones
      </CustomText>
    </TouchableOpacity>
  );
}
