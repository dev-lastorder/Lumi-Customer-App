import { Stack } from 'expo-router';

export default function ReataurantStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="discovery">
      <Stack.Screen name="order-tracking" />
      <Stack.Screen name="order-review" />
      <Stack.Screen name="discovery" />
      <Stack.Screen name="home" />
      <Stack.Screen name="order-details" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="order-checkout" />
      <Stack.Screen name="cart" options={{ presentation: 'transparentModal', animation: 'slide_from_bottom', headerShown: false }} />
    </Stack>
  );
}
