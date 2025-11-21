import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';
import { API_ENDPOINT } from '@/utils';

interface IStripeResponse {
  url: string;
}

function StripeCheckout() {
  const [loading, loadingSetter] = useState(true);

  const params = useLocalSearchParams();

  // Constants
  const { id, orderId } = params;

  async function handleResponse(data: IStripeResponse) {
    if (data.url.includes('stripe/success')) {

      router.replace({
        pathname: '/order-tracking',
        params: { id: id },
      });
    } else if (data.url.includes('stripe/cancel')) {
      router.back();
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        javaScriptEnabled={true}
        // scrollEnabled={false}
        bounces={false}
        onLoad={() => {
          loadingSetter(false);
        }}
        source={{
          uri: `${API_ENDPOINT[process.env.NODE_ENV === 'production' ? 'PROD' : 'LOCAL'].SERVER_URL}stripe/create-checkout-session?id=${orderId}`,
        }}
        scalesPageToFit={true}
        onNavigationStateChange={(data) => {
          handleResponse(data);
        }}
      />
      {loading ? <ActivityIndicator style={{ position: 'absolute', bottom: '50%', left: '50%' }} /> : null}
    </View>
  );
}

export default StripeCheckout;
