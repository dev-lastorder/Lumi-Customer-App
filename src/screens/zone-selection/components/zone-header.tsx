// src/components/zone/ZoneHeader.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomText } from '@/components/common/CustomText';

interface ZoneHeaderProps {
  dark: boolean;
}

export default function ZoneHeader({ dark }: ZoneHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top }}>
      <LinearGradient
        colors={dark ? ['rgba(0,0,0,0.85)', 'transparent'] : ['rgba(255,255,255,0.9)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.gradient, { height: insets.top + 200 }]}
      />

      <View style={[styles.headerTextContainer, { paddingTop: insets.top + 20 }]}>
        <CustomText variant="heading1" fontWeight="bold" className={dark ? 'text-white' : 'text-black'}>
          Discover{' '}
          <CustomText variant="heading1" fontWeight="bold" className="text-blue-400">
            Enatega
          </CustomText>
        </CustomText>

        <CustomText variant="body" fontWeight="normal" className={dark ? 'text-gray-300 mt-1' : 'text-gray-700 mt-1'}>
          More than 900 cities in 31 countries
        </CustomText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  headerTextContainer: {
    position: 'absolute',
    top: 6,
    left: 16,
  },
});
