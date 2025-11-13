import { Stack } from 'expo-router';

export default function StoresStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="all-store">
      <Stack.Screen name="categories-detail" />
      <Stack.Screen name="order-details" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="order-checkout" />
      <Stack.Screen name="items-search" options={{ presentation: 'modal' }} />
      <Stack.Screen name="store-details" />
      <Stack.Screen name="all-store" />
      <Stack.Screen name="see-all-items" />
      <Stack.Screen name="search-items" />
      <Stack.Screen name="order-tracking" />
      <Stack.Screen name="order-review" />
      <Stack.Screen name="store-map-view" />
    </Stack>
  );
}
