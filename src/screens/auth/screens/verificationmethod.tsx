// screens/auth/screens/verificationmethod.tsx - UPDATED FOR SPECIFIC OTP NAVIGATION
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import BackButton from '../components/BackButton';
import AuthHeader from '../components/AuthHeader';

// Hooks & Utils
import { useAuth } from '@/hooks/auth/useAuth';
import { authToasts, showInfoToast } from '@/utils/toast';

export default function VerificationMethodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Parameters from previous screen
  const phone = params.phone as string;
  const type = params.type as string; // 'login' or 'signup'

  // TanStack Query hooks - automatically handles navigation to correct OTP screen
  const { sendSignupOTP, sendLoginOTP, isSendingSignupOTP, isSendingLoginOTP } = useAuth();

  // Determine loading states based on flow type
  const isSMSLoading = type === 'signup' ? isSendingSignupOTP : isSendingLoginOTP;
  const isCallLoading = false; // Call functionality not implemented

  const [smsLoading, setSmsLoading] = useState(false);
  const [callLoading, setCallLoading] = useState(false);

  const handleSendSMS = async () => {
    setSmsLoading(true);
    try {
      if (type === 'signup') {
        await sendSignupOTP.mutateAsync({ phone, otp_type: 'sms' });
      } else if (type === 'login') {
        await sendLoginOTP.mutateAsync({ phone, otp_type: 'sms' });
      }

      authToasts.otpSent('SMS');
    } finally {
      setSmsLoading(false);
    }
  };

  // REPLACE existing handleSendCall function (around line 40):
  const handleSendCall = async () => {
    setCallLoading(true);
    try {
      if (type === 'signup') {
        await sendSignupOTP.mutateAsync({ phone, otp_type: 'call' });
      } else if (type === 'login') {
        await sendLoginOTP.mutateAsync({ phone, otp_type: 'call' });
      }
      authToasts.otpSent('Call');
    } finally {
      setCallLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Check if any button is loading
  const anyLoading = smsLoading || callLoading;

  return (
    <GradientBackground style={{ flex: 1 }}>
      <View className="flex-1 px-6" style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}>
        {/* TOP SECTION - Back Button & Header */}
        <View className="justify-start" style={{ flex: 0.25 }}>
          <View className="mb-4">
            <BackButton onPress={handleGoBack} />
          </View>

          <AuthHeader title="Choose verification method" subtitle="How would you like to receive your OTP? Call or SMS." />
        </View>

        {/* MIDDLE SECTION - Robot Image Placeholder */}
        <View className="justify-center items-center" style={{ flex: 0.5 }}>
          <Image source={(require("@/assets/images/chatImage.png"))} className='w-80 h-64'
            resizeMode="contain" />
        </View>


        {/* BOTTOM SECTION - Method Selection Buttons */}
        <View className="justify-end" style={{ flex: 0.25 }}>
          <TouchableOpacity
            onPress={handleSendSMS}
            disabled={anyLoading}
            className={`rounded-full py-4 px-8 flex-row items-center justify-center mb-4 bg-white/50 border border-gray-200 ${anyLoading ? 'opacity-60' : ''
              }`}
            activeOpacity={0.8}
          >
            {smsLoading ? (
              <>
                <ActivityIndicator size="small" color="#969696" style={{ marginRight: 8 }} />
                <Text className="text-lg font-semibold" style={{ color: '#969696' }}>
                  Sending SMS...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="chatbubble-outline" size={20} color="#969696" style={{ marginRight: 8 }} />
                <Text className="text-lg font-semibold" style={{ color: '#969696' }}>
                  Send code by SMS
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* "or" Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-base font-medium" style={{ color: '#969696' }}>
              or
            </Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Call Button with coming soon functionality */}
          <TouchableOpacity
            onPress={handleSendCall}
            disabled={anyLoading}
            className={`rounded-full py-4 px-8 flex-row items-center justify-center ${anyLoading ? 'opacity-60' : ''}`}
            style={{ backgroundColor: '#3853A4' }}
            activeOpacity={0.8}
          >
            {callLoading ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text className="text-white text-lg font-semibold">Calling...</Text>
              </>
            ) : (
              <>
                <Ionicons name="call-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text className="text-white text-lg font-semibold">Send code by Call</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Flow indicator */}
          <View className="mt-4 items-center">
            <Text className="text-white/60 text-sm">{type === 'signup' ? 'Creating new account' : 'Logging into existing account'}</Text>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}
