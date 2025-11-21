// Fixed LocationSearchModal with unique keys
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Linking,
  Keyboard
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { CustomText } from '@/components';
import RecentSearches from './RecentSearches';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@apollo/client';
import { fetchPlaces, getPlaceDetails } from '../utils/fetchPlace';
import { resetLocations, setFromSliceCoords, setFromSliceLocation, setToSliceCoords, setToSliceLocation } from '@/redux/slices/RideSlices/rideLocationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { MaterialIcons, Ionicons, EvilIcons } from '@expo/vector-icons';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import { saveRecentSearch } from '../utils/saveUserSearch';
import { clearRide } from '@/redux/slices/RideSlices/rideCreationSlice';
import { BASE_URL } from '@/environment';

interface LocationSearchModalProps {
  visible: boolean;
  onClose: () => void;
  fromLocation?: string | null;
  toLocation?: string | null;
  fromCoords?: { lat: string; lng: string } | null;
  toCoords?: { lat: string; lng: string } | null;
  setFromLocation?: (value: string) => void;
  setToLocation?: (value: string) => void;
  setFromCoords?: (coords: { lat: string; lng: string }) => void;
  setToCoords?: (coords: { lat: string; lng: string }) => void;
  setRideConfirmation?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

const { height, width } = Dimensions.get('window');
const apiKey = process.env

const LocationSearchModal: React.FC<LocationSearchModalProps> = ({
  visible,
  onClose,
  fromLocation,
  toLocation,
  setFromLocation,
  setToLocation,
  setFromCoords,
  setToCoords,
  setRideConfirmation
}) => {
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapMode, setMapMode] = useState<'pickup' | 'dropoff'>('pickup');
  const dispatch = useDispatch();
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [mapPredictions, setMapPredictions] = useState<PlacePrediction[]>([]);
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const currentLocation = useCurrentLocation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);


  // Get Redux state to properly check both locations
  const reduxFromLocation = useSelector((state: RootState) => state.rideLocation.fromLocation);
  const reduxToLocation = useSelector((state: RootState) => state.rideLocation.toLocation);

  const [region, setRegion] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [mapAddress, setMapAddress] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  // Debounce timers
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mapDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const regionDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simple debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  const debounceMapSearch = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (mapDebounceTimerRef.current) {
        clearTimeout(mapDebounceTimerRef.current);
      }
      mapDebounceTimerRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  const debounceRegionChange = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (regionDebounceTimerRef.current) {
        clearTimeout(regionDebounceTimerRef.current);
      }
      regionDebounceTimerRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Helper function to check if ride should be confirmed
  const checkAndConfirmRide = useCallback((updatedFromLocation?: string, updatedToLocation?: string) => {
    // Use either the provided updated values or the current Redux state
    const finalFromLocation = updatedFromLocation || reduxFromLocation;
    const finalToLocation = updatedToLocation || reduxToLocation;

    console.log('🔍 Checking ride confirmation:', {
      finalFromLocation,
      finalToLocation,
      updatedFromLocation,
      updatedToLocation
    });

    if (finalFromLocation && finalToLocation) {
      console.log('✅ Both locations set, confirming ride!');
      setTimeout(() => {
        onClose();
        setRideConfirmation?.(true);
      }, 100);
    } else {
      console.log('❌ Missing location:', { finalFromLocation, finalToLocation });
    }
  }, [reduxFromLocation, reduxToLocation, onClose, setRideConfirmation]);

  // Fetch address from coordinates (reverse geocoding)
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);

    try {
      const url = `${BASE_URL}/api/v1/maps/address-from-coordinates?lat=${lat}&lng=${lng}`;
      console.log("GET →", url);

      const response = await fetch(url, { method: "GET" });

      if (!response.ok) {
        console.error("GET API failed with status:", response.status);
        setMapAddress("Error loading address");
        return;
      }

      const data = await response.json();
      console.log("GET API response corrected:", data);

      if (data?.address) {
        const rawAddress = data?.address;

        // If address is missing or not a string → fallback
        if (typeof rawAddress !== "string" || rawAddress.trim() === "") {
          setMapAddress("Address not found");
          return;
        }

        // Remove Plus Code safely
        let cleanedAddress = rawAddress;

        // Only clean if there's a comma in the string
        if (rawAddress.includes(",")) {
          cleanedAddress = rawAddress.substring(rawAddress.indexOf(",") + 1).trim();
        }

        setMapAddress(cleanedAddress);
      } else {
        setMapAddress("Address not found");
      }

    } catch (error) {
      console.error("GET API error:", error);
      setMapAddress("Error loading address");
    } finally {
      setIsLoadingAddress(false);
    }
  };


  // Debounced version of region change
  const onRegionChangeComplete = useCallback((newRegion: any) => {
    setRegion(newRegion);
    debounceRegionChange(() => fetchAddressFromCoordinates(newRegion.latitude, newRegion.longitude), 500)();
  }, [apiKey, debounceRegionChange]);

  const handleClose = () => {
    setFromLocation?.('');
    setToLocation?.('');
    setShowMap(false);
    setMapPredictions([]);
    setPredictions([]);
    onClose();
    dispatch(clearRide());
    dispatch(resetLocations());
  };

  const handleChange = (text: string, field: 'from' | 'to') => {
    if (field === "from") setFromLocation?.(text);
    if (field === "to") setToLocation?.(text);

    setActiveField(field);

    if (text.length >= 3) {
      debounce(async () => {
        const results = await fetchPlaces(text);
        setPredictions(results || []);
      }, 300)();
    } else {
      setPredictions([]);
    }
  };

  const handleSelectPrediction = async (prediction: PlacePrediction) => {

    const coords = await getPlaceDetails(prediction?.place_id);


    if (coords) {
      const { lat, lng } = coords;


      if (activeField === "from") {
        setFromLocation?.(prediction.description);
        setFromCoords?.({ lat, lng });
        dispatch(setFromSliceLocation(prediction.description));
        dispatch(setFromSliceCoords({ lat, lng }));
        await saveRecentSearch('@recent_from', {
          title: prediction.description,
          lat: String(lat),
          lng: String(lng),
          place_id: prediction.place_id,
        });

        // Check if ride should be confirmed with updated from location
        checkAndConfirmRide(prediction.description, reduxToLocation);
      } else if (activeField === "to") {
        setToLocation?.(prediction.description);
        dispatch(setToSliceLocation(prediction.description));
        dispatch(setToSliceCoords({ lat, lng }));
        setToCoords?.({ lat, lng });
        await saveRecentSearch('@recent_to', {
          title: prediction.description,
          lat: String(lat),
          lng: String(lng),
          place_id: prediction.place_id,
        });

        // Check if ride should be confirmed with updated to location
        checkAndConfirmRide(reduxFromLocation, prediction.description);
      }
    }

    setPredictions([]);
    setActiveField(null);
  };

  const handleMapSelection = (mode: 'pickup' | 'dropoff') => {
    setMapMode(mode);
    setShowMap(true);
    setMapPredictions([]);

    if (mode === 'pickup' && fromLocation) {
      setMapAddress(fromLocation);
    } else if (mode === 'dropoff' && toLocation) {
      setMapAddress(toLocation);
    } else if (currentLocation) {
      const newRegion = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      fetchAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude);
    } else {
      fetchAddressFromCoordinates(region.latitude, region.longitude);
    }
  };

  // Proper map confirmation logic
  const handleMapConfirm = () => {
    const coords = {
      lat: region.latitude.toString(),
      lng: region.longitude.toString()
    };

    console.log('🗺️ Map confirm:', { mapMode, mapAddress, coords });

    if (mapMode === 'pickup') {
      // Set pickup location
      setFromLocation?.(mapAddress);
      setFromCoords?.(coords);
      dispatch(setFromSliceLocation(mapAddress));
      dispatch(setFromSliceCoords(coords));

      checkAndConfirmRide(mapAddress, reduxToLocation);
    } else {
      // Set dropoff location  
      setToLocation?.(mapAddress);
      setToCoords?.(coords);
      dispatch(setToSliceLocation(mapAddress));
      dispatch(setToSliceCoords(coords));

      checkAndConfirmRide(reduxFromLocation, mapAddress);
    }

    setShowMap(false);
    setMapPredictions([]);
  };

  // Handle autocomplete search in map view
  const handleMapAddressChange = (text: string) => {
    setMapAddress(text);

    if (text.length >= 3) {
      debounceMapSearch(async () => {
        try {
          const results = await fetchPlaces(text);
          setMapPredictions(results || []);
        } catch (error) {
          console.error('Error searching address:', error);
          setMapPredictions([]);
        }
      }, 300)();
    } else {
      setMapPredictions([]);
    }
  };

  // Handle selecting prediction in map view
  const handleMapPredictionSelect = async (prediction: PlacePrediction) => {

    console.log("my predication ", prediction)
    setMapAddress(prediction.description);
    setMapPredictions([]);

    try {
      const coords = await getPlaceDetails(prediction.place_id);
      if (coords && mapRef.current) {
        const { lng, lat } = coords;
        const newRegion = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
        if (mapMode === 'pickup') {
          dispatch(setFromSliceLocation(prediction.description));
          setFromCoords?.({ lat, lng });
        } else {
          dispatch(setToSliceLocation(prediction.description));
          setToCoords?.({ lat, lng });
        }
      }
    } catch (error) {
      console.error('Error moving to selected location:', error);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
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

    setIsGettingCurrentLocation(true);

    try {
      const newRegion = {
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
      setIsGettingCurrentLocation(false);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (mapDebounceTimerRef.current) clearTimeout(mapDebounceTimerRef.current);
      if (regionDebounceTimerRef.current) clearTimeout(regionDebounceTimerRef.current);
    };
  }, []);



  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (showMap) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.mapContainer}>
          <TouchableOpacity
            onPress={() => setShowMap(false)}
            style={[styles.backButton, { top: insets.top + 15 }]}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>

          <View style={[styles.searchContainer, { top: insets.top + 80 }]}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.floatingSearchInput}
                value={mapAddress}
                onChangeText={handleMapAddressChange}
                placeholder={mapMode === 'pickup' ? 'Search pickup location...' : 'Search dropoff location...'}
                placeholderTextColor="#666"
              />

              {mapPredictions.length > 0 && (
                <View style={styles.floatingPredictionsContainer}>
                  <FlatList
                    data={mapPredictions}
                    keyExtractor={(item) => `map-${item.place_id}`}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          handleMapPredictionSelect(item);
                        }}
                        style={styles.floatingPredictionItem}
                      >
                        <MaterialIcons name="place" size={18} color="#666" />
                        <Text style={styles.floatingPredictionText}>{item.description}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.floatingLocationButton}
              disabled={isGettingCurrentLocation}
            >
              {isGettingCurrentLocation ? (
                <ActivityIndicator size="small" color="#3853A4" />
              ) : (
                <MaterialIcons name="my-location" size={24} color="#3853A4" />
              )}
            </TouchableOpacity>
          </View>

          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.fullMap}
            initialRegion={region}
            onRegionChangeComplete={onRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={false}
          />

          <View style={styles.centerPin}>
            <Image
              source={require("../../../assets/images/pinLocation.png")}
              style={styles.pinImage}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.floatingConfirmButton,
              {
                bottom: insets.bottom + 30,
                backgroundColor: mapMode === 'pickup' ? '#3853A4' : '#3853A4'
              }
            ]}
            onPress={handleMapConfirm}
            disabled={!mapAddress || isLoadingAddress}
          >
            {isLoadingAddress ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="white" />
                <CustomText lightColor="white" fontWeight="medium" className="ml-2">
                  Loading...
                </CustomText>
              </View>
            ) : (
              <CustomText lightColor="white" fontWeight="medium" fontSize="sm">
                Confirm {mapMode === 'pickup' ? 'Pickup' : 'Dropoff'}
              </CustomText>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}

    >
      <KeyboardAvoidingView
        style={[styles.overlay, {}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}


      >
        <View style={[styles.container, { height: height * 0.8, paddingTop: insets.top }]} className="bg-background dark:bg-dark-background">
          <LinearGradient
            colors={['#DBD6FB', '#FEFEFF']}
            locations={[0, 0.4]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBackground}
          />

          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>

          <View style={[
            styles.inputContainer,
            activeField === "from" && styles.activeInputContainer
          ]}>
            <View style={styles.inputWrapper}>
              <Image
                source={require("../../../assets/images/pinStart.png")}
                style={styles.locationIcon}
                resizeMode="contain"
              />

              <View className="flex-1 relative">
                <TextInput
                  className="w-full"
                  placeholder="From"
                  placeholderTextColor="#71717A"
                  value={fromLocation}
                  onChangeText={(text) => handleChange(text, "from")}
                  onFocus={() => setActiveField("from")}
                  style={styles.textInput}
                />

                {activeField === "from" && predictions.length > 0 && (
                  <View style={styles.predictionsContainer}>
                    <FlatList
                      data={predictions}
                      keyExtractor={(item: any) => `from-${item?.place_id}`} // 🔥 Fixed: Unique key prefix
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            handleSelectPrediction(item)
                          }}
                          style={styles.predictionItem}
                        >
                          <MaterialIcons name="place" size={16} color="#666" />
                          <Text style={styles.predictionText}>{item?.description}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleMapSelection('pickup')}
                style={styles.mapIconButton}
              >
                <MaterialIcons name="map" size={24} color="#4299e1" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[
            styles.inputContainer,
            activeField === "to" && styles.activeInputContainer
          ]}>
            <View style={styles.inputWrapper}>
              <Image
                source={require("../../../assets/images/pinStop.png")}
                style={styles.locationIcon}
                resizeMode="contain"
              />

              <View className="flex-1 relative">
                <TextInput
                  className="w-full"
                  placeholder="To"
                  placeholderTextColor="#71717A"
                  value={toLocation}
                  onChangeText={(text) => handleChange(text, "to")}
                  onFocus={() => setActiveField("to")}
                  style={styles.textInput}
                />

                {activeField === "to" && predictions.length > 0 && (
                  <View style={styles.predictionsContainer}>
                    <FlatList
                      data={predictions}
                      keyExtractor={(item: any) => `to-${item?.place_id}`} // 🔥 Fixed: Unique key prefix
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleSelectPrediction(item)}
                          style={styles.predictionItem}
                        >
                          <MaterialIcons name="place" size={16} color="#666" />
                          <Text style={styles.predictionText}>{item?.description}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => handleMapSelection('dropoff')}
                style={styles.mapIconButton}
              >
                <MaterialIcons name="map" size={24} color="#e53e3e" />
              </TouchableOpacity>
            </View>
          </View>

          {activeField === 'from' ? (
            <RecentSearches
              type="from"
              onSelect={async (item) => {
                setFromLocation?.(item.title);
                setFromCoords?.({ lat: item.lat, lng: item.lng });
                dispatch(setFromSliceLocation(item.title));
                dispatch(setFromSliceCoords({ lat: item.lat, lng: item.lng }));
                await saveRecentSearch('@recent_from', item);
                checkAndConfirmRide(item.title, reduxToLocation);
                setActiveField(null);
              }}
            />
          ) : activeField === 'to' ? (
            <RecentSearches
              type="to"
              onSelect={async (item) => {
                setToLocation?.(item.title);
                setToCoords?.({ lat: item.lat, lng: item.lng });
                dispatch(setToSliceLocation(item.title));
                dispatch(setToSliceCoords({ lat: item.lat, lng: item.lng }));
                await saveRecentSearch('@recent_to', item);
                checkAndConfirmRide(reduxFromLocation, item.title);
                setActiveField(null);
              }}
            />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default LocationSearchModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    marginBottom: 15,
    padding: 5,
    borderRadius: 50,
  },
  activeInputContainer: {
    borderColor: "#3853A4",
    borderWidth: 2,
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  textInput: {
    fontSize: 16,
    color: '#000',
  },
  mapIconButton: {
    padding: 5,
  },
  predictionsContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 1000,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  predictionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },

  // Map Container Styles
  mapContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

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
    flex: 0.85,
    position: 'relative',
  },
  floatingSearchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingLocationButton: {
    flex: 0.15,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  floatingPredictionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingPredictionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingPredictionText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
    color: '#374151',
  },

  fullMap: {
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

  floatingConfirmButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});