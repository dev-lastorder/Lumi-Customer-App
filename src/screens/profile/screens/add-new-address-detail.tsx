import { useState } from 'react';
import { View, TextInput, Alert, ScrollView, Modal, Image, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@apollo/client';

// ─── Custom Components ─────────────────────────────
import { CustomIcon, CustomHeader, CustomText, ScreenWrapperWithAnimatedHeader, AnimatedIconButton } from '@/components';
import CustomIconButton from '@/components/common/Buttons/CustomIconButton';
import { AddNewAddressDetailLocationTypeSelector } from '../components/add-new-address-detail';

// ─── Hooks & Constants ─────────────────────────────
import { useAddNewAddress } from '@/hooks/useAddNewAddress';
import { LocationTypeOptions } from '../components/add-new-address-detail/constant';
import { CREATE_ADDRESS, GET_ZONES } from '@/api';
import AddressSearchModal from '../components/add-new-address/add-new-address.address-search.modal';

// ─── Types ────────────────────────────────────────────────────
interface Zone {
  _id: string;
  title: string;
  location: {
    coordinates: number[][][];
  };
}

const AddNewAddressDetailScreen = () => {
  // ─── Local State ───────────────────────────────────────────
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const { address, updateLocationType, updateOtherDetails, resetAddress, updateLocation } = useAddNewAddress();
  const [showDropdown, setShowDropdown] = useState(!address?.locationType);
  const [showSuccessGif, setShowSuccessGif] = useState(false);

  // ─── Hooks ─────────────────────────────────────────────────
  const { data: zonesData } = useQuery(GET_ZONES);
  const [createAddress, { loading: creating }] = useMutation(CREATE_ADDRESS, {
    refetchQueries: ['Addresses'],
    awaitRefetchQueries: true,
  });

  const { redirectTo } = useLocalSearchParams();

  const onEditPress = () => {
    setAddressModalVisible(true);
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* header */}
      <CustomHeader
        title={address?.zoneTitle || 'Address'}
        showGoBack={true}
        onGoBack={() => router.back()}
        rightIcons={[
          <AnimatedIconButton className="bg-icon-background dark:bg-dark-icon-background p-2 rounded-full w-max" onPress={onEditPress}>
            <CustomIcon icon={{ size: 24, type: 'MaterialCommunityIcons', name: 'square-edit-outline' }} />
          </AnimatedIconButton>,
        ]}
      />

      {/* content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="p-4 ">
        <View className="space-y-6">
          {/* ─── Address Info ─────────────────────────────── */}
          <View className="mb-4">
            <CustomText fontSize="lg" variant="heading3" fontWeight="medium">
              Address
            </CustomText>
            <CustomText fontSize="md" variant="body">
              {address?.zoneTitle || 'Tyulenovo'}
            </CustomText>
            <CustomText fontSize="sm" variant="body" className="text-black dark:text-dark-text">
              {address?.location || 'Tyulenovo'}
            </CustomText>
          </View>

          {/* ─── Location Type ────────────────────────────── */}
          <View className="mb-4">
            <CustomText fontSize="lg" variant="heading3" fontWeight="medium">
              Location type
            </CustomText>
            <CustomText variant="caption" className="mb-3">
              The location type helps us to find you better.
            </CustomText>

            <AddNewAddressDetailLocationTypeSelector
              selected={address?.locationType}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              onSelect={(val) => {
                updateLocationType(val);
                setShowDropdown(true);
              }}
              options={LocationTypeOptions}
            />
          </View>

          {/* ─── Other Details ────────────────────────────── */}
          {address?.locationType && (
            <View>
              <CustomText fontSize="lg" variant="heading3" fontWeight="medium" className="mb-2">
                Address other details
              </CustomText>

              <TextInput
                placeholder="e.g. Home, Office, Apartment A1"
                value={address?.otherDetails}
                onChangeText={(val) => updateOtherDetails(val)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="bg-white dark:bg-dark-card rounded-xl px-4 py-3 h-24 text-base text-black dark:text-dark-text border border-border dark:border-dark-border/30"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* sticky submit button  */}
      <View className="absolute bottom-0  left-0 right-0 px-4 pb-5 bg-background dark:bg-dark-background">
        <CustomIconButton
          label={creating ? 'Saving address ...' : 'Save address'}
          onPress={async () => {
            try {
              console.log('beforeCreatingAddress', {
                addressInput: {
                  longitude: address.longitude,
                  latitude: address.latitude,
                  deliveryAddress: address.location,
                  details: address.otherDetails,
                  label: address.locationType,
                  zone: address.zoneId,
                },
              });
              const res = await createAddress({
                variables: {
                  addressInput: {
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
              // Show GIF overlay
              setShowSuccessGif(true);

              // Wait for GIF to play (~2s), then navigate
              setTimeout(() => {
                setShowSuccessGif(false);
                if (redirectTo === 'discovery') {
                  router.push('/(food-delivery)/(discovery)/discovery');
                } else if (redirectTo === 'search-home') {
                  router.push('/(food-delivery)/(search)/search-home')
                } else if (redirectTo === 'restaurant-order-checkout') {
                  router.push('/(food-delivery)/(restaurant)/order-checkout')
                } else if (redirectTo === 'store-order-checkout') {
                  router.push('/(food-delivery)/(store)/order-checkout')
                } else if (redirectTo === 'discovery-order-checkout') {
                  router.push('/(food-delivery)/(discovery)/order-checkout')
                } else {
                  console.log("profile address being called")
                  router.replace('/(food-delivery)/(profile)/my-addresses');
                }
              }, 2000);
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to save address.');
            }
          }}
          textColor="white"
          width="100%"
          backgroundColor="#A5C616"
          borderRadius={15}
          padding={12}
          textStyle={{ fontSize: 16, fontWeight: '500' }}
          height={50}
          disabled={!address?.locationType || creating}
        />
      </View>

      {/* Address Search Modal */}
      <AddressSearchModal
        onSelect={(address) => {
          updateLocation(address);
          setAddressModalVisible(false);
        }}
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        zoneCoordinates={zonesData?.zonesCentral?.find((z: Zone) => z._id === address.zoneId)?.location?.coordinates[0] || []}
      />

      {/* GIF Overlay */}
      <Modal transparent visible={showSuccessGif} animationType="fade">
        <View style={styles.overlay}>
          <Image source={require('@/assets/GIFs/done.gif')} style={styles.gif} />
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 350,
    height: 350,
    zIndex: 2000,
  },
});
export default AddNewAddressDetailScreen;
