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
  Linking
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { CustomText } from '@/components';
import RecentSearches from './RecentSearches';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@apollo/client';
import { GET_CONFIGURATION } from '@/api';
import { fetchPlaces, getPlaceDetails } from '../utils/fetchPlace';
import { saveRecentSearch } from '../utils/saveUserSearch';
import { MaterialIcons } from '@expo/vector-icons';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';

interface AddStopLocationModalProps {
  visible: boolean;
  onClose: () => void;
  setStopLocation?: (value: string) => void;
  setStopCoords?: (coords: { lat: string; lng: string }) => void;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

const { height, width } = Dimensions.get('window');

const AddStopLocationModal: React.FC<AddStopLocationModalProps> = ({
  visible,
  onClose,
  setStopLocation,
  setStopCoords,
}) => {
  const { data } = useQuery(GET_CONFIGURATION);
  const apiKey = data?.configuration?.googleApiKey;
  const [showMap, setShowMap] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [mapPredictions, setMapPredictions] = useState<PlacePrediction[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(true);
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const currentLocation = useCurrentLocation();

  const [region, setRegion] = useState({
    latitude: currentLocation?.latitude || 33.6844,
    longitude: currentLocation?.longitude || 73.0479,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [mapAddress, setMapAddress] = useState('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  // Debounce timers
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mapDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const regionDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize region with current location when available
  useEffect(() => {
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation]);

  // Debounce functions
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

  // Fetch address from coordinates (reverse geocoding)
  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    if (!apiKey) return;
    
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setMapAddress(address);
      } else {
        setMapAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setMapAddress('Error loading address');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Debounced version of region change
  const onRegionChangeComplete = useCallback((newRegion: any) => {
    setRegion(newRegion);
    debounceRegionChange(() => fetchAddressFromCoordinates(newRegion.latitude, newRegion.longitude), 500)();
  }, [apiKey, debounceRegionChange]);

  // Handle search input change
  const handleChange = async (text: string) => {
    setSearchText(text);
    setShowRecentSearches(text.length === 0);
    
    if (text.length >= 3) {
      debounce(async () => {
        const results = await fetchPlaces(text, apiKey);
        setPredictions(results || []);
      }, 300)();
    } else {
      setPredictions([]);
    }
  };

  // Handle selecting prediction from search
  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    const coords = await getPlaceDetails(prediction?.place_id, apiKey);
    console.log("Stop coords are:", coords);

    if (coords) {
      const [lng, lat] = coords;

      const locationItem = {
        title: prediction.description,
        lat,
        lng,
        place_id: prediction.place_id,
      };

      setStopLocation?.(prediction.description);
      setStopCoords?.({ lat, lng });

      // Save to recent searches
      await saveRecentSearch('@recent_stops', locationItem);
    }

    setPredictions([]);
    setSearchText("");
    onClose();
  };

  // Handle map selection button press
  const handleMapSelection = () => {
    setShowMap(true);
    setMapPredictions([]);
    
    if (currentLocation) {
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

  // Handle map confirmation
  const handleMapConfirm = () => {
    const coords = {
      lat: region.latitude.toString(),
      lng: region.longitude.toString()
    };

    console.log('🗺️ Stop location confirmed:', { mapAddress, coords });

    const locationItem = {
      title: mapAddress,
      lat: coords.lat,
      lng: coords.lng,
      place_id: `map-${Date.now()}`, // Generate unique ID for map selections
    };

    setStopLocation?.(mapAddress);
    setStopCoords?.({ lat: coords.lat, lng: coords.lng });

    // Save to recent searches
    saveRecentSearch('@recent_stops', locationItem);

    setShowMap(false);
    setMapPredictions([]);
    onClose();
  };

  // Handle autocomplete search in map view
  const handleMapAddressChange = (text: string) => {
    setMapAddress(text);
    
    if (text.length >= 3) {
      debounceMapSearch(async () => {
        try {
          const results = await fetchPlaces(text, apiKey);
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
    setMapAddress(prediction.description);
    setMapPredictions([]);
    
    try {
      const coords = await getPlaceDetails(prediction.place_id, apiKey);
      if (coords && mapRef.current) {
        const [lng, lat] = coords;
        const newRegion = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setRegion(newRegion);
        mapRef.current.animateToRegion(newRegion, 1000);
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

  // Handle recent search selection
  const handleRecentSearchSelect = async (item: any) => {
    setStopLocation?.(item.title);
    setStopCoords?.({ lat: item.lat, lng: item.lng });

    // Save again to move it to top of recent searches
    await saveRecentSearch('@recent_stops', item);
    
    onClose();
  };

  // Handle close
  const handleClose = () => {
    setSearchText('');
    setPredictions([]);
    setMapPredictions([]);
    setShowMap(false);
    setShowRecentSearches(true);
    onClose();
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (mapDebounceTimerRef.current) clearTimeout(mapDebounceTimerRef.current);
      if (regionDebounceTimerRef.current) clearTimeout(regionDebounceTimerRef.current);
    };
  }, []);

  // Map View
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
                placeholder="Search stop location..."
                placeholderTextColor="#666"
              />
              
              {mapPredictions.length > 0 && (
                <View style={styles.floatingPredictionsContainer}>
                  <FlatList
                    data={mapPredictions}
                    keyExtractor={(item) => `stop-map-${item.place_id}`}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleMapPredictionSelect(item)}
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
                backgroundColor: '#3853A4'
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
                Confirm Stop Location
              </CustomText>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  // Search View
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={[styles.overlay, { paddingTop: insets.top }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { height: height * 0.8 }]} className="bg-background dark:bg-dark-background">
          <LinearGradient
            colors={['#DBD6FB', '#FEFEFF']}
            locations={[0, 0.4]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientBackground}
          />

          <View className="relative flex-row items-center justify-center mb-6">
            <TouchableOpacity
              style={[styles.closeBtn, { position: "absolute", left: 0, top: 0 }]}
              className='bg-gray-50 p-2 rounded-full'
              onPress={handleClose}
            >
              <AntDesign name="close" size={20} color="#71717A" />
            </TouchableOpacity>
            <CustomText fontWeight="bold" fontSize="lg" className="text-center">
              Additional Stop
            </CustomText>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather name="search" size={20} color="#666" />

              <View className="flex-1 relative">
                <TextInput
                  className="w-full"
                  placeholder="Enter Stop Location"
                  placeholderTextColor="#71717A"
                  value={searchText}
                  onChangeText={handleChange}
                  style={styles.textInput}
                />

                {predictions.length > 0 && (
                  <View style={styles.predictionsContainer}>
                    <FlatList
                      data={predictions}
                      keyExtractor={(item: any) => `stop-${item?.place_id}`}
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
                onPress={handleMapSelection}
                style={styles.mapIconButton}
              >
                <MaterialIcons name="map" size={24} color="#3853A4" />
              </TouchableOpacity>
            </View>
          </View>


          {/* Recent Searches - only show when not searching */}
          {showRecentSearches && predictions.length === 0 && (
            <View className="flex-1">
              <CustomText fontSize="sm" lightColor="#71717A" className="mb-3">
                Recent Stop Searches
              </CustomText>
              <RecentSearches
                type="stops"
                onSelect={handleRecentSearchSelect}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddStopLocationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  mapIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  predictionsContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    zIndex: 1000,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    color: '#374151',
  },
  
  // Map Container Styles
  mapContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
    flex: 1,
    position: 'relative',
  },
  floatingSearchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingLocationButton: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  
  floatingPredictionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    maxHeight: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  floatingPredictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingPredictionText: {
    marginLeft: 10,
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
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});