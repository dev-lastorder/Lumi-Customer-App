import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';

// ─── API & Hooks ─────────────────────────────────────────────
import { GET_ZONES } from '@/api';
import { useAddNewAddress } from '@/hooks/useAddNewAddress';

// ─── Components ───────────────────────────────────────────────
import ChooseZoneModal from '@/components/modals/choose-zone.modal';
import AddressSearchModal from '../components/add-new-address/add-new-address.address-search.modal';
import { AddNewAddressContentComponent } from '../components/add-new-address';
import { CustomHeader } from '@/components';
import { useRouter } from 'expo-router';
// import LocationPermissionModal from '../components/add-new-address/add-new-address.location-permisssion.modal'; // Optional

// ─── Types ────────────────────────────────────────────────────
interface Zone {
  _id: string;
  title: string;
  location: {
    coordinates: number[][][];
  };
}

const AddNewAddressScreen = () => {
  // ─── Local State ───────────────────────────────────────────
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(true);

  // ─── Hooks ─────────────────────────────────────────────────
  const router = useRouter();
  const { data: zonesData, loading: zonesLoading } = useQuery(GET_ZONES);
  const insets = useSafeAreaInsets();
  const { address, updateZone, updateLocation, updateLatitude, updateLongitude } = useAddNewAddress();

  // ─── Handlers ──────────────────────────────────────────────
  const handleAcceptLocation = ({ location, latitude, longitude }: any) => {
    updateLocation(location);
    updateLatitude(latitude);
    updateLongitude(longitude);
    setLocationModalVisible(false);
  };

  const handleRejectLocation = () => {
    setLocationModalVisible(false);
  };

  // ─── Render ────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-background dark:bg-dark-background ">
      {/* Header */}
      <CustomHeader title="Add new address" showGoBack={true} onGoBack={() => router.back()} rightIcons={[]} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="px-4 py-6">
        {/* Main Form Content */}
        <AddNewAddressContentComponent
          selectedZone={address.zoneTitle}
          location={address.location}
          setAddressModalVisible={setAddressModalVisible}
          setZoneModalVisible={setZoneModalVisible}
        />
      </ScrollView>
      {/* Zone Selection Modal */}
      <ChooseZoneModal
        visible={zoneModalVisible}
        selectedZoneId={address.zoneId}
        onClose={() => setZoneModalVisible(false)}
        onSelect={(zone) => {
          updateZone(zone._id, zone.title);
          setZoneModalVisible(false);
        }}
        zones={zonesData?.zonesCentral || []}
        loading={zonesLoading}
      />

      {/* Address Search Modal */}
      <AddressSearchModal
        onSelect={(address) => {
          if (address === 'MAP') {
            setAddressModalVisible(false);
            router.push('/(food-delivery)/(profile)/get-location-add-new-address');
            return;
          }
          updateLocation(address);
          setAddressModalVisible(false);
        }}
        onSelectLatLong={({ latitude, longitude }) => {
          updateLatitude(String(latitude));
          updateLongitude(String(longitude));
        }}
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        zoneCoordinates={zonesData?.zonesCentral?.find((z: Zone) => z._id === address.zoneId)?.location?.coordinates[0] || []}
      />

      {/* Optional Location Permission Modal (if needed) */}
      {/* <LocationPermissionModal
        visible={locationModalVisible}
        onAccept={handleAcceptLocation}
        onReject={handleRejectLocation}
      /> */}
    </View>
  );
};

export default AddNewAddressScreen;
