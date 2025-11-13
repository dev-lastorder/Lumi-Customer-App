// services/api/addresses/addressesApi.ts
import { ApiMethods } from '@/services/api/apiMethods';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Address {
  id: string;
  user_id: string;
  address: string;
  details?: string;
  longitude: number;
  latitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
  selected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAddressRequest {
  address: string;
  details?: string;
  longitude: number;
  latitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
}

export interface UpdateAddressRequest {
  address?: string;
  details?: string;
  longitude?: number;
  latitude?: number;
  type?: 'HOME' | 'WORK' | 'OTHER';
}

export interface AddressesResponse {
  success?: boolean;
  items: Address[];
  isEnd: boolean;
  message?: string;
}

export interface SingleAddressResponse extends Address {
  // Backend returns the address object directly, not wrapped
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

export interface SearchAddressResponse {
  success?: boolean;
  items: Address[];
  isEnd: boolean;
  message?: string;
}

// ============================================================================
// ADDRESSES API SERVICE
// ============================================================================

export class AddressesApi {
  /**
   * Get all addresses for the authenticated user
   * GET /api/v1/address
   */
  static async getAllAddresses(offset: number = 0): Promise<Address[]> {
    try {
      console.log('📍 Fetching all addresses with offset:', offset);
      const response = await ApiMethods.get<AddressesResponse>(
        '/api/v1/address',
        { offset }
      );
      console.log('✅ Addresses fetched successfully:', response.items?.length || 0);
      return response.items || [];
    } catch (error) {
      console.error('❌ Get addresses error:', error);
      throw error;
    }
  }

  /**
   * Get a single address by ID
   * GET /api/v1/address/:id
   */
  static async getAddressById(id: string): Promise<Address> {
    try {
      console.log('📍 Fetching address by ID:', id);
      const response = await ApiMethods.get<SingleAddressResponse>(
        `/api/v1/address/${id}`
      );
      console.log('✅ Address fetched successfully');
      return response;
    } catch (error) {
      console.error('❌ Get address by ID error:', error);
      throw error;
    }
  }

  /**
   * Create a new address
   * POST /api/v1/address
   */
  static async createAddress(data: CreateAddressRequest): Promise<Address> {
    try {
      console.log('📍 Creating new address:', data.type);
      const response = await ApiMethods.post<SingleAddressResponse>(
        '/api/v1/address',
        data
      );
      console.log('✅ Address created successfully:', response.id);
      return response;
    } catch (error) {
      console.error('❌ Create address error:', error);
      throw error;
    }
  }

  /**
   * Update an existing address
   * PATCH /api/v1/address/:id
   */
  static async updateAddress(
    id: string,
    data: UpdateAddressRequest
  ): Promise<Address> {
    try {
      console.log('📍 Updating address:', id);
      const response = await ApiMethods.patch<SingleAddressResponse>(
        `/api/v1/address/${id}`,
        data
      );
      console.log('✅ Address updated successfully');
      return response;
    } catch (error) {
      console.error('❌ Update address error:', error);
      throw error;
    }
  }

  /**
   * Delete an address
   * DELETE /api/v1/address/:id
   */
  static async deleteAddress(id: string): Promise<void> {
    try {
      console.log('📍 Deleting address:', id);
      await ApiMethods.delete<DeleteAddressResponse>(`/api/v1/address/${id}`);
      console.log('✅ Address deleted successfully');
    } catch (error) {
      console.error('❌ Delete address error:', error);
      throw error;
    }
  }

  /**
   * Search addresses by text
   * GET /api/v1/address/search/text
   */
  static async searchAddresses(query: string): Promise<Address[]> {
    try {
      console.log('🔍 Searching addresses with query:', query);
      const response = await ApiMethods.get<SearchAddressResponse>(
        '/api/v1/address/search/text',
        { query }
      );
      console.log('✅ Search completed, found:', response.items?.length || 0);
      return response.items || [];
    } catch (error) {
      console.error('❌ Search addresses error:', error);
      throw error;
    }
  }
}

// Export individual methods for convenience
export const {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  searchAddresses,
} = AddressesApi;