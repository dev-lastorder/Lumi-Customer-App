// ====================================
// Imports
// ====================================
import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';

// Components & Hooks
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import { AddNewAddressDetailLocationTypeSelector } from '../add-new-address-detail';
import { useAddNewAddress } from '@/hooks/useAddNewAddress';

// Constants & Types
import { LocationTypeOptions } from '../add-new-address-detail/constant';
import { UpdateAddressContentProps } from './interface';

// ====================================
// Component: UpdateAddressContent
// ====================================
const UpdateAddressContent: React.FC<UpdateAddressContentProps> = ({
  setZoneModalVisible,
  setAddressModalVisible,
  showDropdown,
  setShowDropdown,
  onUpdateZone,
  onUpdateLocation,
  onUpdateLocationType,
  onUpdateOtherDetails,
}) => {
  const { address } = useAddNewAddress();

  return (
    <View className="">
      {/* ── Zone Selector ───────────────────────────── */}
      <TouchableOpacity
        onPress={() => setZoneModalVisible(true)}
        className="border border-border dark:border-dark-border/30 rounded-lg p-5 mb-4 flex-row justify-between items-center bg-transparent"
      >
        {address?.zoneTitle ? (
          <View>
            <CustomText variant="caption" className="text-text-muted dark:text-dark-white">
              Zone
            </CustomText>
            <CustomText variant="body" fontSize="md" className="mt-1 text-text dark:text-dark-text">
              {address?.zoneTitle}
            </CustomText>
          </View>
        ) : (
          <CustomText variant="body" fontSize="sm" className="text-text dark:text-dark-text">
            Select a zone
          </CustomText>
        )}
        <CustomIcon className="text-text dark:text-dark-text" icon={{ type: 'Feather', name: 'chevron-down', size: 20 }} />
      </TouchableOpacity>

      {/* ── Address Selector ───────────────────────── */}
      <TouchableOpacity
        onPress={() => setAddressModalVisible(true)}
        className="border border-border dark:border-dark-border/30 bg-white dark:bg-dark-background p-5 rounded-lg mb-6"
      >
        <CustomText variant="body" fontSize="sm" className="text-text dark:text-dark-text">
          {address?.location || 'Street name and number'}
        </CustomText>
      </TouchableOpacity>

      {/* ── Location Type Dropdown ─────────────────── */}
      <View className="mb-4">
        <CustomText variant="heading3" fontWeight="medium" fontSize="md">
          Location type
        </CustomText>
        <CustomText variant="caption" className="mb-3 text-gray-500">
          The location type helps us to find you better.
        </CustomText>

        <AddNewAddressDetailLocationTypeSelector
          selected={address?.locationType}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onSelect={(val) => {
            onUpdateLocationType(val);
            setShowDropdown(true);
          }}
          options={LocationTypeOptions}
        />
      </View>

      {/* ── Additional Address Details ─────────────── */}
      <View>
        <CustomText variant="heading3" fontWeight="medium" fontSize="md" className="mb-2">
          Address other details
        </CustomText>

        <TextInput
          placeholder="e.g. Home, Office, Apartment A1"
          value={address?.otherDetails}
          onChangeText={onUpdateOtherDetails}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="bg-white dark:bg-dark-card border border-border dark:border-dark-border/30 rounded-xl px-4 py-3 h-24 text-base text-black dark:text-dark-text"
        />
      </View>
    </View>
  );
};

export default UpdateAddressContent;
