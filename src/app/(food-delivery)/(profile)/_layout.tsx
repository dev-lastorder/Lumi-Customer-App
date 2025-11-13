import { useAppSelector } from '@/redux';
import { router, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProfileStackLayout() {
  // useEffect(() => {
  //   router.push('/test-search');
  // }, []);
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    // If there's no token, immediately replace with the login screen
    if (!token) {
      router.replace('/(food-delivery)/(profile)/login');
    }
  }, [token]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName='profile'>
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen name="profile" />
      <Stack.Screen name="help" options={{ presentation: 'containedModal' }} />
      <Stack.Screen name="select-help-type" options={{ presentation: 'modal' }} />
      <Stack.Screen name="add-profile-details-setup" />
      <Stack.Screen name="email-entry" />
      <Stack.Screen name="phone-entry" />
      <Stack.Screen name="set-password" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="login" />
      <Stack.Screen name="account" />
      <Stack.Screen name="ticket-chat" />
      <Stack.Screen name="my-addresses" />
      <Stack.Screen name="add-new-address" />
      <Stack.Screen name="add-new-address-detail" />
      <Stack.Screen name="update-address" />
      <Stack.Screen name="coupons" />
      <Stack.Screen name='order-history' />
      <Stack.Screen name='past-order-detail' />
      <Stack.Screen name='all-favourites' />
      <Stack.Screen name='past-order-rating-and-tiping' />
      <Stack.Screen name='past-reorder' />
      <Stack.Screen name="order-tracking" />
      <Stack.Screen name="order-review" />
      <Stack.Screen name="order-details" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="order-checkout" />

    </Stack>
  );
}
