import { BackendReservationsResponse, GetReservationsRequest } from './types/reservationTypes';
import { ApiMethods } from './apiMethods';

export const reservationsApi = {
  getReservations: async (params: GetReservationsRequest = {}): Promise<BackendReservationsResponse> => {
    try {
      console.log('🚀 Fetching reservations with params:', params);
      const response = await ApiMethods.get<BackendReservationsResponse>('/api/v1/rides/customers', params);
      console.log('✅ Reservations fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Error while getting reservations:', error);
      throw error;
    }
  },
  cancelReservation: async (id: string): Promise<void> => {
    try {
      console.log('🚀 Canceling reservation:', id);
      await ApiMethods.patch(`/api/v1/rides/${id}/customer/cancel`);
      console.log('✅ Reservation canceled successfully');
    } catch (error) {
      console.error('❌ Error while canceling reservation:', error);
      throw error;
    }
  },
};
