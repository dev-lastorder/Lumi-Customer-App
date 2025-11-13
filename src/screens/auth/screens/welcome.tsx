// app/(auth)/welcome.tsx - FIXED VERSION
// 🎯 WHAT HAPPENS: User chooses between Signup or Login (Clean UI, no error states)

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'react-toastify';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 🔄 INDIVIDUAL LOADING STATES for each button
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // 🔵 SIGNUP BUTTON - Navigate to signup form
  const handleSignup = async () => {
    try {
      setSignupLoading(true);

      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // ➡️ NAVIGATE TO SIGNUP FORM (to enter name first)
      router.push('/(auth)/signupform');

    } catch (error: any) {
      console.error('❌ Navigation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  // ⚪ LOGIN BUTTON - Navigate to login
  const handleLogin = async () => {
    try {
      setLoginLoading(true);

      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // ➡️ NAVIGATE TO LOGIN (to enter phone directly)
      router.push('/(auth)/login');

    } catch (error: any) {
      console.error('❌ Navigation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Check if any button is loading
  const anyLoading = signupLoading || loginLoading;

  return (
    <View className="flex-1 justify-between px-6 bg-white relative" style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 }}>

      <Image source={require("@/assets/images/roundedBg.png")} className=" absolute w-60 h-[90%] right-0 top-10" resizeMode='cover' />

      {/* Top Section - Logo and Text */}
      <View className="flex-1 justify-center items-center">
        {/* LUMI Text Logo */}
        <Image source={require("@/assets/images/lumiLogo.png")} className="w-60 h-40" resizeMode='contain' />


        {/* Subtitle */}
        <Text className="text-lg text-gray-600 text-center">Are you ready to talk?</Text>
      </View>

      {/* Bottom Section - Buttons */}
      <View>
        {/* 🔵 SIGNUP BUTTON - Primary Action with individual loading */}
        <TouchableOpacity
          onPress={handleSignup}
          disabled={anyLoading}
          className={`rounded-full py-4 px-8 items-center justify-center ${anyLoading ? 'opacity-60' : ''
            }`}
          style={{ backgroundColor: '#3853A4' }}
          activeOpacity={0.8}
        >
          {signupLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white text-lg font-semibold">Signup</Text>
          )}
        </TouchableOpacity>

        {/* Spacer */}
        <View className="h-4" />

        {/* ⚪ LOGIN BUTTON - Secondary Action with individual loading */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={anyLoading}
          className={`rounded-full py-4 px-8 items-center justify-center border-2 bg-transparent ${anyLoading ? 'opacity-60' : ''
            }`}
          style={{ borderColor: '#3853A4' }}
          activeOpacity={0.8}
        >
          {loginLoading ? (
            <ActivityIndicator size="small" color="#3853A4" />
          ) : (
            <Text className="text-lg font-semibold" style={{ color: '#3853A4' }}>
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}