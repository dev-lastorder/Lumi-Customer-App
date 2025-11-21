import React from 'react';

// 📦 Components
import { View, Text, TouchableOpacity } from 'react-native';
import { CustomIcon } from '@/components/common/Icon';
import { CustomText } from '@/components';

// 🛠️ Utilities & Types
import { SpecificIconProps } from '@/utils/interfaces';
import { AddressesListCardProps } from './interface';

// 🔁 Navigation & State
import { router } from 'expo-router';
import { useAddNewAddress } from '@/hooks/useAddNewAddress';

// 🧠 Helper to get icon based on address label
const getIconPropsByLabel = (label: string): SpecificIconProps => {
  const labelLower = label.toLowerCase();

  switch (labelLower) {
    case 'apartment':
      return { type: 'MaterialCommunityIcons', name: 'home-city', size: 22, color: '#A5C616' };
    case 'house':
      return { type: 'FontAwesome5', name: 'home', size: 22, color: '#A5C616' };
    case 'office':
      return { type: 'MaterialIcons', name: 'business', size: 22, color: '#A5C616' };
    case 'other':
    default:
      return { type: 'MaterialIcons', name: 'park', size: 22, color: '#A5C616' };
  }
};

const AddressesListCard: React.FC<AddressesListCardProps> = ({ address }) => {
  // 🧠 Get icon based on label (e.g. House, Office, etc.)
  const iconProps = getIconPropsByLabel(address?.label || 'other');

  // 🔁 Hooks
  const { updateAddressId, updateZone, updateLocation, updateLocationType, updateOtherDetails, updateLatitude, updateLongitude } = useAddNewAddress();

  // 📍 Handle navigation to update address screen with pre-filled values
  const handleEdit = () => {
    // 🔄 Update Redux state with selected address details
    updateAddressId(address._id);

    // ✅ Set zone (if available)
    if (address?.zone) {
      updateZone(address.zone._id, address.zone.title);
    }

    // ✅ Update location data
    updateLocation(address.deliveryAddress);
    updateOtherDetails(address.details);
    updateLocationType(address.label); // Using label as locationType

    // ✅ Set coordinates (if available)
    if (address.location?.coordinates?.length === 2) {
      updateLongitude(address.location.coordinates[0]);
      updateLatitude(address.location.coordinates[1]);
    }

    // 🚀 Navigate to update screen
    router.push('/(food-delivery)/(profile)/update-address');
  };

  return (
    <View className="flex-row justify-between items-center px-4 py-5 border-b border-neutral-300 dark:border-dark-border/30 bg-white dark:bg-dark-background">
      {/* Left section with icon and address text */}
      <View className="flex-row items-center flex-1 pr-2">
        {/* <CustomIcon icon={iconProps} className="text-primary mr-3" /> */}
        <View className="flex-1">
          <CustomText variant="body" fontWeight="normal" fontSize="sm">
            {address?.zone?.title || 'Unknown zone'}
          </CustomText>
          <CustomText variant="caption" fontSize="sxx" fontFamily="Inter" className="text-gray-500 dark:text-gray-300 leading-tight">
            {address?.deliveryAddress}
          </CustomText>
        </View>
      </View>

      {/* Right 3-dot menu icon */}
      <TouchableOpacity onPress={handleEdit} className="p-2 rounded-full bg-icon-background dark:bg-dark-icon-background">
        <CustomIcon icon={{ name: 'dots-three-horizontal', type: 'Entypo', size: 14 }} className="text-gray-600 dark:text-gray-300" />
      </TouchableOpacity>
    </View>
  );
};

export default AddressesListCard;
