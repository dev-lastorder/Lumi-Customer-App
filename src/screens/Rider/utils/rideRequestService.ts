import { BASE_URL } from '@/environment';
import { apiInstance } from '@/services/api/ApiInstance';

export const rideRequestsService = {
  // ✅ Get Active Ride for the current customer
  getActiveRide: async () => {
    try {
      const url = `${BASE_URL}/api/v1/rides/ongoing/active/customer`;
      const response = await apiInstance.get(url);
      console.log('✅ Active ride response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching active ride:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: 'Failed to fetch active ride' },
      };
    }
  },
  cancelRide: async (rideId: string) => {
    try {
      const url = `${BASE_URL}/api/v1/rides/${rideId}/customer/cancel`;
      const response = await apiInstance.patch(url);

      console.log('✅ Ride canceled successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error canceling ride:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || { message: 'Failed to cancel ride' },
      };
    }
  },
};
