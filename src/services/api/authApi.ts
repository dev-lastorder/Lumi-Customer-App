// src/services/api/authApi.ts - STEP 3: AUTH API SERVICE
import firebaseMessagingService from '../firebaseMessagingService';
import { ApiMethods } from './apiMethods';
import {
  SignupFirstStepRequest,
  SignupFirstStepResponse,
  SignupFinalStepRequest,
  SignupFinalStepResponse,
  LoginPhoneSendRequest,
  LoginPhoneSendResponse,
  LoginPhoneVerifyRequest,
  LoginPhoneVerifyResponse,
  GoogleLoginRequest,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './types/authTypes';

// Import the SuperAppUser from Redux slice
import { SuperAppUser } from '@/redux/slices/authSliceSuperApp';

// Standard response interfaces for the app
export interface LoginResponse {
  success: boolean;
  user: SuperAppUser;
  token: string;
  message: string;
}

export interface SignupResponse {
  success: boolean;
  user: SuperAppUser;
  token: string;
  message: string;
}

export class AuthApi {
  // ✅ Helper function to transform backend user to SuperAppUser
  private static transformToSuperAppUser(user: any): SuperAppUser {
    if (!user || !user.id || !user.phone) {
      console.error('❌ Invalid user object:', user);
      throw new Error('Invalid user object from backend');
    }

    // Transform backend user to SuperAppUser format
    const transformedUser: SuperAppUser = {
      id: user.id,
      name: user.name || '',
      email: user.email || null,
      phone: user.phone,
      phone_is_verified: user.phone_is_verified,
      email_is_verified: user.email_is_verified,
      profile: user.profile,
      fcm_token: user.fcm_token,
      google_id: user.google_id,
      current_location: user.current_location,
      createdAt: user.createdAt, // ✅ Backend uses createdAt
      updatedAt: user.updatedAt,
    };

    console.log('✅ Transformed user:', {
      id: transformedUser.id,
      name: transformedUser.name,
      phone: transformedUser.phone,
    });

    return transformedUser;
  }

  static async checkPhoneExists(phone: string): Promise<{ exists: boolean }> {
    try {
      const result = await ApiMethods.get<{ exists: boolean }>(`/api/v1/auth/phone/check/${encodeURIComponent(phone)}`);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  static async signupFirstStep(data: SignupFirstStepRequest): Promise<SignupFirstStepResponse> {
    try {
      console.log('📱 Signup first step:', { phone: data.phone });
      const result = await ApiMethods.post<SignupFirstStepResponse>('/api/v1/auth/signup/first-step', data);
      return result;
    } catch (error) {
      console.error('❌ Signup first step error:', error);
      throw error;
    }
  }

  // ✅ FIXED: Transform backend signup response
  static async signupFinalStep(data: SignupFinalStepRequest): Promise<SignupResponse> {
    try {
      console.log('✅ Signup final step:', {
        phone: data.phone,
        name: data.name,
        hasOtp: !!data.sentOtp
      });

      const fcmToken = await firebaseMessagingService.getDeviceToken();

      console.log("📲 Device FCM Token:", fcmToken);

       const payload = {
        ...data,
        device_push_token: fcmToken ?? null,
      };

      const result = await ApiMethods.post<SignupFinalStepResponse>('/api/v1/auth/signup/final-step', payload);

      console.log('🔍 Raw signup response:', result);

      // Transform the response to match our app's format
      return {
        success: true,
        user: this.transformToSuperAppUser(result.user),
        token: result.accessToken, // ✅ Backend returns accessToken
        message: 'Signup successful',
      };
    } catch (error) {
      console.error('❌ Signup final step error:', error);
      throw error;
    }
  }

  static async loginPhoneSend(data: LoginPhoneSendRequest): Promise<LoginPhoneSendResponse> {
    try {
      console.log('📱 Login phone send:', { phone: data.phone });
      const result = await ApiMethods.post<LoginPhoneSendResponse>('/api/v1/auth/login/phone/send', data);
      return result;
    } catch (error) {
      console.error('❌ Login phone send error:', error);
      throw error;
    }
  }

  // ✅ FIXED: Transform backend login response
  static async loginPhoneVerify(data: LoginPhoneVerifyRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Login phone verify:', {
        userId: data.userId,
        login_as: data.login_as
      });

      const fcmToken = await firebaseMessagingService.getDeviceToken();

      console.log("📲 Device FCM Token:", fcmToken);

      // 2️⃣ Add device_token to payload
      const payload = {
        ...data,
        device_push_token: fcmToken ?? null,
      };


      const result = await ApiMethods.post<LoginPhoneVerifyResponse>('/api/v1/auth/login/phone/verify', payload);

      console.log('🔍 Raw login response:', result);

      // Transform the response to match our app's format
      return {
        success: true,
        user: this.transformToSuperAppUser(result.user),
        token: result.accessToken, // ✅ Backend returns accessToken
        message: 'Login successful',
      };
    } catch (error) {
      console.error('❌ Login phone verify error:', error);
      throw error;
    }
  }

  static async loginWithGoogle(data: GoogleLoginRequest): Promise<LoginResponse> {
    try {
      console.log('🔐 Google login');
      const result = await ApiMethods.post<any>('/api/v1/auth/login/google', data);

      return {
        success: true,
        user: this.transformToSuperAppUser(result.user),
        token: result.accessToken,
        message: 'Google login successful',
      };
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  }

  static async sendOTP(data: SendOTPRequest): Promise<SendOTPResponse> {
    try {
      console.log('📨 Send OTP:', { phone: data.phone });
      const result = await ApiMethods.post<SendOTPResponse>('/api/v1/otp/send', data);
      return result;
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      throw error;
    }
  }

  static async verifyOTP(data: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    try {
      console.log('✅ Verify OTP:', { phone: data.phone });
      const result = await ApiMethods.post<VerifyOTPResponse>('/api/v1/otp/verify', data);
      return result;
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      throw error;
    }
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      console.log('🔑 Reset password:', { userId: data.userId });
      const result = await ApiMethods.post<ResetPasswordResponse>('/api/v1/otp/reset-password', data);
      return result;
    } catch (error) {
      console.error('❌ Reset password error:', error);
      throw error;
    }
  }
}

// Export individual methods for convenience
export const {
  checkPhoneExists,
  signupFirstStep,
  signupFinalStep,
  loginPhoneSend,
  loginPhoneVerify,
  loginWithGoogle,
  sendOTP,
  verifyOTP,
  resetPassword,
} = AuthApi;