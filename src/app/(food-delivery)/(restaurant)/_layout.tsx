import { Stack } from 'expo-router';

export default function ReataurantStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="home">
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="restaurant-details" options={{ headerShown: false }} />
      <Stack.Screen name="items-search" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      <Stack.Screen name="restaurant-more-info" options={{ headerShown: false }} />
      <Stack.Screen name="restaurant-reviews" options={{ headerShown: false }} />
      <Stack.Screen name="restaurants" options={{ headerShown: false }} />
      <Stack.Screen name="categories" options={{ headerShown: false }} />
      <Stack.Screen name="see-all-categories" options={{ headerShown: false }} />
      <Stack.Screen name="order-tracking" />
      <Stack.Screen name="order-review" />
      <Stack.Screen name="order-details" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="order-checkout" />
    </Stack>
  );
}
