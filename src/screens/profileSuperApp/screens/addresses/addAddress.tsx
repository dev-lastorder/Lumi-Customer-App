// screens/profileSuperApp/screens/addresses/addAddresses.tsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';

// Hooks
import useAddresses from '@/services/api/addresses/useAddresses';
import { useDebounce } from '@/utils';

// GraphQL
import { GET_CONFIGURATION } from '@/api';

// Utils
import { fetchPlaces, getPlaceDetails } from '@/screens/Rider/utils/fetchPlace';

// Address type options
const ADDRESS_TYPES = [
  { id: 'home', label: 'Home', icon: 'home' as const },
  { id: 'work', label: 'Work', icon: 'briefcase' as const },
  { id: 'other', label: 'Other', icon: 'location' as const },
];

export default function AddAddressScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const addressId = params.id as string | undefined;

  // Google API Key from GraphQL
  const { data } = useQuery(GET_CONFIGURATION);
  const apiKey = data?.configuration?.googleApiKey;

  // Hooks
  const {
    createAddress,
    updateAddress,
    isCreatingAddress,
    isUpdatingAddress,
    useAddressById,
  } = useAddresses();

  // Get existing address if editing
  const { data: existingAddress, isLoading: isLoadingAddress } = useAddressById(
    addressId || null
  );

  // Track if we've already initialized data to prevent infinite loops
  const hasInitializedExisting = useRef(false);
  const hasInitializedParams = useRef(false);

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [details, setDetails] = useState('');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('home');
  const [predictions, setPredictions] = useState<any[]>([]);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Memoize params to prevent unnecessary re-renders
  const mapParams = useMemo(() => ({
    address: params.address as string | undefined,
    lat: params.lat as string | undefined,
    lng: params.lng as string | undefined,
  }), [params.address, params.lat, params.lng]);

  // Fetch predictions when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 3) {
      handleFetchPlaces(debouncedSearchQuery);
    } else {
      setPredictions([]);
    }
  }, [debouncedSearchQuery]);

  // Fetch places from Google API
  const handleFetchPlaces = async (text: string) => {
    const results = await fetchPlaces(text, apiKey);
    setPredictions(results || []);
  };

  // Load existing address data when editing (only once)
  useEffect(() => {
    if (existingAddress && !hasInitializedExisting.current) {
      console.log('📍 Loading existing address data');
      setSelectedAddress(existingAddress.address);
      setSearchQuery(existingAddress.address);
      setSelectedLocation({
        latitude: existingAddress.latitude,
        longitude: existingAddress.longitude,
      });
      setDetails(existingAddress.details || '');
      setSelectedType(existingAddress.type.toLowerCase());
      hasInitializedExisting.current = true;
    }
  }, [existingAddress]);

  // Handle map selection params (only once per param change)
  useEffect(() => {
    const { address, lat, lng } = mapParams;
    
    // Only process if we have all required params and haven't processed them yet
    if (address && lat && lng) {
      const paramsKey = `${address}-${lat}-${lng}`;
      
      // Check if these are new params (not already processed)
      if (!hasInitializedParams.current || hasInitializedParams.current !== paramsKey) {
        console.log('🗺️ Processing map params:', { address, lat, lng });
        
        setSelectedAddress(address);
        setSearchQuery(address);
        setSelectedLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        });
        
        hasInitializedParams.current = paramsKey;
      }
    }
  }, [mapParams]);

  // Handle place selection from predictions
  const handleSelectPrediction = async (prediction: any) => {
    console.log('📍 Place selected:', prediction.description);
    
    const coords = await getPlaceDetails(prediction?.place_id, apiKey);

    if (coords) {
      const [lng, lat] = coords;
      
      setSelectedAddress(prediction.description);
      setSearchQuery(prediction.description);
      setSelectedLocation({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });
      
      setPredictions([]);
      Keyboard.dismiss();
    }
  };

  // Navigate to map screen
  const handleChooseOnMap = () => {
    router.push({
      pathname: '/fullMap',
      params: {
        returnScreen: 'addAddresses',
        currentAddress: selectedAddress,
        currentLat: selectedLocation?.latitude?.toString() || '',
        currentLng: selectedLocation?.longitude?.toString() || '',
      },
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!selectedAddress.trim()) {
      alert('Please select an address');
      return false;
    }
    if (!selectedLocation) {
      alert('Please select a location on the map');
      return false;
    }
    return true;
  };

  // Handle add address button press
  const handleAddAddressPress = () => {
    if (validateForm()) {
      setShowTypeModal(true);
    }
  };

  // Confirm and save address
  const handleConfirmType = () => {
    if (!selectedLocation) return;

    const addressData = {
      address: selectedAddress,
      details: details.trim() || undefined,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      type: selectedType.toUpperCase() as 'HOME' | 'WORK' | 'OTHER',
    };

    if (addressId) {
      // Update existing address
      updateAddress({ id: addressId, data: addressData });
    } else {
      // Create new address
      createAddress(addressData);
    }

    setShowTypeModal(false);
  };

  // Loading state
  if (isLoadingAddress) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3853A4" />
          <Text style={styles.loadingText}>Loading address...</Text>
        </View>
      </GradientBackground>
    );
  }

  const isLoading = isCreatingAddress || isUpdatingAddress;

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {addressId ? 'Edit address' : 'Add address'}
          </Text>
          <Text style={styles.subtitle}>
            Add a address to quickly complete purchases.
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Google Places Autocomplete */}
          <View style={styles.autocompleteContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#9CA3AF"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search address"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={false}
              />
            </View>

            {/* Predictions Dropdown */}
            {predictions.length > 0 && (
              <View style={styles.predictionsContainer}>
                <FlatList
                  data={predictions}
                  keyExtractor={(item: any) => item?.place_id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectPrediction(item)}
                      style={styles.predictionItem}
                    >
                      <Ionicons name="location-outline" size={20} color="#6B7280" />
                      <Text style={styles.predictionText} numberOfLines={2}>
                        {item?.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Choose on Map Button */}
          <TouchableOpacity
            style={styles.mapButton}
            onPress={handleChooseOnMap}
            activeOpacity={0.7}
          >
            <Ionicons name="map" size={20} color="#3853A4" />
            <Text style={styles.mapButtonText}>Choose on map</Text>
          </TouchableOpacity>

          {/* Additional Details Input */}
          {selectedAddress && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsLabel}>
                Additional details (optional)
              </Text>
              <TextInput
                style={styles.detailsInput}
                placeholder="Apartment, floor, building name, etc."
                placeholderTextColor="#9CA3AF"
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          )}
        </ScrollView>

        {/* Add Address Button */}
        <View
          style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}
        >
          <TouchableOpacity
            style={[
              styles.addButton,
              (!selectedAddress || !selectedLocation || isLoading) &&
                styles.addButtonDisabled,
            ]}
            onPress={handleAddAddressPress}
            activeOpacity={0.8}
            disabled={!selectedAddress || !selectedLocation || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="add" size={24} color="#FFFFFF" />
                <Text style={styles.addButtonText}>
                  {addressId ? 'Update address' : 'Add address'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Type Selection Modal */}
      <Modal
        visible={showTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTypeModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHandle} />
            
            <Text style={styles.modalTitle}>Select Address Type</Text>
            <Text style={styles.modalSubtitle}>
              Choose where this address is located
            </Text>

            <View style={styles.typeOptions}>
              {ADDRESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeOption,
                    selectedType === type.id && styles.typeOptionSelected,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.typeIconContainer,
                      selectedType === type.id && styles.typeIconContainerSelected,
                    ]}
                  >
                    <Ionicons
                      name={type.icon}
                      size={24}
                      color={selectedType === type.id ? '#FFFFFF' : '#3853A4'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === type.id && styles.typeLabelSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmType}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Title
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Autocomplete
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 16,
  },
  searchInputContainer: {
    position: 'relative',
  },
  searchInput: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 50,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    top: 18,
    zIndex: 1,
  },
  predictionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    maxHeight: 250,
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
  },

  // Map Button
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  mapButtonText: {
    fontSize: 16,
    color: '#3853A4',
    fontWeight: '600',
    marginLeft: 8,
  },

  // Details Input
  detailsContainer: {
    marginTop: 24,
  },
  detailsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Bottom Button
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: '#3853A4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 100,
    shadowColor: '#3853A4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },

  // Type Options
  typeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginHorizontal: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#3853A4',
  },
  typeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIconContainerSelected: {
    backgroundColor: '#3853A4',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeLabelSelected: {
    color: '#3853A4',
  },

  // Confirm Button
  confirmButton: {
    backgroundColor: '#3853A4',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});