// screens/auth/screens/verify-otp-signup.tsx - FIXED OTP ERROR HANDLING
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { OtpInput } from 'react-native-otp-entry';
import { Ionicons } from '@expo/vector-icons';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import BackButton from '../components/BackButton';
import AuthHeader from '../components/AuthHeader';

// Redux & Hooks
import { selectSignupFormData, selectOTPAttemptsForPhone } from '@/redux';
import { useAuth } from '@/hooks/auth/useAuth';
import { showErrorToast, showInfoToast } from '@/utils/toast';

export default function VerifyOTPSignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets() || { top: 50, bottom: 34, left: 0, right: 0 };
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);


  const phone = (params?.phone as string) || '';
  const signupFormData = useSelector(selectSignupFormData);
  const otpAttempts = useSelector(selectOTPAttemptsForPhone(phone));

  const { completeSignup, sendSignupOTP, isCompletingSignup, isSendingSignupOTP } = useAuth();

  // Local state
  const [otp, setOTP] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showTryAnotherWay, setShowTryAnotherWay] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Clear error when typing
  useEffect(() => {
    if (otp.length > 0 && hasError) {
      setHasError(false);
      setErrorMessage('');
    }
  }, [otp]);

  // Listen to mutation state changes to handle UI errors
  useEffect(() => {
    if (completeSignup.isError) {
      setHasError(true);
      // Extract error message from the mutation error
      const error = completeSignup.error as any;
      if (error?.message) {
        const message = Array.isArray(error.message) ? error.message[0] : error.message;
        setErrorMessage(message);
      } else {
        setErrorMessage('The code you entered is incorrect');
      }
      setOTP(''); // Clear OTP on error
    }
  }, [completeSignup.isError, completeSignup.error]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ✅ FIXED: Remove local onError callback - let global handler work
  const handleVerifyOTP = () => {
    if (otp.length !== 4) {
      setHasError(true);
      setErrorMessage('Please enter the complete 4-digit code');
      return;
    }

    if (!signupFormData?.name) {
      showErrorToast('Signup data missing. Please start over.');
      router.replace('/(auth)/signupform');
      return;
    }

    // Check if user is blocked
    if (otpAttempts.isBlocked) {
      showErrorToast('Too many attempts. Please wait 5 minutes before trying again.');
      return;
    }

    // ✅ NO LOCAL onError - Let the global handler in useAuth work!
    completeSignup.mutate({
      sentOtp: otp,
      name: signupFormData.name,
      phone,
      device_push_token: 'dummy_token',
      user_type_id: '1bb5e86f-18db-4484-a04d-2ae51e72f724',
    });
  };
  useEffect(() => {
    console.log("my otp length :", otp.length);
    if (otp.length == 4) {
      handleVerifyOTP();
    }
  }, [otp])
  const handleResendOTP = () => {
    if (!canResend || isSendingSignupOTP) return;

    sendSignupOTP.mutate(
      { phone },
      {
        onSuccess: () => {
          setCountdown(30);
          setCanResend(false);
          setHasError(false);
          setErrorMessage('');
          setOTP(''); // Clear existing OTP
        },
      }
    );
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className="flex-1 px-6"
          style={{
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          }}
        >
          {/* TOP SECTION - Header */}
          <View className="mb-6">
            <BackButton onPress={() => router.back()} />
            <AuthHeader
              title="OTP"
              subtitle="We have sent OTP code verification to your mobile number"
            />
          </View>

          <View className="flex-1 justify-start pt-8">
            {/* Phone info */}
            <Text className="text-lg font-medium text-gray-800 mb-6 text-center">
              Enter OTP sent to ******{phone?.slice(-3) || '344'}
            </Text>

            {/* Error message */}
            {hasError && (
              <View className="flex-row items-center justify-center mb-4">
                <Ionicons
                  name="warning"
                  size={16}
                  color="#FF6B6B"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-red-500 text-sm">{errorMessage}</Text>
              </View>
            )}

            {/* OTP INPUT */}
            <OtpInput
              numberOfDigits={4}
              focusColor="#3853A4"
              onTextChange={setOTP}
              value={otp}
              textInputProps={{
                accessibilityLabel: 'One-Time Password',
                returnKeyType: 'done',
                onSubmitEditing: Keyboard.dismiss
              }}
              theme={{
                containerStyle: { marginBottom: 32 },
                pinCodeContainerStyle: {
                  borderWidth: 2,
                  borderColor: hasError ? '#FF6B6B' : '#E5E7EB',
                  backgroundColor: 'white',
                  borderRadius: 12,
                  width: 60,
                  height: 60,
                  marginHorizontal: 8,
                },
                focusedPinCodeContainerStyle: {
                  borderColor: hasError ? '#FF6B6B' : '#3853A4',
                },
                pinCodeTextStyle: {
                  fontSize: 20,
                  fontWeight: '600',
                  color: '#1F2937',
                },
              }}
            />
          </View>

          {/* BOTTOM SECTION - Actions */}
          {!isKeyboardVisible && (
            <View>
              {/* Verify Button */}
              <TouchableOpacity
                onPress={handleVerifyOTP}
                disabled={isCompletingSignup || otp.length !== 4 || otpAttempts.isBlocked}
                className={`w-full rounded-full py-4 px-8 items-center justify-center mb-4 ${isCompletingSignup || otp.length !== 4 || otpAttempts.isBlocked ? 'opacity-50' : ''
                  }`}
                style={{ backgroundColor: '#3853A4' }}
                activeOpacity={0.8}
              >
                {isCompletingSignup ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-lg font-semibold">
                    Verify OTP
                  </Text>
                )}
              </TouchableOpacity>

              {/* Resend section */}
              <View className="items-center mb-4">
                <Text className="text-gray-600 text-sm mb-3">
                  Didn't receive the code?
                </Text>

                {canResend ? (
                  <TouchableOpacity
                    onPress={handleResendOTP}
                    disabled={isSendingSignupOTP}
                    className="py-2 px-4"
                  >
                    {isSendingSignupOTP ? (
                      <ActivityIndicator size="small" color="#3853A4" />
                    ) : (
                      <Text className="text-blue-600 text-base font-medium">
                        Resend Code
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text className="text-gray-400 text-base">
                    Resend in {formatCountdown(countdown)}
                  </Text>
                )}
              </View>

              {/* Try another way */}
              {/* <TouchableOpacity
                onPress={() => setShowTryAnotherWay(true)}
                className="items-center mb-4"
              >
                <Text className="text-gray-500 text-sm">Try another way</Text>
              </TouchableOpacity> */}

              {/* Attempt counter */}
              {otpAttempts.count > 0 && (
                <View className="items-center">
                  <Text className={`text-xs ${otpAttempts.count >= 4 ? 'text-red-500' : 'text-orange-500'}`}>
                    Attempts: {otpAttempts.count}/5
                  </Text>
                  {otpAttempts.count >= 4 && (
                    <Text className="text-red-400 text-xs mt-1">
                      ⚠️ One more incorrect attempt will lock your account
                    </Text>
                  )}
                </View>
              )}
            </View>
          )

          }
        </View>
      </TouchableWithoutFeedback>

      {/* Try Another Way Bottom Sheet */}
      <Modal
        visible={showTryAnotherWay}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTryAnotherWay(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowTryAnotherWay(false)}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Pressable>
              <View className="bg-white rounded-t-3xl p-6">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-xl font-semibold text-gray-800">
                    Try another way
                  </Text>
                  <TouchableOpacity onPress={() => setShowTryAnotherWay(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* SMS Option (current method) */}
                <TouchableOpacity
                  onPress={() => {
                    setShowTryAnotherWay(false);
                    showInfoToast('Current Method', 'You are already using SMS verification');
                  }}
                  className="flex-row items-center justify-between py-4 px-2 mb-2"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color="#6B7280"
                      style={{ marginRight: 16 }}
                    />
                    <Text className="text-lg text-gray-800">Send code by SMS</Text>
                  </View>
                  <Ionicons name="checkmark" size={24} color="#00D4AA" />
                </TouchableOpacity>

                {/* Call Option (not implemented) */}
                <TouchableOpacity
                  onPress={() => {
                    setShowTryAnotherWay(false);
                    showInfoToast('Feature Coming Soon', 'Call verification will be available soon');
                  }}
                  className="flex-row items-center justify-between py-4 px-2"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="call-outline"
                      size={24}
                      color="#6B7280"
                      style={{ marginRight: 16 }}
                    />
                    <Text className="text-lg text-gray-800">Send code by Call</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Too Many Attempts Modal */}
      <Modal
        visible={otpAttempts.isBlocked}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View className="bg-white rounded-2xl p-6 mx-6 w-80">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="warning" size={32} color="#FF6B6B" />
              </View>
              <Text className="text-xl font-bold text-red-500 text-center">
                Too many attempts
              </Text>
            </View>

            <Text className="text-gray-600 text-center mb-6 leading-6">
              We've temporarily locked further attempts to protect your account.
              Try again in 5 minutes or contact support if you need help.
            </Text>

            {otpAttempts.blockedUntil && (
              <Text className="text-red-400 text-sm text-center mb-4">
                Locked until: {new Date(otpAttempts.blockedUntil).toLocaleTimeString()}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => {
                router.replace('/(auth)/welcome');
              }}
              className="rounded-full py-4 px-8 items-center justify-center"
              style={{ backgroundColor: '#FF6B6B' }}
            >
              <Text className="text-white text-lg font-semibold">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}