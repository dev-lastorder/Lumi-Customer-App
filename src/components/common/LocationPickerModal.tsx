// Refactored LocationPickerModal with design context applied
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';

import { GET_ALL_ADDRESSES, GET_ZONES } from '@/api';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import { CustomIcon, CustomText } from '@/components';
import CustomBottomSheetModal from './BottomModalSheet/CustomBottomSheetModal';
import ChooseZoneModal from '../modals/choose-zone.modal';
import { Zone } from '../modals/interfaces';
import { LocationObject, LocationGeocodedAddress } from 'expo-location';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  redirectTo?: string;
}

interface Address {
  _id: string;
  label: string;
  deliveryAddress: string;
  location: {
    coordinates: [number, number];
  };
  zone?: {
    _id: string;
    title: string;
    location?: {
      coordinates?: number[][];
    };
  };
}
/* Use Zone type from '../modals/interfaces' instead of redefining it here */


interface AddressItemProps {
  addr: Address;
  isSelected: boolean;
  onSelect: (addr: Address) => void;
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

const requestAndFetchLocation = async (): Promise<LocationObject> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') throw new Error('Permission denied');
  return await Location.getCurrentPositionAsync({});
};

const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<LocationGeocodedAddress> => {
  const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
  return geocode[0];
};

const extractLatLngFromAddress = (addr: Address): [number, number] =>
  addr.location.coordinates.map(Number) as [number, number];

// ─────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────

const AddressItem: React.FC<AddressItemProps> = ({ addr, isSelected, onSelect }) => (
  <TouchableOpacity
    key={addr._id}
    className="flex-row items-center justify-between py-4 border-t border-gray-100 pr-4"
    onPress={() => onSelect(addr)}
  >
    <View className="flex-row items-center">
      <CustomIcon icon={{ type: 'Entypo', name: 'home', size: 22 }} />
      <View className="flex-1 pl-3">
        <CustomText variant="subheading" className={isSelected ? 'text-primary' : 'dark:text-white'}>
          {addr?.label || 'Saved Address'}   
        </CustomText>
        <CustomText variant="caption" className={isSelected ? 'text-primary' : 'text-gray-500'}>
          {addr?.deliveryAddress}
        </CustomText>
      </View>
    </View>
    {isSelected && (
      <CustomIcon icon={{ type: 'Feather', name: 'check', size: 18, color: '#AAC810' }} />
    )}
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

const LocationPickerModal: React.FC<Props> = ({ visible, onClose, onOpen, redirectTo }) => {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { data: addressesData } = useQuery(GET_ALL_ADDRESSES);
  const { data: zonesData, loading: zonesLoading } = useQuery(GET_ZONES);
  const { updateCurrentLocation, updateAddress, updateZone, location } = useLocationPicker();

  useEffect(() => {
    const initializeLocation = async () => {
      if (addressesData?.profile?.addresses?.length && !location.type) {
        try {
          const position = await requestAndFetchLocation();
          const place = await reverseGeocode(position.coords.latitude, position.coords.longitude);

          updateCurrentLocation({
            title: place?.city || 'Current Location',
            latitude: String(position.coords.latitude),
            longitude: String(position.coords.longitude),
          });
        } catch (error) {
          console.error('Auto-init location failed', error);
        }
      }
    };

    initializeLocation();
  }, [addressesData, location]);

  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const status = await Location.getForegroundPermissionsAsync();
      if (status.status === 'denied') {
        Alert.alert(
          'Location Permission Denied',
          'Enable location services from settings',
          [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
        );
        return;
      }

      const position = await requestAndFetchLocation();
      const place = await reverseGeocode(position.coords.latitude, position.coords.longitude);

      updateCurrentLocation({
        title: place?.city || 'Current Location',
        latitude: String(position.coords.latitude),
        longitude: String(position.coords.longitude),
      });

      onClose();
    } catch (error) {
      console.error('Error fetching location', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAddressSelect = (addr: Address) => {
    const [lat, lng] = extractLatLngFromAddress(addr);
    updateAddress({
      addressId: addr._id,
      label: addr.label,
      selectedTitle: addr?.zone?.title || 'Unknown Zone',
      latitude: String(lat),
      longitude: String(lng),
      zoneId: addr?.zone?._id || '',
      zoneTitle: addr?.zone?.title || 'Unknown Zone',
      zoneCoordinates: [],
    });
    onClose();
  };

  return (
    <>
      <CustomBottomSheetModal visible={visible} onClose={onClose} headerTitle="Choose your location" maxHeight="85%">
        <View className="pb-5">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: inset.bottom }}
          >
            <TouchableOpacity className="flex-row items-center justify-between py-4" onPress={handleCurrentLocation}>
              <View className="flex-row items-center">
                <CustomIcon
                  icon={{
                    type: 'Feather',
                    name: 'target',
                    size: 24,
                    color: location?.type === 'current' ? '#AAC810' : undefined,
                  }}
                />
                <CustomText variant="subheading" className={`pl-3 ${location.type === 'current' ? 'text-primary' : 'text-text dark:text-dark-text'}`}>
                  Use my current location
                </CustomText>
              </View>
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color="#A5C616" />
              ) : (
                location.type === 'current' && (
                  <CustomIcon icon={{ type: 'Feather', name: 'check', size: 18, color: '#AAC810' }} />
                )
              )}
            </TouchableOpacity>

            {addressesData?.profile?.addresses?.map((addr: Address) => (
              <AddressItem
                key={addr._id}
                addr={addr}
                isSelected={location.type === 'address' && location.addressId === addr._id}
                onSelect={handleAddressSelect}
              />
            ))}

            <TouchableOpacity
              className="flex-row items-center py-4 border-t border-gray-100"
              onPress={() => {
                onClose();
                router.push(`/(food-delivery)/(profile)/add-new-address?redirectTo=${redirectTo}`);
              }}
            >
              <CustomIcon icon={{ type: 'Feather', name: 'plus', size: 20 }} />
              <CustomText variant="body" className="pl-3">
                Add new address
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-4 border-t border-gray-100"
              onPress={() => {
                onClose();
                setZoneModalVisible(true);
              }}
            >
              <CustomIcon icon={{ type: 'Feather', name: 'list', size: 20 }} />
              <CustomText variant="body" className="pl-3">
                Browse all zones
              </CustomText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </CustomBottomSheetModal>

      <ChooseZoneModal
        visible={zoneModalVisible}
        zones={zonesData?.zonesCentral || []}
        selectedZoneId={location.zoneId ?? null}
        loading={zonesLoading}
        onClose={() => {
          setZoneModalVisible(false);
          onOpen();
        }}
        onSelect={(zone: Zone) => {
          console.log(JSON.stringify({zone},null,2));
          updateZone({
            addressId:'',
            label:'',
            latitude:zone.location.coordinates[1],
            longitude:zone.location.coordinates[0],
            zoneId: zone._id,
            zoneTitle: zone.title,
            selectedTitle: zone.title,
            zoneCoordinates:[],
            
          });
          setZoneModalVisible(false);
          onOpen();
        }}
      />
    </>
  );
};

export default LocationPickerModal;