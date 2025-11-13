// src/redux/slices/index.ts - STEP 4: FIXED EXPORTS
export * from './configurationSlice';
export * from './themeSlice';
export * from './addNewAddressSlice';
export * from './cartSlice';

// Export food delivery auth slice actions with unique names
export {
  loginSuccess as loginSuccessFood,
  logout as logoutFood,
  setUser,
  setToken,
} from './authSlice';

// ✅ FIXED: Export super app auth actions with correct names
export {
  setLoading as setSuperAppLoading,
  setError as setSuperAppError,
  clearError as clearSuperAppError,
  setSignupFlow,
  incrementOTPAttempts,
  clearOTPAttempts,
  clearAllOTPAttempts,
  setSignupFormData,
  updateSignupFormData,
  clearSignupFormData,
  loginSuccess, // ✅ FIXED: Export as loginSuccess (not loginSuccessSuper)
  signupSuccess,
  logout as logoutSuper,
  updateUser,
  
  // ✅ Export ALL selectors - CRITICAL FOR AUTH CHECK
  selectSuperAppAuth,
  selectSuperAppIsAuthenticated,
  selectSuperAppUser,
  selectSuperAppToken,
  selectSignupFormData,
  selectSuperAppLoading,
  selectSuperAppError,
  selectIsSignupFlow,
  selectOTPAttempts,
  selectOTPAttemptsForPhone,
  
  // ✅ Export types
  type SuperAppUser,
  type SignupFormData,
  type OTPAttempts,
} from './authSliceSuperApp';