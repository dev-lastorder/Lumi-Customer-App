export const API_CONFIG = {
    BASE_URL: 'https://api-nestjs-enatega.up.railway.app',
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