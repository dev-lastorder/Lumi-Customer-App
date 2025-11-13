// src/services/api/types/authTypes.ts - STEP 2: API TYPES
export interface SignupFirstStepRequest {
  phone: string;
  otp_type?: 'sms' | 'call'; 
}

export interface SignupFirstStepResponse {
  success?: boolean;
  message: string;
  userId?: string;
}

export interface SignupFinalStepRequest {
  sentOtp: string;
  name: string;
  phone: string;
  device_push_token: string;
  user_type_id: string;
  linked_store_id?: string;
  linked_vendor_id?: string;
}

// ✅ FIXED: Match backend response structure exactly
export interface SignupFinalStepResponse {
  user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    phone_is_verified: boolean;
    email_is_verified: boolean;
    profile?: string;
    fcm_token?: string | null;
    google_id?: string | null;
    current_location?: any;
    createdAt: string; // Backend uses createdAt
    updatedAt: string;
  };
  profileTypeData: {
    user_id: string;
    user_type_id: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string; // ✅ Backend returns accessToken, not token
}

export interface LoginPhoneSendRequest {
  phone: string;
  otp_type?: 'sms' | 'call'; 
}

export interface LoginPhoneSendResponse {
  userId: string;
  message: string;
}

export interface LoginPhoneVerifyRequest {
  userId: string;
  sentOtp: string;
  login_as: 'Customer' | 'Rider' | 'Admin' | 'Store';
}

// ✅ FIXED: Match backend login response structure
export interface LoginPhoneVerifyResponse {
  user: {
    id: string;
    email: string | null;
    phone: string;
    name: string;
    email_is_verified: boolean;
    phone_is_verified: boolean;
    fcm_token: string | null;
    profile: string;
    google_id: string | null;
    current_location: any;
    createdAt: string;
    updatedAt: string;
  };
  mainTablesData: Array<{
    key: string;
    data: any;
  }>;
  accessToken: string; // ✅ Backend returns accessToken
}

export interface GoogleLoginRequest {
  idToken: string;
  user_type_id: string;
  name?: string;
  email?: string;
  picture?: string;
}

export interface SendOTPRequest {
  phone: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  userId: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface APIErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}