// ─────────────────────────────────────────────────────
// 📦 Imports
// ─────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 🧠 Types
import { LocationPermissionModalProps } from './interface';

// ─────────────────────────────────────────────────────
// 📍 Component: LocationPermissionModal
// ─────────────────────────────────────────────────────
const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ visible, onAccept, onReject }) => {
  // ── Internal state
  const [locationText, setLocationText] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [lat, setLat] = useState<string>('');
  const [long, setLong] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const insets = useSafeAreaInsets();

  // ── Effect: Fetch location when modal is visible
  useEffect(() => {
    if (visible) {
      fetchLocation();
    }
  }, [visible]);

  // ─────────────────────────────────────────────────────
  // 📡 Function: Get user location & reverse geocode
  // ─────────────────────────────────────────────────────
  const fetchLocation = async () => {
    try {
      setLoading(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Permission denied');
        setCity('');
        setCountry('');
        setLat('');
        setLong('');
        setLoading(false);
        return;
      }

      // Get coordinates
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setLat(latitude.toString());
      setLong(longitude.toString());

      // Reverse geocode to human-readable address
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const addressLine = [place.name, place.street, place.city, place.region, place.postalCode, place.country].filter(Boolean).join(', ');

        setLocationText(addressLine);
        setCity(place.city || place.region || 'Unknown');
        setCountry(place.country || '');
      } else {
        setLocationText('Unknown address');
        setCity('');
        setCountry('');
      }

      setLoading(false);
    } catch (error) {
      // Fallback on error
      setLocationText('Unable to fetch location');
      setCity('');
      setCountry('');
      setLat('');
      setLong('');
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────
  // ✅ Confirm and pass selected location
  // ─────────────────────────────────────────────────────
  const handleAccept = () => {
    onAccept({
      location: locationText,
      city,
      country,
      latitude: lat,
      longitude: long,
    });
  };

  // ─────────────────────────────────────────────────────
  // 📦 Render UI
  // ─────────────────────────────────────────────────────
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="w-10/12 rounded-2xl bg-white p-6 items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <>
              <Text className="text-center text-base mb-4">Based on your phone's location, it looks like you're here:</Text>
              <Text className="text-lg font-semibold text-center mb-1">{locationText}</Text>
              <Text className="text-lg font-semibold text-center mb-4">{city}</Text>

              <TouchableOpacity className="w-full bg-primary py-3 rounded-lg mb-3" onPress={handleAccept}>
                <Text className="text-text dark:text-dark-text text-center font-semibold">Use this address</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-full bg-primary/10 py-3 rounded-lg" onPress={onReject}>
                <Text className="text-text dark:text-dark-text text-center font-semibold">Enter another address</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LocationPermissionModal;
