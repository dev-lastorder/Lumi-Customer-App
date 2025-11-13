// hooks/auth/useAuth.ts - OPTIMIZED VERSION
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

// Your existing API and Redux imports
import { AuthApi } from '@/services/api/authApi';
import { 
  signupSuccess, 
  loginSuccess, 
  clearOTPAttempts,
  incrementOTPAttempts,
  updateSignupFormData 
} from '@/redux';

// Toast utilities we just created
import { showSuccessToast, showErrorToast, authToasts } from '@/utils/toast';

// Types from your existing code
import type { 
  SignupFirstStepRequest,
  SignupFinalStepRequest,
  LoginPhoneSendRequest,
  LoginPhoneVerifyRequest
} from '@/services/api/types/authTypes';

// Custom error type
interface ApiError extends Error {
  status?: number;
  data?: any;
  response?: {
    status: number;
    data: any;
  };
}

/**
 * Custom hook that provides all auth-related mutations with TanStack Query
 * OPTIMIZED: Reduced logging and re-renders
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  // ========================================================================
  // 1️⃣ CHECK PHONE EXISTS (for signup flow)
  // ========================================================================
  const checkPhoneExists = useMutation({
    mutationFn: (phone: string) => {
      console.log('📞 Checking phone exists for:', phone);
      return AuthApi.checkPhoneExists(phone);
    },
    onSuccess: (data, phone) => {
      console.log('✅ Phone check result:', data, 'for phone:', phone);
      
      if (data.exists) {
        console.log('📞 Phone already registered');
        authToasts.phoneExists();
      } else {
        console.log('📞 Phone is available - saving to Redux and navigating');
        
        // Phone is available - save to Redux and navigate
        dispatch(updateSignupFormData({ phone }));
        
        authToasts.phoneAvailable(() => {
          console.log('📞 Navigating to verification method');
          router.push({
            pathname: '/(auth)/verification-method',
            params: { phone, type: 'signup' }
          });
        });
      }
    },
    onError: (error: ApiError) => {
      console.error('❌ Phone check error:', error);
      showErrorToast(error, 'Unable to verify phone number');
    }
  });

  // ========================================================================
  // 2️⃣ SIGNUP - SEND OTP (first step)
  // ========================================================================
  const sendSignupOTP = useMutation({
    mutationFn: (data: SignupFirstStepRequest) => {
      console.log('📱 Sending signup OTP for:', data.phone);
      return AuthApi.signupFirstStep(data);
    },
    onSuccess: (response, variables) => {
      console.log('✅ Signup OTP sent successfully');
      
      // authToasts.otpSent('SMS');
      
      // Navigate to signup-specific OTP screen
      setTimeout(() => {
        console.log('📱 Navigating to verify-otp-signup');
        router.push({
          pathname: '/(auth)/verify-otp-signup',
          params: { 
            phone: variables.phone, 
            method: 'sms' 
          }
        });
      }, 1500);
    },
    onError: (error: ApiError) => {
      console.error('❌ Signup OTP send error:', error);
      
      if (error?.status === 409) {
        showErrorToast(error, 'Phone already registered. Please try logging in instead.');
      } else {
        showErrorToast(error, 'Failed to send verification code');
      }
    }
  });

  // ========================================================================
  // 3️⃣ SIGNUP - COMPLETE SIGNUP (verify OTP + create account)
  // ========================================================================
  const completeSignup = useMutation({
    mutationFn: (data: SignupFinalStepRequest) => {
      console.log('🚀 Completing signup with OTP for phone:', data.phone);
      return AuthApi.signupFinalStep(data);
    },
    onSuccess: (response, variables) => {
      console.log('✅ Signup completed successfully for:', response.user.name);
      
      // Clear OTP attempts for this phone
      dispatch(clearOTPAttempts(variables.phone));
      
      // Update Redux auth state
      dispatch(signupSuccess({
        user: response.user,
        token: response.token
      }));
      
      // Cache user data in TanStack Query
      queryClient.setQueryData(['user'], response.user);
      
      // Show success toast with user's first name
      const firstName = response.user.name.split(' ')[0];
      authToasts.signupSuccess(firstName, () => {
        console.log('🏠 Navigating to home after signup success');
        router.replace('/(auth)/Terms&Service');
      });
    },
    onError: (error: ApiError, variables) => {
      console.error('❌ Signup completion error:', error);
      console.log('📊 Incrementing OTP attempts for phone:', variables.phone);
      
      // Track failed OTP attempt
      dispatch(incrementOTPAttempts(variables.phone));
      
      // ✅ IMPROVED: More specific error handling
      if (error?.status === 400) {
        // Check if it's specifically an OTP error
        const message = Array.isArray(error.message) ? error.message[0] : error.message;
        if (message && (message.includes('OTP') || message.includes('incorrect'))) {
          console.log('❌ OTP validation error - showing invalid OTP toast');
          authToasts.otpInvalid();
        } else {
          console.log('❌ Other 400 error - showing generic error');
          showErrorToast(error, 'Invalid request. Please check your input.');
        }
      } else if (error?.status === 409) {
        console.log('❌ 409 error - account already exists');
        showErrorToast(error, 'Account already exists. Please try logging in.');
      } else if (error?.status === 404 && error?.message?.includes('User Type')) {
        console.log('❌ User type not found error');
        showErrorToast(error, 'System configuration error. Please contact support.');
      } else {
        console.log('❌ Other signup error');
        showErrorToast(error, 'Failed to create account');
      }
    }
  });

  // ========================================================================
  // 4️⃣ LOGIN - SEND OTP
  // ========================================================================
  const sendLoginOTP = useMutation({
    mutationFn: (data: LoginPhoneSendRequest) => {
      console.log('📱 Sending login OTP for:', data.phone);
      return AuthApi.loginPhoneSend(data);
    },
    onSuccess: (response, variables) => {
      console.log('✅ Login OTP sent successfully');
      
      // authToasts.otpSent('SMS');
      
      // Navigate to login-specific OTP screen
      setTimeout(() => {
        console.log('📱 Navigating to verify-otp-login');
        router.push({
          pathname: '/(auth)/verify-otp-login',
          params: { 
            phone: variables.phone, 
            method: 'sms',
            userId: response.userId
          }
        });
      }, 1500);
    },
    onError: (error: ApiError) => {
      console.error('❌ Login OTP send error:', error);
      
      if (error?.status === 404) {
        showErrorToast(error, 'No account found with this phone number. Please sign up first.');
      } else if (error?.status === 400 && error?.message?.includes('google')) {
        showErrorToast(error, 'This account uses Google login. Please use Google sign-in.');
      } else {
        showErrorToast(error, 'Failed to send login code');
      }
    }
  });

  // ========================================================================
  // 5️⃣ LOGIN - VERIFY OTP (complete login)
  // ========================================================================
  const verifyLoginOTP = useMutation({
    mutationFn: (data: LoginPhoneVerifyRequest) => {
      console.log('🔐 Verifying login OTP for userId:', data.userId);
      return AuthApi.loginPhoneVerify(data);
    },
    onSuccess: (response, variables) => {
      console.log('✅ Login verification successful for:', response.user.name);
      
      // Clear OTP attempts for this user  
      dispatch(clearOTPAttempts(variables.userId));
      
      // Update Redux auth state
      dispatch(loginSuccess({
        user: response.user,
        token: response.token
      }));
      
      // Cache user data in TanStack Query
      queryClient.setQueryData(['user'], response.user);
      
      // Show success toast with user's first name
      const firstName = response.user.name.split(' ')[0];
      authToasts.loginSuccess(firstName, () => {
        console.log('🏠 Navigating to home after login success');
        router.replace('/(auth)/Terms&Service');
      });
    },
    onError: (error: ApiError, variables) => {
      console.error('❌ Login verification error:', error);
      console.log('📊 Incrementing OTP attempts for userId:', variables.userId);
      
      // Track failed OTP attempt
      dispatch(incrementOTPAttempts(variables.userId));
      
      // Handle specific errors
      if (error?.status === 400) {
        const message = Array.isArray(error.message) ? error.message[0] : error.message;
        if (message && (message.includes('OTP') || message.includes('incorrect'))) {
          authToasts.otpInvalid();
        } else {
          showErrorToast(error, 'Wrong OTP Entered');
        }
      } else if (error?.status === 404) {
        showErrorToast(error, 'Account not found. Please check and try again.');
      } else if (error?.status === 403) {
        showErrorToast(error, 'Cannot login as this user type with this account.');
      } else {
        showErrorToast(error, 'Login verification failed');
      }
    }
  });

  // ========================================================================
  // 🔄 RETURN ALL MUTATIONS + LOADING STATES
  // ========================================================================
  return {
    // 🎯 MUTATIONS (call these in your components)
    checkPhoneExists,
    sendSignupOTP,
    completeSignup,
    sendLoginOTP, 
    verifyLoginOTP,
    
    // ⚡ LOADING STATES (automatically managed by TanStack Query!)
    isCheckingPhone: checkPhoneExists.isPending,
    isSendingSignupOTP: sendSignupOTP.isPending,
    isCompletingSignup: completeSignup.isPending,
    isSendingLoginOTP: sendLoginOTP.isPending,
    isVerifyingLoginOTP: verifyLoginOTP.isPending,
    
    // 🔍 COMBINED LOADING (useful for disabling forms)
    isLoading: [
      checkPhoneExists,
      sendSignupOTP, 
      completeSignup,
      sendLoginOTP,
      verifyLoginOTP
    ].some(mutation => mutation.isPending),
    
    // 💥 ERROR STATES (also automatic!)
    phoneCheckError: checkPhoneExists.error as ApiError | null,
    signupError: (sendSignupOTP.error || completeSignup.error) as ApiError | null,
    loginError: (sendLoginOTP.error || verifyLoginOTP.error) as ApiError | null,
    
    // 🔄 RESET FUNCTIONS (clear errors/states)
    resetPhoneCheck: checkPhoneExists.reset,
    resetSignup: () => {
      console.log('🔄 Resetting signup mutations');
      sendSignupOTP.reset();
      completeSignup.reset();
    },
    resetLogin: () => {
      console.log('🔄 Resetting login mutations');
      sendLoginOTP.reset();  
      verifyLoginOTP.reset();
    },
  };
};

export default useAuth;