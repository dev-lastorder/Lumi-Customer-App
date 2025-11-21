// In your OrderTrackingPage component
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderReview from '@/screens/order/screens/order-review';

export default function OrderTrackingPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top']}>
      <OrderReview />
    </SafeAreaView>
  );
}