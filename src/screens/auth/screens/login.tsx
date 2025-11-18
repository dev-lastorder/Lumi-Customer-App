// screens/auth/screens/login.tsx - REFACTORED WITH TANSTACK QUERY + TOAST
import React, { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ICountry } from 'react-native-international-phone-number';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import BackButton from '../components/BackButton';
import AuthHeader from '../components/AuthHeader';
import PhoneInputSection from '../components/PhoneInputSection';
import { SocialLoginButtons } from '../components/socialLoginButtons';

// 🔥 NEW: TanStack Query Hook + Toast
import { useAuth } from '@/hooks/auth/useAuth';
import { showInfoToast } from '@/utils/toast';
import { validatePhoneNumber } from '@/utils/helpers/validations';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Local form state
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<ICountry>();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Individual loading states for social buttons (manual)
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // 🔥 NEW: Use TanStack Query hook for login OTP (eliminates continueLoading)
  const { sendLoginOTP, isSendingLoginOTP } = useAuth();

  // 🔥 SIMPLIFIED: Main action handler (was 40+ lines, now 10 lines!)
  const handleContinue = () => {
    // Basic validation with toast
    // if (!phone.trim()) {
    //   showInfoToast('Phone Required', 'Please enter your phone number');
    //   return;
    // }

    // if (phone.trim().length < 7) {
    //   showInfoToast('Invalid Phone', 'Please enter a valid phone number');
    //   return;
    // }

    const isPhoneValid = validatePhoneNumber(phone);

    if (!isPhoneValid) return;

    // Format phone number
    const formattedPhone = `${country?.callingCode || '+974'}${phone.replace(/\s/g, '')}`;

    // 🔥 TRIGGER MUTATION: Directly send login OTP!
    // The hook will handle:
    // - 404 error (user doesn't exist) → show "Please sign up first" toast
    // - Success → navigate to verify-otp-login screen
    // sendLoginOTP.mutate({ phone: formattedPhone });

    router.push({
      pathname: '/(auth)/verification-method',
      params: { phone: formattedPhone, type: 'login' }
    });
  };

  // 🔍 GOOGLE LOGIN (unchanged for now)
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      // TODO: Implement Google login logic here
      await new Promise(resolve => setTimeout(resolve, 1500));
      showInfoToast('Coming Soon', 'Google login will be available soon!');
    } catch (error: any) {
      showInfoToast('Login Failed', 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // 🍎 APPLE LOGIN (unchanged for now) 
  const handleAppleLogin = async () => {
    try {
      setAppleLoading(true);

      // TODO: Implement Apple login logic here
      await new Promise(resolve => setTimeout(resolve, 1500));
      showInfoToast('Coming Soon', 'Apple login will be available soon!');
    } catch (error: any) {
      showInfoToast('Login Failed', 'Apple login failed. Please try again.');
    } finally {
      setAppleLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

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

  // 🔥 SIMPLIFIED: Use TanStack Query loading state
  const anyLoading = isSendingLoginOTP || googleLoading || appleLoading;

  return (
    <GradientBackground style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}>

          {/* TOP SECTION - Back Button & Header */}
          <View className="justify-start" style={{
            flex: 0.25,
            ...(isKeyboardVisible && Platform.OS === "android"
              ? { flex: 0.20, height: 44 }
              : {}),
          }}>
            <View className="mb-4">
              <BackButton onPress={handleGoBack} /> 
            </View>

            <AuthHeader
              title="Log in"
              subtitle="Hello, Welcome back to your account."
            />
          </View>

          {/* MIDDLE SECTION - Phone Input & Continue Button */}
          <View className="justify-center" style={{ flex: 0.5 }}>
            {/* Phone Input Section */}
            <PhoneInputSection
              phone={phone}
              country={country}
              onChangePhone={setPhone}
              onChangeCountry={setCountry}
              className="mb-8"
              instructionText="Enter your phone number to log in"
              confirmText="We'll send a verification code to your phone"
            />

            {/* 🔥 SIMPLIFIED: Continue Button with automatic loading state */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={anyLoading || !phone.trim()}
              className={`rounded-full py-4 px-8 items-center justify-center ${anyLoading || !phone.trim() ? 'opacity-60' : ''
                }`}
              style={{ backgroundColor: '#3853A4' }}
              activeOpacity={0.8}
            >
              {isSendingLoginOTP ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* BOTTOM SECTION - Social Login Buttons */}
          {!isKeyboardVisible && (
            <View className="justify-end" style={{ flex: 0.25 }}>
              <SocialLoginButtons
                onGooglePress={handleGoogleLogin}
                onApplePress={handleAppleLogin}
                loading={googleLoading || appleLoading}
                sectionTitle="Log in with"
              />
            </View>
          )

          }
        </View>
      </TouchableWithoutFeedback>
    </GradientBackground>
  );
}