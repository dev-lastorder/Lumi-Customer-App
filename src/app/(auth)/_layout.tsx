// app/(auth)/_layout.tsx - UPDATED WITH ALL SCREENS
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signupform" />
      <Stack.Screen name="verification-method" />
      
      {/* NEW: Two separate OTP verification screens */}
      <Stack.Screen name="verify-otp-signup" />
      <Stack.Screen name="verify-otp-login" />
      <Stack.Screen name="Terms&Service" />
      
      {/* OLD: Remove this if you're not using the generic one anymore */}
      <Stack.Screen name="verification-otp" />
    </Stack>
  );
}