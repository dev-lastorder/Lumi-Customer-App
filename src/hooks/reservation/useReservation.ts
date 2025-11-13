import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '@/services/api/reservationsApi';
import { GetReservationsRequest } from '@/services/api/types/reservationTypes';

export const useGetReservations = (params: GetReservationsRequest = {}, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['getReservations', params],
    queryFn: () => reservationsApi.getReservations(params),
    enabled,
    staleTime: 2 * 60 * 1000,
    select: (data) => data.allRides,
  });
};

export const useRefetchReservations = () => {
  const queryClient = useQueryClient();
  return (params: GetReservationsRequest = {}) => {
    console.log('🔄 Manually refreshing reservations');
    queryClient.invalidateQueries({
      queryKey: ['getReservations', params],
    });
  };
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reservationsApi.cancelReservation(id),
    onSuccess: () => {
      console.log('✅ Reservation canceled successfully');
      // Invalidate reservations to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['getReservations'],
      });
      // Show success message (you can add toast here)
    },
    onError: (error) => {
      console.error('❌ Failed to cancel reservation:', error);
      // Show error message (you can add toast here)
    },
  });
};