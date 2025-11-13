import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedIconButton, CustomHeader, CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import CustomIconButton from '@/components/common/Buttons/CustomIconButton';
import { updateLocation } from '@/redux';

const GetLocationForAddNewAddressScreen: React.FC = () => {
  const [toastText, setToastText] = useState('Deliver here');
  const timeoutRef = useRef<number | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const inset = useSafeAreaInsets();
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const regionData: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(regionData);
      setLoading(false);
    })();
  }, []);

  const handleConfirmLocation = async () => {
    if (!region) return;

    setButtonLoading(true);

    try {
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: region.latitude,
        longitude: region.longitude,
      });

      const locationName = geo
        ? `${geo.name || ''} ${geo.street || ''}, ${geo.city || ''}, ${geo.country || ''}`
        : `${region.latitude},${region.longitude}`;

      dispatch(updateLocation(locationName.trim()));
      router.push('/(food-delivery)/(profile)/add-new-address');
    } catch (error) {
      
    } finally {
      setButtonLoading(false);
    }
  };

  if (loading || !region) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-dark-background">
      {/* Header */}
      <CustomHeader title={'Choose your location'} showGoBack={true} onGoBack={() => router.back()} rightIcons={[]} />

      {/* Map */}
      <View className="flex-1">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={region}
          onRegionChange={() => {
            setToastText('Searching address...');
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onRegionChangeComplete={(reg) => {
            setRegion(reg);
            // Delay setting toast back to "Deliver here"
            timeoutRef.current = setTimeout(() => {
              setToastText('Deliver here');
            }, 600);
          }}
          mapType={mapType}
        />

        {/* Toast Above Pin */}
        {/* <View className="absolute left-1/2 top-[39%] z-30 -translate-x-2/3 items-center">
          <View className="bg-background dark:bg-dark-background shadow-black dark:shadow-white px-4 py-3 rounded-lg">
            <CustomText fontSize="sxx" fontWeight="normal">
              {toastText}
            </CustomText>

            <View className="absolute rotate-45 -bottom-2 left-1/2 -translate-x-2/2 w-6 h-6 bg-white dark:bg-black " />
          </View>
        </View> */}

        {/* Center marker */}
        <View className="absolute left-1/2 top-1/2 -ml-10 -mt-10 z-10">
          <Image source={require('@/assets/images/marker.png')} className="w-20 h-20" resizeMode="contain" />
        </View>
      </View>

      {/* Tip */}
      <View className="absolute bottom-24 left-4 right-4 bg-white dark:bg-dark-background dark:text-dark-text p-4 rounded-xl shadow-lg">
        <Text className="text-base font-semibold mb-1 dark:text-dark-text">🙏 All good?</Text>
        <Text className="text-sm text-gray-600 dark:text-dark-text">Refine the pin until you're done, then tap Next!</Text>
      </View>

      {/* Button */}
      <View className="absolute mx-auto bottom-6 left-4 right-4">
        <CustomIconButton
          label={buttonLoading ? 'Please wait...' : 'Next'}
          onPress={handleConfirmLocation}
          backgroundColor="#AAC810"
          textColor="white"
          borderColor="#AAC810"
          width={'100%'}
          height={50}
          padding={12}
          textStyle={{ fontSize: 16, fontWeight: '500' }}
          disabled={buttonLoading}
        />
      </View>

      {/* Floating buttons */}
      <View className="absolute top-[100]  right-4 space-y-3 z-20">
        {/* Toggle map view */}
        <TouchableOpacity
          onPress={() => {
            setMapType((prev) => (prev === 'standard' ? 'satellite' : prev === 'satellite' ? 'hybrid' : 'standard'));
          }}
          className="bg-white my-5 dark:bg-dark-background p-3 rounded-full shadow"
        >
          <CustomIcon icon={{ type: 'MaterialIcons', name: 'layers', size: 22, color: '#AAC810' }} />
        </TouchableOpacity>
        {/* Go to current location */}
        <TouchableOpacity
          onPress={async () => {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            mapRef.current?.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }}
          className="bg-white dark:bg-dark-background p-3 rounded-full shadow"
        >
          <CustomIcon icon={{ type: 'Feather', name: 'navigation', size: 22, color: '#AAC810' }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GetLocationForAddNewAddressScreen;
