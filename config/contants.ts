import { BASE_URL } from "@/environment";

export const API_CONFIG = {
    BASE_URL: BASE_URL, 
    ENDPOINTS: {
      GET_TOKEN: '/test/twilio/token',
      VOICE_WEBHOOK: '/test/twilio/voice'
    }
  } as const;
  // User identities - these will be unique for each user
  // In production, these would come from your auth system
  export const USER_IDENTITIES = {
    CUSTOMER: 'customer_',
    DRIVER: 'driver_'
  } as const;
  // Types
  export type UserRole = 'customer' | 'driver';