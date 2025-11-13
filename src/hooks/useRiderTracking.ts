// src/hooks/useRiderTracking.ts
import { useQuery, useSubscription } from '@apollo/client';
import { GET_RIDER_LOCATION } from '@/api/graphql/query/order';
import { RIDER_LOCATION_SUBSCRIPTION } from '@/api';
import { UseRiderTrackingResult } from '@/utils/interfaces/rider';

export const useRiderTracking = (riderId: string | undefined): UseRiderTrackingResult => {
  // Check if this is a dummy rider (for testing purposes)
  const isDummyRider = !riderId || riderId.includes('dummy') || riderId.length < 20;

  // ✅ Query current rider location using _id
  const {
    data: riderData,
    loading,
    error,
  } = useQuery(GET_RIDER_LOCATION, {
    variables: { id: riderId }, // ✅ Use _id
    fetchPolicy: 'cache-and-network',
    skip: !riderId || isDummyRider,
    pollInterval: 15000, // Poll every 15 seconds as fallback
    onCompleted: (data) => {
      ;
    },
    onError: (error) => {
      console.error('❌ Rider query error:', error);
    },
  });

  // ✅ Subscribe to real-time location updates
  const { data: locationSubscriptionData, error: subscriptionError } = useSubscription(RIDER_LOCATION_SUBSCRIPTION, {
    variables: { riderId }, // ✅ Use _id for subscription
    skip: !riderId || isDummyRider,
    onSubscriptionData: ({ subscriptionData }) => {
      ;
    },
    onError: (error) => {
      console.error('❌ Rider location subscription error:', error);
    },
  });

  // Use subscription data if available, otherwise use query data
  const currentRiderData = locationSubscriptionData?.subscriptionRiderLocation || riderData?.rider;

  // ✅ For dummy data, provide a mock rider location (between restaurant and delivery)
  const dummyRiderLocation = isDummyRider
    ? {
        latitude: 33.5881583, // Between the restaurant and delivery coordinates
        longitude: 73.0730976, // Moving towards delivery address
      }
    : null;

  // ✅ Parse real rider location from coordinates
  const riderLocation = isDummyRider
    ? dummyRiderLocation
    : currentRiderData?.location
      ? {
          latitude: parseFloat(currentRiderData.location.coordinates[1]),
          longitude: parseFloat(currentRiderData.location.coordinates[0]),
        }
      : null;

  return {
    riderLocation,
    loading: !isDummyRider && loading && !currentRiderData,
    error: (!isDummyRider && (error?.message || subscriptionError?.message)) || null,
  };
};
