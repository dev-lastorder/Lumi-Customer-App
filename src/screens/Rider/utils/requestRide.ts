// services/rideService.ts

import { apiInstance } from "@/services/api/ApiInstance";

export interface RidePayload {
    pickup: { lat: string | undefined; lng: string | undefined };
    dropoff: { lat: string | undefined; lng: string | undefined };
    ride_type_id: string | undefined;
    fare?: number;
    payment_via: string;
    is_hourly: boolean,
}

export const createRide = async (data: RidePayload) => {
    const res = await apiInstance.post("/api/v1/rides", data);
    console.log('apiInstance', apiInstance)
    return res.data;
};



export const raiseFare = async (rideRequestId: string, newFare: number) => {
  try {
    const response = await apiInstance.patch(
      '/api/v1/rides/ride-request/raise-fare',
      {
        rideRequestId,
        newFare,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('❌ Raise Fare API Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Something went wrong while raising fare.'
    );
  }
};