// screens/profileSuperApp/screens/addresses/fullMap.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';

// GraphQL
import { GET_CONFIGURATION } from '@/api';

// Utils
import { fetchPlaces, getPlaceDetails } from '@/screens/Rider/utils/fetchPlace';

// Hooks
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { BASE_URL } from '@/environment';

interface PlacePrediction {
  description: string;
  place_id: string;
}

export default function FullMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Get params from addAddresses screen
  const returnScreen = params.returnScreen as string;
  const currentAddress = params.currentAddress as string;
  const currentLat = params.currentLat as string;
  const currentLng = params.currentLng as string;

  // Get Google API Key
  const { data } = useQuery(GET_CONFIGURATION);
  const apiKey = data?.configuration?.googleApiKey;

  // Get current location hook
  const currentLocation = useCurrentLocation();

  // Refs
  const mapRef = useRef<MapView>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const regionDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize region from params or current location
  const initialRegion: Region = {
    latitude: currentLat ? parseFloat(currentLat) : currentLocation?.latitude || 33.6844,
    longitude: currentLng ? parseFloat(currentLng) : currentLocation?.longitude || 73.0479,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // State
  const [region, setRegion] = useState<Region>(initialRegion);
  const [address, setAddress] = useState(currentAddress || '');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Fetch address from coordinates (reverse geocoding)
  const fetchAddressFromCoordinates = useCallback(async (lat: number, lng: number) => {
    setIsLoadingAddress(true);

    try {
      const url = `${BASE_URL}/api/v1/maps/address-from-coordinates?lat=${lat}&lng=${lng}`;
      console.log("GET address API:", url);

      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        console.error("GET API failed:", response.status);
        setAddress("Error loading address");
        return;
      }

      const data = await response.json();
      console.log("API Response:", data);

      const rawAddress = data?.address;

      // Validate address
      if (typeof rawAddress !== "string" || rawAddress.trim() === "") {
        setAddress("Address not found");
        return;
      }

      // Remove plus code (everything before the first comma)
      let cleanedAddress = rawAddress;
      if (rawAddress.includes(",")) {
        cleanedAddress = rawAddress.substring(rawAddress.indexOf(",") + 1).trim();
      }

      setAddress(cleanedAddress);

    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error loading address");
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);


  // Handle region change (debounced)
  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    setRegion(newRegion);

    // Clear existing timeout
    if (regionDebounceRef.current) {
      clearTimeout(regionDebounceRef.current);
    }

    // Debounce reverse geocoding
    regionDebounceRef.current = setTimeout(() => {
      fetchAddressFromCoordinates(newRegion.latitude, newRegion.longitude);
    }, 500);
  }, [fetchAddressFromCoordinates]);

  // Handle search input change (debounced)
  const handleSearchChange = useCallback((text: string) => {
    setAddress(text);

    // Clear existing timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Only search if text is at least 3 characters
    if (text.length >= 3) {
      searchDebounceRef.current = setTimeout(async () => {
        const results = await fetchPlaces(text, apiKey);
        setPredictions(results || []);
      }, 300);
    } else {
      setPredictions([]);
    }
  }, [apiKey]);

  // Handle prediction selection
  const handleSelectPrediction = useCallback(async (prediction: PlacePrediction) => {
    setAddress(prediction.description);
    setPredictions([]);

    try {
      const coords = await getPlaceDetails(prediction.place_id, apiKey);
      if (coords && mapRef.current) {
        const [lng, lat] = coords;
        const newRegion: Region = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  }, [apiKey]);

  // Get current location
  const handleGetCurrentLocation = useCallback(async () => {
    if (!currentLocation) {
      Alert.alert(
        'Location Permission',
        'Please enable location permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    setIsGettingLocation(true);

    try {
      const newRegion: Region = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }

      await fetchAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Unable to get your current location. Please try again.');
    } finally {
      setIsGettingLocation(false);
    }
  }, [currentLocation, fetchAddressFromCoordinates]);

  // Confirm location selection
  const handleConfirm = useCallback(() => {
    if (!address || isLoadingAddress) {
      Alert.alert('Please wait', 'Loading address...');
      return;
    }

    // Navigate back with selected location
    router.push({
      pathname: `/${returnScreen || 'addAddresses'}`,
      params: {
        address: address,
        lat: region.latitude.toString(),
        lng: region.longitude.toString(),
      },
    });
  }, [address, region, returnScreen, router, isLoadingAddress]);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top + 15 }]}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Search Container */}
      <View style={[styles.searchContainer, { top: insets.top + 80 }]}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={address}
            onChangeText={handleSearchChange}
            placeholder="Search for a location..."
            placeholderTextColor="#9CA3AF"
          />

          {/* Predictions Dropdown */}
          {predictions.length > 0 && (
            <View style={styles.predictionsContainer}>
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.place_id}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectPrediction(item)}
                    style={styles.predictionItem}
                  >
                    <MaterialIcons name="place" size={18} color="#6B7280" />
                    <Text style={styles.predictionText} numberOfLines={2}>
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          onPress={handleGetCurrentLocation}
          style={styles.locationButton}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <ActivityIndicator size="small" color="#3853A4" />
          ) : (
            <MaterialIcons name="my-location" size={24} color="#3853A4" />
          )}
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
      />

      {/* Center Pin */}
      <View style={styles.centerPin}>
        <Image
          source={require("../../../../assets/images/pinLocation.png")}
          style={styles.pinImage}
          resizeMode="contain"
        />
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[styles.confirmButton, { bottom: insets.bottom + 30 }]}
        onPress={handleConfirm}
        disabled={!address || isLoadingAddress}
        activeOpacity={0.8}
      >
        {isLoadingAddress ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.buttonTextLoading}>Loading address...</Text>
          </View>
        ) : (
          <View style={styles.buttonContent}>
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Confirm Location</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Back Button
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // Search Container
  searchContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    zIndex: 10,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  locationButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Predictions
  predictionsContainer: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  predictionText: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },

  // Map
  map: {
    flex: 1,
  },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -50,
    zIndex: 1,
  },
  pinImage: {
    width: 50,
    height: 50,
  },

  // Confirm Button
  confirmButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#3853A4',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3853A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextLoading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});