// services/rideService.ts

import { apiInstance } from "@/services/api/ApiInstance";

export interface BidsPayload {
    id: string
}

export const getBids = async (data: BidsPayload) => {
    const res = await apiInstance.get(`/api/v1/rides/${data.id}/bids`);
    return res.data;
};
