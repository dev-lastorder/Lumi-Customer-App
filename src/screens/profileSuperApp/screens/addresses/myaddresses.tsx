// screens/profileSuperApp/screens/addresses/myaddresses.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';

// Hooks
import useAddresses from '@/services/api/addresses/useAddresses';
import { Address } from '@/services/api/addresses/addresses';

export default function MyAddressesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Get addresses data and actions from hook
  const {
    addresses,
    isLoadingAddresses,
    refetchAddresses,
    deleteAddress,
    isDeletingAddress,
  } = useAddresses();

  // Refresh addresses when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchAddresses();
    }, [refetchAddresses])
  );

  // Handle pull to refresh
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchAddresses();
    setRefreshing(false);
  };

  // Navigate to add address screen
  const handleAddAddress = () => {
    router.push('/addAddresses');
  };

  // Navigate to edit address screen
  const handleEditAddress = (addressId: string) => {
    router.push(`/addAddresses?id=${addressId}`);
  };

  // Handle address options menu
  const handleAddressOptions = (address: Address) => {
    Alert.alert(
      'Address Options',
      `Manage ${address.type} address`,
      [
        {
          text: 'Edit',
          onPress: () => handleEditAddress(address.id),
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteAddress(address.id, address.type),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Handle delete with confirmation
  const handleDeleteAddress = (addressId: string, type: string) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete your ${type} address?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteAddress(addressId),
        },
      ]
    );
  };

  // Render individual address item
  const renderAddressItem = ({ item }: { item: Address }) => (
    <TouchableOpacity
      style={styles.addressCard}
      activeOpacity={0.7}
      onPress={() => handleEditAddress(item.id)}
    >
      <View style={styles.addressContent}>
        {/* Location Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={24} color="#1F2937" />
        </View>

        {/* Address Details */}
        <View style={styles.addressDetails}>
          <Text style={styles.addressLabel}>{item.type}</Text>
          <Text style={styles.addressText} numberOfLines={2}>
            {item.address}
          </Text>
          {item.details && (
            <Text style={styles.addressSubtext} numberOfLines={1}>
              {item.details}
            </Text>
          )}
        </View>

        {/* Options Button */}
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => handleAddressOptions(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={80} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Addresses Yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first address to get started
      </Text>
    </View>
  );

  // Loading state
  if (isLoadingAddresses && addresses.length === 0) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3853A4" />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      </GradientBackground>
    );
  }

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

        {/* Title and Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>My addresses</Text>
          <Text style={styles.subtitle}>
            Reach out for help or give feedback on your experience.
          </Text>
        </View>

        {/* Addresses List */}
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            addresses.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3853A4"
            />
          }
        />

        {/* Add Address Button */}
        <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddAddress}
            activeOpacity={0.8}
            disabled={isDeletingAddress}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add address</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  // Title Section
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

  // List
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Address Card
  addressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addressDetails: {
    flex: 1,
    marginRight: 12,
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 2,
  },
  addressSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  optionsButton: {
    padding: 8,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Bottom Button
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});