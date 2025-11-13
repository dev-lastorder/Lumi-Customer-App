import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CustomIcon } from '@/components/common/Icon';
import AnimatedIconButton from '@/components/common/Buttons/AnimatedIconButton';
import CustomIconButton from '@/components/common/Buttons/CustomIconButton';
import UpdateAddressHeader from '../components/update-address/update-address.header';
import { UpdateAddressContent } from '../components/update-address';
import ChooseZoneModal from '@/components/modals/choose-zone.modal';
import AddressSearchModal from '../components/add-new-address/add-new-address.address-search.modal';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_ADDRESS, GET_ALL_ADDRESSES, GET_ZONES } from '@/api';
import { useAddNewAddress } from '@/hooks/useAddNewAddress';
import { isEqual } from 'lodash';
import ConfirmDeleteAddressModal from '../components/update-address/update-address.confirm-delete-modal';
import { DELETE_ADDRESS } from '@/api/graphql/mutation/delete-address';
interface Zone {
  _id: string;
  title: string;
  location: {
    coordinates: number[][][];
  };
}

const UpdateAddressScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { address, updateZone, updateLocation, updateLocationType, updateOtherDetails, resetAddress } = useAddNewAddress();
  const [originalAddress, setOriginalAddress] = useState(address);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { data: zonesData } = useQuery(GET_ZONES);
  const [editAddress, { loading: isUpdating }] = useMutation(EDIT_ADDRESS, {
    refetchQueries: ['Addresses'], // <- this is the operation name (not the variable)
    awaitRefetchQueries: true,
  });

  const [deleteAddress, { loading: isDeleting }] = useMutation(DELETE_ADDRESS, {
    refetchQueries: ['Addresses'], // <- this is the operation name (not the variable)
    awaitRefetchQueries: true,
  });

  // Set original address on mount
  useEffect(() => {
    setOriginalAddress({ ...address });
  }, []);

  const hasChanged = !isEqual(address, originalAddress);

  const handleUpdateAddress = async () => {
    try {
      await editAddress({
        variables: {
          addressInput: {
            _id: address._id,
            longitude: address.longitude,
            latitude: address.latitude,
            deliveryAddress: address.location,
            details: address.otherDetails,
            label: address.locationType,
            zone: address.zoneId,
          },
        },
      });
      resetAddress();
      // Optional: Show toast, navigate back
      router.back();
    } catch (error) {

    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* Sticky Header */}
      <UpdateAddressHeader setDeleteModalVisible={setDeleteModalVisible} />
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-4">
        {/* Add your input fields, dropdowns, etc., here */}
        <UpdateAddressContent
          setZoneModalVisible={setZoneModalVisible}
          setAddressModalVisible={setAddressModalVisible}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          onUpdateZone={updateZone}
          onUpdateLocation={updateLocation}
          onUpdateLocationType={updateLocationType}
          onUpdateOtherDetails={updateOtherDetails}
        />
        {/* Add all input components below (like TextInput, Picker, etc.) */}
      </ScrollView>

      {/* Sticky Footer */}
      <View className="absolute bottom-0  left-0 right-0 px-4 pb-5 bg-background dark:bg-dark-background">
        <CustomIconButton
          label={isUpdating ? 'Updating address ...' : 'Update address'}
          onPress={handleUpdateAddress}
          textColor="white"
          width="100%"
          backgroundColor="#A5C616"
          borderRadius={15}
          padding={12}
          textStyle={{ fontSize: 16, fontWeight: '500' }}
          height={50}
          disabled={!hasChanged || isUpdating}
        />
      </View>
      {/* choose zone bottom modal sheet */}
      <ChooseZoneModal
        visible={zoneModalVisible}
        selectedZoneId={address.zoneId}
        onClose={() => setZoneModalVisible(false)}
        onSelect={(zone) => {
          updateZone(zone._id, zone.title);
          setZoneModalVisible(false);
        }}
        zones={zonesData?.zonesCentral || []}
      />

      <AddressSearchModal
        onSelect={(address) => {
          updateLocation(address);
          setAddressModalVisible(false);
        }}
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        zoneCoordinates={zonesData?.zonesCentral.find((z: Zone) => z._id === address.zoneId)?.location?.coordinates[0] || []}
      />

      <ConfirmDeleteAddressModal
        visible={deleteModalVisible}
        loading={isDeleting}
        onConfirm={async () => {
          if (!address?._id) return;
          try {
            await deleteAddress({
              variables: {
                deleteAddressId: address._id,
              },
            });
            setDeleteModalVisible(false);
            resetAddress();
            router.back();
          } catch (err) {

          } finally {
          }
        }}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
};

export default UpdateAddressScreen;
