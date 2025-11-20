// services/rideService.ts

import { apiInstance } from "@/services/api/ApiInstance";



export const getCurrency = async () => {
    const res = await apiInstance.get(`/api/v1/currency`);
    return res.data;
};


