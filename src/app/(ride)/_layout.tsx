// app/(ride)/_layout.tsx
import { Stack } from 'expo-router';

export default function RideLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="customer-ride/index" />
      <Stack.Screen name="ride-reservation" />
    </Stack>
  );
}