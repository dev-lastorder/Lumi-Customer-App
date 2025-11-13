// ─────────────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────────────
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// ⛓️ Components
import { CustomIconButton } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import CustomIconButtom from '@/components/common/Buttons/CustomIconButton';
import { CustomText } from '@/components';

// 🧠 Types
import { AddNewAddressContentProps } from './interface';

const AddNewaddressContent: React.FC<AddNewAddressContentProps> = ({ selectedZone, location, setZoneModalVisible, setAddressModalVisible }) => {
  
  // Hooks
  const { redirectTo } = useLocalSearchParams();
  return (
    <>
      {/* ─── Zone Selector ───────────────────────────── */}
      <TouchableOpacity
        onPress={() => setZoneModalVisible(true)}
        className="border border-border dark:border-dark-border/30 rounded-lg p-5 mb-4 flex-row justify-between items-center bg-transparent"
      >
        {selectedZone ? (
          <View>
            <CustomText variant="caption" className="text-text-muted dark:text-dark-white">
              Zone
            </CustomText>
            <CustomText variant="body" className="mt-1 text-text dark:text-dark-text">
              {selectedZone}
            </CustomText>
          </View>
        ) : (
          <CustomText variant="body" fontSize="sm">
            Select a zone
          </CustomText>
        )}
        <CustomIcon className="text-text dark:text-dark-text" icon={{ type: 'Feather', name: 'chevron-down', size: 20 }} />
      </TouchableOpacity>

      {/* ─── Address Selector ────────────────────────── */}
      <TouchableOpacity
        onPress={() => {
          setAddressModalVisible(true);
        }}
        className="border border-border dark:border-dark-border/30 bg-white dark:bg-dark-background p-5 rounded-lg mb-6"
      >
        <CustomText variant="body" fontSize="sm">
          {location ? location : 'Street name and number'}
        </CustomText>
      </TouchableOpacity>

      {/* ─── Continue Button ─────────────────────────── */}
      {location && selectedZone && (
        <View className="items-center mb-6">
          <CustomIconButtom
            label="Continue"
            onPress={() => router.push(`/(food-delivery)/(profile)/add-new-address-detail?redirectTo=${redirectTo}`)}
            backgroundColor="#AAC810"
            textColor="white"
            width={'100%'}
            borderColor="#C2EEFF"
          />
        </View>
      )}

      {/* ─── OR Divider ─────────────────────────────── */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-border" />
        <CustomText variant="caption" className="px-2 text-text-muted">
          or
        </CustomText>
        <View className="flex-1 h-px bg-border" />
      </View>

      {/* ─── Set Location on Map Button ─────────────── */}
      <View className="items-center mb-6">
        <CustomIconButton
          label="Set location on a map"
          onPress={() => router.push('/(food-delivery)/(profile)/get-location-add-new-address')}
          icon={{ type: 'Feather', name: 'map-pin', size: 18, color: '#AAC810' }}
          backgroundColor="#AAC8101A"
          textColor="#AAC810"
          width={'100%'}
          borderColor="#C2EEFF"
        />
      </View>

      {/* ─── Image Section ───────────────────────────── */}
      <View className="flex-1 items-center justify-center">
        <Image source={require('@/assets/images/burger.png')} className="w-full h-100 resize-contain" />
      </View>
    </>
  );
};

export default AddNewaddressContent;
