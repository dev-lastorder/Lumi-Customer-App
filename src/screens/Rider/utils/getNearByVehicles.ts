// services/rideService.ts
import { apiInstance } from "@/services/api/ApiInstance";
import axios from "axios";


/**
 * Fetch nearby drivers
 * @param latitude number
 * @param longitude number
 * @param radiusKm number
 * @returns Promise<any[]>
 */
export const getNearbyDrivers = async (
    latitude: string,
    longitude: string,
    radiusKm: number = 1
) => {
    try {
        const response = await apiInstance.get(`/api/v1/rides/drivers/nearby/${latitude}/${longitude}/${radiusKm}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching nearby drivers:", error);
        return [];
    }
};
