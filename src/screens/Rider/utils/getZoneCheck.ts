// services/rideService.ts
import { apiInstance } from "@/services/api/ApiInstance";

export const getZoneCheck = async (lat: number = 33.6844, lng: number = 73.0479) => {
  try {
    const response = await apiInstance.get(`/api/v1/zones/check`, {
      params: { lat, lng },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching zone data:", error?.response?.data || error.message);
    throw error;
  }
};
