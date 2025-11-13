// src/utils/interfaces/rider.ts
export interface RiderLocation {
    latitude: number;
    longitude: number;
  }
  
  export interface UseRiderTrackingResult {
    riderLocation: RiderLocation | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface RiderInfo {
    _id: string;
    name: string;
    phone?: string;
    image?: string;
    available?: boolean;
    location?: {
      coordinates: [string, string];
    };
  }