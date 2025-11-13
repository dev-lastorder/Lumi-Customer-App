// services/rideService.ts

import { apiInstance } from "@/services/api/ApiInstance";

export interface BidsPayload {
    id: string
}

export const getEmergencyContact = async () => {
    const res = await apiInstance.get(`/api/v1/admin/global-emergency-contacts/active`);
    return res.data;
};
