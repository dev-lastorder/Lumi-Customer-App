// app/(auth)/verify-otp.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import BackButton from '../components/BackButton';
import AuthHeader from '../components/AuthHeader';

// Redux
import {
  setSuperAppLoading,
  clearSuperAppError,
  selectSignupFormData,
  selectSuperAppLoading,
  incrementOTPAttempts,
  clearOTPAttempts,
  loginSuccess, // Fixed from loginSuccessSuper
  signupSuccess,
} from '@/redux';

// API
import { AuthApi } from '@/services/api/authApi';

const CUSTOMER_USER_TYPE_ID = '1bb5e86f-18db-4484-a04d-2ae51e72f724';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();

  // Parameters
  const phone = params.phone as string;
  const type = params.type as string;
  const method = params.method as string;
  const userId = params.userId as string;

  // Redux state
  const signupFormData = useSelector(selectSignupFormData);
  const isLoading = useSelector(selectSuperAppLoading);

  // OTP Input State
  const [otp, setOTP] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown State
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Refs
  const otpRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOTPChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
    dispatch(clearSuperAppError());

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    const newOTP = [...otp];
    if (newOTP[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
      newOTP[index - 1] = '';
    } else {
      newOTP[index] = '';
    }
    setOTP(newOTP);
  };

  const handleVerifyOTP = async (otpValue?: string) => {
    const codeToVerify = otpValue || otp.join('');

    if (codeToVerify.length !== 4) {
      Alert.alert('Incomplete Code', 'Please enter the complete 4-digit code');
      return;
    }

    if (isVerifying) {
      console.log('⏸️ Already verifying, skipping');
      return;
    }

    setIsVerifying(true);

    try {
      dispatch(setSuperAppLoading(true));
      dispatch(clearSuperAppError());

      console.log(`🔐 Verifying OTP for ${type} with code: ${codeToVerify}`);
      console.log(`📱 Phone: ${phone}`);
      console.log(`👤 User ID: ${userId || 'N/A'}`);

      if (type === 'signup') {
        if (!signupFormData?.name) {
          Alert.alert('Error', 'Signup data is missing. Please start over.');
          return;
        }

        const signupData = {
          sentOtp: codeToVerify,
          name: signupFormData.name,
          phone: phone,
          device_push_token: 'dummy_token',
          user_type_id: CUSTOMER_USER_TYPE_ID,
        };

        console.log('🔵 SIGNUP - Calling signupFinalStep with:', {
          phone: signupData.phone,
          name: signupData.name,
          otp: signupData.sentOtp,
          user_type_id: signupData.user_type_id,
        });

        const response = await AuthApi.signupFinalStep(signupData);

        console.log('✅ SIGNUP Response:', response);
        console.log("✅ If condition outside:",response?.success)
        if (response?.success) {
          console.log("✅ If condition inside:",phone)
          dispatch(clearOTPAttempts(phone));
          console.log("✅ after clear attempts otp")
          console.log("✅ before signupSuccess")
          dispatch(signupSuccess({
            user: response.user,
            token: response.token || '', // Fallback to empty string if token is missing
          }));
          console.log("✅ bafefore signupSuccess")

          Alert.alert('Success!', response.message || 'Account created successfully!', [{
            text: 'Continue',
            onPress: () => {
              setTimeout(() => router.replace('/home'), 500);
            },
          }]);
        } else {
          throw new Error('Invalid response format from server');
        }

      } else {
        if (!userId) {
          Alert.alert('Error', 'User ID is missing. Please try logging in again.');
          return;
        }

        const loginData = {
          userId: userId,
          sentOtp: codeToVerify,
          login_as: 'Customer' as const,
        };

        console.log('🟢 LOGIN - Calling loginPhoneVerify with:', {
          userId: loginData.userId,
          otp: loginData.sentOtp,
          login_as: loginData.login_as,
        });

        const response = await AuthApi.loginPhoneVerify(loginData);

        console.log('✅ LOGIN Response:', response);

        if (response?.success && response?.user) {
          // dispatch(clearOTPAttempts(phone));

          dispatch(loginSuccess({
            user: response.user,
            token: response.token || '', // Fallback to empty string if token is missing
          }));

          Alert.alert('Success!', response.message || 'Login successful!', [{
            text: 'Continue',
            onPress: () => {
              setTimeout(() => router.replace('/home'), 500);
            },
          }]);
        } else {
          throw new Error('Invalid response format from server');
        }
      }

    } catch (error: any) {
      console.error('❌ OTP verification error:', error);
      console.error('❌ Error details:', {
        status: error.status,
        message: error.message,
        data: error.data,
      });

      dispatch(incrementOTPAttempts(phone));

      let errorMessage = 'The code you entered is incorrect.';

      if (error.message) {
        errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      }

      if (error.status === 409) {
        errorMessage = 'User with this phone number already exists. Please try logging in instead.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.status === 400 && errorMessage.toLowerCase().includes('otp')) {
        errorMessage = 'Incorrect verification code. Please try again.';
      } else if (error.status === 404 && errorMessage.includes('User Type')) {
        errorMessage = 'System configuration error. Please contact support.';
      }

      Alert.alert('Verification Failed', errorMessage);

      setOTP(['', '', '', '']);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);

    } finally {
      dispatch(setSuperAppLoading(false));
      setIsVerifying(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6" style={{ paddingTop: 40, paddingBottom: 40 }}>
          {/* Header */}
          <View className="justify-start" style={{ flex: 0.25 }}>
            <View className="mb-4">
              <BackButton onPress={() => router.back()} />
            </View>
            <AuthHeader
              title="OTP"
              subtitle="We have sent OTP code verification to your mobile number"
            />
          </View>

          {/* OTP Input */}
          <View className="justify-center" style={{ flex: 0.5 }}>
            <Text className="text-lg font-medium text-gray-800 mb-4">
              Enter OTP sent to ******{phone?.slice(-3) || '***'}
            </Text>

            {/* Debug Info */}
            {__DEV__ && (
              <View className="mb-4 p-3 bg-blue-50 rounded-xl">
                <Text className="text-xs text-blue-600">
                  Flow: {type} | Method: {method} | Phone: {phone}
                  {userId && `\nUser ID: ${userId.slice(-6)}`}
                </Text>
              </View>
            )}

            {/* OTP Input Boxes */}
            <View className="flex-row justify-between mb-4">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  value={digit}
                  onChangeText={(text) => handleOTPChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(index);
                    }
                  }}
                  maxLength={1}
                  keyboardType="numeric"
                  className="w-16 h-16 text-center text-xl font-semibold rounded-xl border-2 border-gray-200 bg-white"
                  style={{ color: '#1F2937' }}
                  autoFocus={index === 0}
                  editable={!isLoading && !isVerifying}
                />
              ))}
            </View>
          </View>

          {/* Actions */}
          <View className="justify-end" style={{ flex: 0.25 }}>
            <TouchableOpacity
              onPress={() => handleVerifyOTP()}
              disabled={isLoading || isVerifying || otp.join('').length !== 4}
              className={`rounded-full py-4 px-8 items-center justify-center mb-4 ${
                isLoading || isVerifying || otp.join('').length !== 4 ? 'opacity-50' : ''
              }`}
              style={{ backgroundColor: '#3853A4' }}
              activeOpacity={0.8}
            >
              {isLoading || isVerifying ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Verify OTP ({type})
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </GradientBackground>
  );
}