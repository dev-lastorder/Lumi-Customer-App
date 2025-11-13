import { apiInstance } from "@/services/api/ApiInstance";

export const rideRequestsService = {
    // ✅ Get Active Ride for the current customer
    getActiveRide: async () => {
        try {
            const response = await apiInstance.get(
                "https://api-nestjs-enatega.up.railway.app/api/v1/rides/ongoing/active/customer"
            );
            console.log("✅ Active ride response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error(
                "❌ Error fetching active ride:",
                error.response?.data || error.message
            );
            return {
                success: false,
                error: error.response?.data || { message: "Failed to fetch active ride" },
            };
        }
    },
    cancelRide: async (rideId: string) => {
        try {
            const response = await apiInstance.patch(
                `https://api-nestjs-enatega.up.railway.app/api/v1/rides/${rideId}/customer/cancel`
            );

            console.log("✅ Ride canceled successfully:", response.data);
            return response.data;
        } catch (error: any) {
            console.error(
                "❌ Error canceling ride:",
                error.response?.data || error.message
            );
            return {
                success: false,
                error: error.response?.data || { message: "Failed to cancel ride" },
            };
        }
    },
};