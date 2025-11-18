// screens/auth/screens/signup.tsx - REFACTORED WITH TANSTACK QUERY + TOAST
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ICountry } from 'react-native-international-phone-number';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import BackButton from '../components/BackButton';
import AuthHeader from '../components/AuthHeader';
import PhoneInputSection from '../components/PhoneInputSection';

// Redux
import { selectSignupFormData, type SignupFormData } from '@/redux';

// 🔥 NEW: TanStack Query Hook + Toast
import { useAuth } from '@/hooks/auth/useAuth';
import { showInfoToast } from '@/utils/toast';
import { validatePhoneNumber } from '@/utils/helpers/validations';

export default function SignupPhoneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Redux state - should have name from previous screen
  const signupFormData: SignupFormData | null = useSelector(selectSignupFormData);

  // Local form state
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<ICountry>();

  // 🔥 NEW: Use TanStack Query hook instead of manual state
  const { checkPhoneExists, isCheckingPhone } = useAuth();

  // Check if user has completed the name step
  useEffect(() => {}, [signupFormData]);

  // 🔥 SIMPLIFIED: Main action handler (was 40+ lines, now 15 lines!)
  const handleContinue = () => {
    // Basic validation with toast
    // if (!phone.trim()) {
    //   showInfoToast('Phone Required', 'Please enter your phone number');
    //   return;
    // }

    // if (phone.trim().length < 10) {
    //   showInfoToast('Invalid Phone', 'Please enter a valid phone number');
    //   return;
    // }

    const isPhoneValid = validatePhoneNumber(phone);

    if (!isPhoneValid) return;

    if (!signupFormData || !signupFormData.name) {
      showInfoToast('Error', 'Name is missing. Please start over.');
      return;
    }

    // Format phone number
    const formattedPhone = `${country?.callingCode || '+974'}${phone.replace(/\s/g, '')}`;

    // 🔥 TRIGGER MUTATION: All success/error handling is in the hook!
    checkPhoneExists.mutate(formattedPhone);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  // Show loading if no form data yet
  if (!signupFormData || !signupFormData.name) {
    return (
      <GradientBackground style={{ flex: 1 }}>
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color="#3853A4" />
          <Text className="text-gray-600 text-center mt-4">Loading...</Text>
        </View>
      </GradientBackground>
    );
  }

  // Extract first name for greeting
  const firstName = signupFormData.name.split(' ')[0];

  return (
    <GradientBackground style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 px-6" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}>
          {/* TOP SECTION - Back Button & Header */}
          <View className="justify-start mb-8">
            <View className="mb-4">
              <BackButton onPress={handleGoBack} />
            </View>

            {/* Personalized header with first name */}
            <AuthHeader title="Phone number" subtitle={`Hi ${firstName}, please enter your phone number to continue.`} />
          </View>

          {/* MIDDLE SECTION - Phone Input */}
          <View className="flex-1 justify-center">
            {/* Phone Input Section */}
            <PhoneInputSection
              phone={phone}
              country={country}
              onChangePhone={setPhone}
              onChangeCountry={setCountry}
              className="mb-8"
              instructionText="We'll verify your phone number"
              confirmText="Your phone number will be checked and verified"
            />

            {/* 🔥 SIMPLIFIED: Continue Button with automatic loading state */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={isCheckingPhone || !phone.trim()}
              className={`rounded-full py-4 px-8 items-center justify-center ${isCheckingPhone || !phone.trim() ? 'opacity-60' : ''}`}
              style={{ backgroundColor: '#3853A4' }}
              activeOpacity={0.8}
            >
              {isCheckingPhone ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="text-white text-lg font-semibold ml-2">Checking...</Text>
                </View>
              ) : (
                <Text className="text-white text-lg font-semibold">Continue</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* BOTTOM SECTION - Account Summary */}
          {/* <View className="justify-end">
            <View className="bg-white/30 rounded-2xl p-4">
              <View className="mb-2">
                <Text className="text-sm" style={{ color: '#969696' }}>
                  Creating account for:
                </Text>
              </View>
              <View className="mb-1">
                <Text className="text-base font-medium text-gray-800">
                  {signupFormData.name}
                </Text>
              </View>
              {phone && (
                <View className="mt-1">
                  <Text className="text-sm" style={{ color: '#969696' }}>
                    Phone: {country?.callingCode || '+974'}{phone}
                  </Text>
                </View>
              )}
            </View>
          </View> */}
        </View>
      </TouchableWithoutFeedback>
    </GradientBackground>
  );
}
