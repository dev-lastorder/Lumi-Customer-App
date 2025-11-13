import { apiInstance } from "@/services/api/ApiInstance";

export interface BidsPayload {
  id: string;
}

export const getBids = async (data: BidsPayload) => {
  const res = await apiInstance.get(`/api/v1/rides/${data.id}/bids`);
  return res.data;
};

// =========================
// ✅ Accept Bid API
// =========================

export interface AcceptBidPayload {
  customerId: string;
  bidId: string;
  isSchedule: boolean;
  payment_via: string;
  scheduledAt: string; // ISO date string
}

/**
 * Accepts a ride bid by sending POST request to the Enatega API.
 * 
 * @param rideId - The ride ID from URL path
 * @param payload - Request body including customerId, bidId, etc.
 */
export const acceptBid = async (rideId: string, payload: AcceptBidPayload) => {
  try {
    const res = await apiInstance.patch(
      `/api/v1/rides/bids/${rideId}/accept`,
      payload
    );
    return res.data;
  } catch (error: any) {
    console.error("❌ Error accepting bid:", error.response?.data || error.message);
    throw error;
  }
};
