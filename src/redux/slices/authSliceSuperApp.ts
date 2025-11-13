// src/redux/slices/authSliceSuperApp.ts - FIXED OTP ATTEMPTS STATE
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SuperAppUser {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  phone_is_verified?: boolean;
  email_is_verified?: boolean;
  profile?: string;
  fcm_token?: string | null;
  google_id?: string | null;
  current_location?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupFormData {
  name: string;
  phone?: string;
}

export interface OTPAttempts {
  [phoneNumber: string]: {
    count: number;
    lastAttempt: number;
    blockedUntil?: number;
  };
}

interface SuperAppAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SuperAppUser | null;
  token: string | null;
  signupFormData: SignupFormData | null;
  error: string | null;
  isSignupFlow: boolean;
  otpAttempts: OTPAttempts; // ✅ Always initialized as empty object
}

const initialState: SuperAppAuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  token: null,
  signupFormData: null,
  error: null,
  isSignupFlow: false,
  otpAttempts: {}, // ✅ Initialized as empty object, not undefined
};

const authSuperAppSlice = createSlice({
  name: 'authSuperApp',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      console.log('⚡ setLoading reducer called with:', action.payload);
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      console.log('❌ setError reducer called with:', action.payload);
      state.error = action.payload;
    },
    
    clearError: (state) => {
      console.log('🧹 clearError reducer called');
      state.error = null;
    },

    setSignupFlow: (state, action: PayloadAction<boolean>) => {
      console.log('📱 setSignupFlow reducer called with:', action.payload);
      state.isSignupFlow = action.payload;
    },

    // ✅ FIXED: Better OTP attempts handling
    incrementOTPAttempts: (state, action: PayloadAction<string>) => {
      const phoneNumber = action.payload;
      console.log('📊 incrementOTPAttempts reducer called for phone:', phoneNumber);
      console.log('📊 Current OTP attempts state before:', state.otpAttempts);
      
      const now = Date.now();
      
      // ✅ ENSURE otpAttempts object exists
      if (!state.otpAttempts) {
        console.log('📊 Creating otpAttempts object');
        state.otpAttempts = {};
      }
      
      // ✅ ENSURE phone entry exists
      if (!state.otpAttempts[phoneNumber]) {
        console.log('📊 Creating new OTP attempts entry for:', phoneNumber);
        state.otpAttempts[phoneNumber] = {
          count: 0,
          lastAttempt: now,
        };
      }
      
      console.log('📊 Current attempts for', phoneNumber, ':', state.otpAttempts[phoneNumber]);
      
      // ✅ INCREMENT count
      state.otpAttempts[phoneNumber].count += 1;
      state.otpAttempts[phoneNumber].lastAttempt = now;
      
      console.log('📊 New count for', phoneNumber, ':', state.otpAttempts[phoneNumber].count);
      
      // ✅ BLOCK if too many attempts
      if (state.otpAttempts[phoneNumber].count >= 5) {
        console.log('🚫 Blocking user - too many attempts');
        state.otpAttempts[phoneNumber].blockedUntil = now + (5 * 60 * 1000);
      }
      
      console.log('📊 Final OTP attempts state:', state.otpAttempts);
      console.log(`📊 OTP attempts for ${phoneNumber}: ${state.otpAttempts[phoneNumber].count}`);
    },
    
    clearOTPAttempts: (state, action: PayloadAction<string>) => {
      const phoneNumber = action.payload;
      console.log("🧹 clearOTPAttempts reducer called with:", phoneNumber);
      console.log("🧹 Current OTP attempts state before:", state.otpAttempts);
      
      // ✅ ENSURE otpAttempts object exists
      if (!state.otpAttempts) {
        console.log("🧹 No otpAttempts object to clear");
        return;
      }
      
      if (phoneNumber && state.otpAttempts.hasOwnProperty(phoneNumber)) {
        console.log("🧹 Deleting OTP attempts for:", phoneNumber);
        delete state.otpAttempts[phoneNumber];
        console.log("🧹 OTP attempts after deletion:", state.otpAttempts);
      } else {
        console.log("🧹 No OTP attempts found to clear for:", phoneNumber);
      }
    },
    
    clearAllOTPAttempts: (state) => {
      console.log('🧹 clearAllOTPAttempts reducer called');
      console.log('🧹 Before clear - OTP attempts:', state.otpAttempts);
      
      state.otpAttempts = {};
      
      console.log('🧹 After clear - OTP attempts:', state.otpAttempts);
      console.log('🧹 Cleared all OTP attempts');
    },

    setSignupFormData: (state, action: PayloadAction<SignupFormData>) => {
      console.log('💾 setSignupFormData reducer called with:', action.payload);
      
      state.signupFormData = action.payload;
      state.isSignupFlow = true;
      
      console.log('💾 Signup form data saved:', action.payload.name);
      console.log('💾 Updated state:', state.signupFormData);
    },
    
    updateSignupFormData: (state, action: PayloadAction<Partial<SignupFormData>>) => {
      console.log('🔄 updateSignupFormData reducer called with:', action.payload);
      console.log('🔄 Current signup form data:', state.signupFormData);
      
      if (state.signupFormData) {
        console.log('🔄 Updating existing signup form data');
        state.signupFormData = { ...state.signupFormData, ...action.payload };
      } else {
        console.log('🔄 Creating new signup form data');
        state.signupFormData = action.payload as SignupFormData;
      }
      
      console.log('🔄 Signup form data updated:', state.signupFormData);
    },
    
    clearSignupFormData: (state) => {
      console.log('🧹 clearSignupFormData reducer called');
      console.log('🧹 Before clear - signup form data:', state.signupFormData);
      
      state.signupFormData = null;
      state.isSignupFlow = false;
      
      console.log('🧹 After clear - signup form data:', state.signupFormData);
      console.log('🧹 Signup form data cleared');
    },

    loginSuccess: (state, action: PayloadAction<{ user: SuperAppUser; token: string }>) => {
      console.log("✅ loginSuccess reducer called");
      console.log("✅ LOGIN SUCCESS PAYLOAD:", action.payload);

      console.log("✅ Current auth state before login:", {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      });

      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.signupFormData = null;
      state.isSignupFlow = false;
      
      console.log("✅ New auth state after login:", {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      });
      
      console.log('🎉 LOGIN SUCCESS for:', action.payload.user.name);
      console.log('🔐 Auth state set to TRUE');
    },
     
    signupSuccess: (state, action: PayloadAction<{ user: SuperAppUser; token: string }>) => {
      console.log("✅ signupSuccess reducer called");
      console.log("✅ SIGNUP SUCCESS PAYLOAD:", action.payload);
      
      console.log("✅ Current auth state before signup:", {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      });
      
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.signupFormData = null;
      state.isSignupFlow = false;
      
      console.log("✅ New auth state after signup:", {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      });
      
      console.log('🎉 SIGNUP SUCCESS for:', action.payload.user.name);
      console.log('🔐 Auth state set to TRUE');
    },
    
    logout: (state) => {
      console.log('🚪 logout reducer called');
      console.log('🚪 Before logout - auth state:', {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      });
      
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.signupFormData = null;
      state.error = null;
      state.isSignupFlow = false;
      
      console.log('🚪 After logout - auth state:', {
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
      });
      console.log('🚪 User logged out');
      console.log('🔐 Auth state set to FALSE');
    },
    
    updateUser: (state, action: PayloadAction<Partial<SuperAppUser>>) => {
      console.log('👤 updateUser reducer called with:', action.payload);
      console.log('👤 Current user:', state.user);
      
      if (state.user) {
        console.log('👤 Updating existing user');
        state.user = { ...state.user, ...action.payload };
        
        console.log('👤 User updated:', state.user.name);
        console.log('👤 New user state:', state.user);
      } else {
        console.log('👤 No user to update');
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setSignupFlow,
  incrementOTPAttempts,
  clearOTPAttempts,
  clearAllOTPAttempts,
  setSignupFormData,
  updateSignupFormData,
  clearSignupFormData,
  loginSuccess,
  signupSuccess,
  logout,
  updateUser,
} = authSuperAppSlice.actions;

// ✅ SIMPLIFIED SELECTORS (no debugger to reduce re-renders)
export const selectSuperAppAuth = (state: RootState) => state.authSuperApp;
export const selectSuperAppIsAuthenticated = (state: RootState) => state.authSuperApp.isAuthenticated;
export const selectSuperAppUser = (state: RootState) => state.authSuperApp.user;
export const selectSuperAppToken = (state: RootState) => state.authSuperApp.token;
export const selectSignupFormData = (state: RootState) => state.authSuperApp.signupFormData;
export const selectSuperAppLoading = (state: RootState) => state.authSuperApp.isLoading;
export const selectSuperAppError = (state: RootState) => state.authSuperApp.error;
export const selectIsSignupFlow = (state: RootState) => state.authSuperApp.isSignupFlow;
export const selectOTPAttempts = (state: RootState) => state.authSuperApp.otpAttempts;

// ✅ OPTIMIZED: Memoized selector with better null checking
export const selectOTPAttemptsForPhone = (phone: string) => (state: RootState) => {
  console.log('🔍 selectOTPAttemptsForPhone called for phone:', phone);

  // ✅ ENSURE otpAttempts is always an object
  const otpAttempts = state.authSuperApp?.otpAttempts || {};
  const attempts = otpAttempts[phone];

  console.log('🔍 Found attempts for phone:', attempts);
  console.log('🔍 OTP attempts object:', otpAttempts);

  if (!attempts) {
    console.log('🔍 No attempts found, returning default');
    return { count: 0, isBlocked: false, blockedUntil: null };
  }

  const now = Date.now();
  const isBlocked = attempts.blockedUntil ? now < attempts.blockedUntil : false;

  console.log('🔍 Attempts calculation:', {
    count: attempts.count,
    isBlocked,
    blockedUntil: attempts.blockedUntil,
    now,
  });

  return {
    count: attempts.count,
    isBlocked,
    blockedUntil: attempts.blockedUntil,
    lastAttempt: attempts.lastAttempt,
  };
};

export default authSuperAppSlice.reducer;