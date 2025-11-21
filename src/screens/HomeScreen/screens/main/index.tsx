/* cspell:word restaurantorders, groceryorders */

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, useAppSelector } from '@/redux';

import HomeScreenBanner from '../../component/banner';
import HomeScreenCards from '../../component/card';
import { webSocketService } from '@/services/websocketService';
import { rideRequestsService } from '@/screens/Rider/utils/rideRequestService';
import CustomerRide from '@/app/(ride)/customer-ride';
import adjust from '@/utils/helpers/adjust';
import { ScreenWrapperWithAnimatedHeader } from '@/components';
import firebaseMessagingService from '@/services/firebaseMessagingService';

const HomePageMainScreen = () => {
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.authSuperApp.user?.id);

  const [rideDataExist, setRideDataExist] = useState(false);

  // --- Check Active Ride ---
  useEffect(() => {
    const fetchActiveRide = async () => {
      const activeRide = await rideRequestsService.getActiveRide();
      console.log("🚗 Current active ride:", activeRide);

      if (activeRide?.isActiveRide === false) {
        setRideDataExist(false);
      } else if (activeRide && !activeRide?.isActiveRide) {
        setRideDataExist(true);
      } else {
        setRideDataExist(!!activeRide);
      }
    };

    fetchActiveRide();
  }, [rideDataExist]);

  // --- WebSocket Connection ---
  useEffect(() => {
    if (!userId) return;

    console.log('🔑 Connecting WebSocket for userId:', userId);

    webSocketService
      .connect(userId)
      .then(() => console.log('✅ WebSocket connected'))
      .catch((error) => console.error('❌ WebSocket connection failed:', error));

    const unsubscribeMessage = webSocketService.onMessage((message) => {
      console.log('📩 WS Message:', message);
    });

    const unsubscribeConnection = webSocketService.onConnectionChange((connected) => {
      console.log('🌐 WS Status:', connected);
    });

    return () => {
      console.log('👋 Cleaning up WebSocket');
      unsubscribeMessage();
      unsubscribeConnection();
      webSocketService.disconnect();
    };
  }, [userId]);

  const gap = adjust(20);

  return (
    <>
      {rideDataExist ? (
        <CustomerRide rideDataExist={rideDataExist} />
      ) : (
        <ScreenWrapperWithAnimatedHeader
          title="Home"
          contentContainerStyle={{
            flexGrow: 1,
            marginTop: gap,
            gap: gap,
            paddingBottom: gap,
          }}
          showCart={true}
          showMap={false}
          showSettings={false}
        >
          <HomeScreenBanner />
          <HomeScreenCards />
        </ScreenWrapperWithAnimatedHeader>
      )}
    </>
  );
};

export default HomePageMainScreen;
