// In your OrderTrackingPage component
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderTracking from '@/screens/order/screens/order-tracking';
import { Stack } from 'expo-router';

export default function OrderTrackingPage() {
  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
        <OrderTracking />
      </SafeAreaView>
  );
}
