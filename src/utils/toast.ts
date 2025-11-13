// utils/toast.ts - FIXED SYNTAX ERRORS
import Toast from 'react-native-toast-message';

/**
 * Show success toast with green checkmark - slides from top
 * @param message Main message to show
 * @param subtitle Optional subtitle text  
 * @param onHide Optional callback when toast disappears
 * @param duration How long to show (default: 3000ms)
 */
export const showSuccessToast = (
  message: string, 
  subtitle?: string, 
  onHide?: () => void,
  duration: number = 3000
) => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: subtitle,
    visibilityTime: duration,
    onHide,
    position: 'top',
    topOffset: 70, // Space from status bar
  });
};

/**
 * Show error toast with red X icon
 * Automatically handles different error formats from your API
 * @param error Error object, string, or API response
 * @param customMessage Optional override message
 */
export const showErrorToast = (error: any, customMessage?: string) => {
  let message = customMessage || 'Something went wrong';
  let subtitle = 'Please try again';

  // Handle different error formats from your AuthApi
  if (typeof error === 'string') {
    message = error;
    subtitle = '';
  } else if (error?.message) {
    // Handle array messages (like your backend sends)
    message = Array.isArray(error.message) ? error.message[0] : error.message;
    subtitle = '';
  }

  // 🔥 MAP YOUR BACKEND HTTP STATUS CODES TO USER-FRIENDLY MESSAGES
  switch (error?.status) {
    case 400:
      message = customMessage || 'Invalid request';
      subtitle = 'Please check your input and try again';
      break;
    case 401:
      message = 'Session expired';
      subtitle = 'Please log in again';
      break;
    case 403:
      message = 'Access denied';
      subtitle = 'You don\'t have permission for this action';
      break;
    case 404:
      message = customMessage || 'Not found';
      subtitle = 'The requested resource was not found';
      break;
    case 409:
      message = customMessage || 'Already exists';
      subtitle = 'This information is already in use';
      break;
    case 422:
      message = customMessage || 'Validation error';
      subtitle = 'Please check your input';
      break;
    case 429:
      message = 'Too many requests';
      subtitle = 'Please wait a moment and try again';
      break;
    case 500:
    case 502:
    case 503:
      message = 'Server error';
      subtitle = 'Please try again later';
      break;
    default:
      // Keep the extracted message from above
      break;
  }

  Toast.show({
    type: 'error',
    text1: message,
    text2: subtitle,
    visibilityTime: 4000,
    position: 'top',
    topOffset: 70,
  });
};

/**
 * Show info toast with blue info icon
 * @param message Main message to show
 * @param subtitle Optional subtitle text
 * @param duration How long to show (default: 2500ms)
 */
export const showInfoToast = (
  message: string, 
  subtitle?: string,
  duration: number = 2500
) => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: subtitle,
    visibilityTime: duration,
    position: 'top',
    topOffset: 70,
  });
};

/**
 * Show warning toast with orange warning icon
 * @param message Main message to show
 * @param subtitle Optional subtitle text
 * @param duration How long to show (default: 3500ms)
 */
export const showWarningToast = (
  message: string, 
  subtitle?: string,
  duration: number = 3500
) => {
  Toast.show({
    type: 'info', // Using info type but with warning emoji
    text1: `⚠️ ${message}`,
    text2: subtitle,
    visibilityTime: duration,
    position: 'top',
    topOffset: 70,
  });
};

/**
 * Hide any currently showing toast
 */
export const hideToast = () => {
  Toast.hide();
};

/**
 * Specialized toasts for your auth flow
 */
export const authToasts = {
  // Signup flow
  phoneAvailable: (onHide?: () => void) => 
    showSuccessToast('Phone Available! ✅', 'Continue to verification', onHide),
  
  phoneExists: () => 
    showErrorToast({ 
      message: 'phone number already',
      subtitle: 'Please try logging in instead' 
    }),
  
    otpSent: (method: 'SMS' | 'Call' = 'SMS') => {
      const message = method === 'Call' 
        ? 'Check your phone for the call 📞' 
        : 'Check your SMS messages 📱';
        
      return showSuccessToast(`OTP Sent via ${method}! ✅`, message);
    },
  
  signupSuccess: (firstName: string, onHide?: () => void) => 
    showSuccessToast(
      `Welcome ${firstName}! 🎉`, 
      'Your account has been created successfully',
      onHide,
      4000
    ),
  
  // Login flow  
  loginSuccess: (firstName: string, onHide?: () => void) => 
    showSuccessToast(
      `Welcome back ${firstName}! 👋`, 
      'You have been logged in successfully',
      onHide,
      3000
    ),
  
  // OTP verification
  otpIncomplete: () => 
    showInfoToast('Incomplete Code', 'Please enter the complete 4-digit code'),
  
  otpInvalid: () => 
    showErrorToast({ message: 'Invalid OTP', subtitle: 'Please check and try again' }),
  
  // General auth errors
  sessionExpired: () => 
    showWarningToast('Session Expired', 'Please log in again'),
  
  networkError: () => 
    showErrorToast({ message: 'Network Error', subtitle: 'Please check your connection' }),
};

// Export individual functions and the specialized auth toasts
export default {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  hideToast,
  authToasts,
};