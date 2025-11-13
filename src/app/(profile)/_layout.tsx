// app/(profile)/_layout.tsx
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profilemain" />
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="personal-info-update-name"/>
      <Stack.Screen name="personal-info-update-number"/>
      <Stack.Screen name="payment-methods"/>
      <Stack.Screen name="addPaymentMethod"/>
      <Stack.Screen name="addFund"/>
      <Stack.Screen name="wallet"/>
      <Stack.Screen name="myaddresses"/>
      <Stack.Screen name="addAddresses"/>
      <Stack.Screen name="fullMap"/>
      <Stack.Screen name="supportchat"/>
    </Stack>
  );
}

