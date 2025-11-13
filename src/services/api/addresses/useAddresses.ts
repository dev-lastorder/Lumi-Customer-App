// services/api/addresses/useAddresses.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

// API
import { 
  AddressesApi, 
  Address, 
  CreateAddressRequest, 
  UpdateAddressRequest 
} from './addresses';

// Toast utilities
import { showSuccessToast, showErrorToast, showInfoToast } from '@/utils/toast';

// Custom error type
interface ApiError extends Error {
  status?: number;
  data?: any;
  response?: any;
}

// ============================================================================
// ADDRESSES HOOK - Manages all address operations with TanStack Query
// ============================================================================

const useAddresses = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ========================================================================
  // 1️⃣ QUERY - GET ALL ADDRESSES
  // ========================================================================
  const {
    data: addresses = [],
    isLoading: isLoadingAddresses,
    isError: isAddressesError,
    error: addressesError,
    refetch: refetchAddresses,
  } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => AddressesApi.getAllAddresses(0),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ========================================================================
  // 2️⃣ QUERY - GET SINGLE ADDRESS BY ID
  // ========================================================================
  const useAddressById = (id: string | null) => {
    return useQuery({
      queryKey: ['address', id],
      queryFn: () => AddressesApi.getAddressById(id!),
      enabled: !!id, // Only run if ID exists
      staleTime: 1000 * 60 * 5,
    });
  };

  // ========================================================================
  // 3️⃣ MUTATION - CREATE ADDRESS
  // ========================================================================
  const createAddress = useMutation({
    mutationFn: (data: CreateAddressRequest) => {
      console.log('🏠 Creating address:', data.type);
      return AddressesApi.createAddress(data);
    },
    onSuccess: (newAddress) => {
      console.log('✅ Address created successfully:', newAddress.id);

      // Invalidate and refetch addresses list
      queryClient.invalidateQueries({ queryKey: ['addresses'] });

      // Optimistically add to cache
      queryClient.setQueryData(['addresses'], (old: Address[] = []) => [
        ...old,
        newAddress,
      ]);

      // Show success toast
      showSuccessToast(
        'Address Added',
        `Your ${newAddress.type} address has been saved successfully`
      );

      // Navigate back to addresses list
      setTimeout(() => {
        router.back();
      }, 500);
    },
    onError: (error: ApiError) => {
      console.error('❌ Create address error:', error);

      // Handle specific errors
      if (error?.status === 400) {
        showErrorToast(error, 'Invalid address details. Please check and try again.');
      } else if (error?.status === 422) {
        showErrorToast(error, 'Validation failed. Please fill all required fields.');
      } else {
        showErrorToast(error, 'Failed to create address');
      }
    },
  });

  // ========================================================================
  // 4️⃣ MUTATION - UPDATE ADDRESS
  // ========================================================================
  const updateAddress = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressRequest }) => {
      console.log('📝 Updating address:', id);
      return AddressesApi.updateAddress(id, data);
    },
    onSuccess: (updatedAddress, variables) => {
      console.log('✅ Address updated successfully:', updatedAddress.id);

      // Update the addresses list in cache
      queryClient.setQueryData(['addresses'], (old: Address[] = []) =>
        old.map((addr) =>
          addr.id === variables.id ? updatedAddress : addr
        )
      );

      // Update single address cache
      queryClient.setQueryData(['address', variables.id], updatedAddress);

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['addresses'] });

      // Show success toast
      showSuccessToast(
        'Address Updated',
        `Your ${updatedAddress.type} address has been updated successfully`
      );

      // Navigate back
      setTimeout(() => {
        router.back();
      }, 500);
    },
    onError: (error: ApiError, variables) => {
      console.error('❌ Update address error:', error);

      if (error?.status === 404) {
        showErrorToast(error, 'Address not found');
      } else if (error?.status === 400) {
        showErrorToast(error, 'Invalid address details');
      } else {
        showErrorToast(error, 'Failed to update address');
      }
    },
  });

  // ========================================================================
  // 5️⃣ MUTATION - DELETE ADDRESS
  // ========================================================================
  const deleteAddress = useMutation({
    mutationFn: (id: string) => {
      console.log('🗑️ Deleting address:', id);
      return AddressesApi.deleteAddress(id);
    },
    onSuccess: (_, deletedId) => {
      console.log('✅ Address deleted successfully:', deletedId);

      // Remove from cache immediately (optimistic update)
      queryClient.setQueryData(['addresses'], (old: Address[] = []) =>
        old.filter((addr) => addr.id !== deletedId)
      );

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['addresses'] });

      // Show success toast
      showSuccessToast('Address Deleted', 'Address removed successfully');
    },
    onError: (error: ApiError, deletedId) => {
      console.error('❌ Delete address error:', error);

      // Refetch to restore the list if deletion failed
      queryClient.invalidateQueries({ queryKey: ['addresses'] });

      if (error?.status === 404) {
        showErrorToast(error, 'Address not found');
      } else if (error?.status === 403) {
        showErrorToast(error, 'You do not have permission to delete this address');
      } else {
        showErrorToast(error, 'Failed to delete address');
      }
    },
  });

  // ========================================================================
  // 6️⃣ MUTATION - SEARCH ADDRESSES
  // ========================================================================
  const searchAddresses = useMutation({
    mutationFn: (query: string) => {
      console.log('🔍 Searching addresses:', query);
      return AddressesApi.searchAddresses(query);
    },
    onSuccess: (results, query) => {
      console.log('✅ Search completed, found:', results.length, 'addresses');
      
      if (results.length === 0) {
        showInfoToast('No Results', `No addresses found for "${query}"`);
      }
    },
    onError: (error: ApiError) => {
      console.error('❌ Search addresses error:', error);
      showErrorToast(error, 'Failed to search addresses');
    },
  });

  // ========================================================================
  // 🔄 RETURN ALL QUERIES, MUTATIONS & STATES
  // ========================================================================
  return {
    // 📋 QUERIES (data fetching)
    addresses,
    isLoadingAddresses,
    isAddressesError,
    addressesError: addressesError as ApiError | null,
    refetchAddresses,
    useAddressById,

    // 🎯 MUTATIONS (actions)
    createAddress: createAddress.mutate,
    updateAddress: updateAddress.mutate,
    deleteAddress: deleteAddress.mutate,
    searchAddresses: searchAddresses.mutate,

    // ⚡ LOADING STATES
    isCreatingAddress: createAddress.isPending,
    isUpdatingAddress: updateAddress.isPending,
    isDeletingAddress: deleteAddress.isPending,
    isSearching: searchAddresses.isPending,

    // 🔍 COMBINED LOADING
    isLoading:
      isLoadingAddresses ||
      createAddress.isPending ||
      updateAddress.isPending ||
      deleteAddress.isPending ||
      searchAddresses.isPending,

    // 💥 ERROR STATES
    createError: createAddress.error as ApiError | null,
    updateError: updateAddress.error as ApiError | null,
    deleteError: deleteAddress.error as ApiError | null,
    searchError: searchAddresses.error as ApiError | null,

    // 📊 SEARCH RESULTS
    searchResults: searchAddresses.data || [],

    // 🔄 RESET FUNCTIONS
    resetCreate: createAddress.reset,
    resetUpdate: updateAddress.reset,
    resetDelete: deleteAddress.reset,
    resetSearch: searchAddresses.reset,
  };
};

export default useAddresses;