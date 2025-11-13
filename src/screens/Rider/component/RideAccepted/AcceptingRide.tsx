import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import DriverOfferCard from '../DriverOfferCard';
import { webSocketService } from '@/services/websocketService';
import { getBids } from '@/screens/Rider/utils/getBids';
import { RootState, useAppSelector } from '@/redux';
import { useSelector } from 'react-redux';
import { acceptBid } from '../../utils/acceptBid';

interface Props {
  setRideAccepted: React.Dispatch<React.SetStateAction<boolean>>;
}

const AcceptingRide: React.FC<Props> = ({ setRideAccepted }) => {

  const ride = useAppSelector((state) => state.rideCreation.ride);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const currentUserId = useSelector((state: RootState) => state.authSuperApp.user?.id);
  console.log("currentUserId", currentUserId)



  console.log("My ride in accepting ride", ride)

  // API fallback
  const getBidsHandler = async (): Promise<any[]> => {
    console.log("📡 Fetching bids via API...");

    try {
      console.log("ride id is coming and is", ride?.existingRideRequest?.id);
      console.log("id", ride.rideReq?.id);

      const bidsResponse = await getBids({
        id: ride.rideReq?.id || ride?.existingRideRequest?.id,
      });

      console.log("📡 Fetched bids via API:", bidsResponse);

      const bids = bidsResponse?.bids || [];

      // ✅ Update state
      setDrivers(bids);

      // ✅ Also return bids for further processing
      return bids;
    } catch (error) {
      console.log("❌ Error fetching bids data", error);
      return []; // ✅ Always return an array (never void)
    }
  };


  // Connect WebSocket & handle connection status
  useEffect(() => {
    let connectionCleanup: (() => void) | undefined;
    let reconnectInterval: ReturnType<typeof setInterval> | undefined;
    let fallbackTimeout: ReturnType<typeof setTimeout> | undefined;
    let periodicApiCheck: ReturnType<typeof setInterval> | undefined;
    let previousBidsJSON: string | null = null; // to compare old vs new data

    console.log('🟢 useEffect triggered — initializing WebSocket and bid sync');

    const initializeSocket = async () => {
      try {
        const isConnected = webSocketService.isSocketConnected();
        setSocketConnected(isConnected);
        console.log(`🔌 Initial WebSocket state: ${isConnected ? 'Connected' : 'Disconnected'}`);

        if (!isConnected) {
          console.warn('⚠️ Socket not connected — attempting initial connect...');
          if (currentUserId) {
            await webSocketService.connect(currentUserId);
            console.log('✅ Initial WebSocket connection attempt complete');
          } else {
            console.warn('🚫 No user ID found — cannot connect WebSocket');
          }
        }

        // Fallback to API if still not connected
        if (!webSocketService.isSocketConnected()) {
          console.warn('⚠️ Socket still not connected — fetching bids via API');
          await safeGetBids();
        }

        // ✅ Listen to connection status
        connectionCleanup = webSocketService.onConnectionChange((connected) => {
          console.log(`📡 WebSocket connection change detected: ${connected}`);
          setSocketConnected(connected);

          if (!connected) {
            console.warn('❌ Socket disconnected — switching to API fallback');
            safeGetBids();

            // Start periodic reconnection attempts
            if (!reconnectInterval && currentUserId) {
              console.log('🚀 Starting WebSocket auto-reconnect attempts...');
              reconnectInterval = setInterval(async () => {
                if (!webSocketService.isSocketConnected()) {
                  console.log('🔄 Attempting auto-reconnect to WebSocket...');
                  try {
                    await webSocketService.connect(currentUserId);
                  } catch (err) {
                    console.warn('⚠️ Auto-reconnect failed:', err);
                  }
                } else {
                  console.log('✅ WebSocket reconnected — stopping interval');
                  clearInterval(reconnectInterval);
                  reconnectInterval = undefined;
                }
              }, 5000);
            }
          } else {
            console.log('✅ WebSocket connection is active');
            if (reconnectInterval) {
              clearInterval(reconnectInterval);
              reconnectInterval = undefined;
            }
          }
        });

        // ⏰ Fallback: If socket still not connected after 15s, refetch bids
        fallbackTimeout = setTimeout(async () => {
          if (!webSocketService.isSocketConnected()) {
            console.warn('🕒 Socket not connected after 15s — refetching bids');
            await safeGetBids();
          }
        }, 15000);
      } catch (err) {
        console.warn('⚠️ WebSocket initialization failed — using fallback');
        await safeGetBids();
      }
    };

    // Helper: safely fetch bids and compare with previous
    const safeGetBids = async () => {
      try {
        console.log('📨 Fetching bids from API...');
        const newBids = await getBidsHandler(); // should return array of bids

        if (!Array.isArray(newBids)) {
          console.warn('⚠️ Expected array but got:', newBids);
          return;
        }

        // ✅ Keep the entire bid object (no transformation)
        const newBidsJSON = JSON.stringify(newBids);
        if (previousBidsJSON !== newBidsJSON) {
          console.log('🔄 Bids updated — new data received');
          previousBidsJSON = newBidsJSON;
          setDrivers(newBids); // save full data
        } else {
          console.log('⏸ No change in bids — skipping update');
        }
      } catch (err) {
        console.warn('⚠️ Error fetching bids:', err);
      }
    };



    // 🚀 Initialize WebSocket + load initial data
    initializeSocket();
    safeGetBids();

    // 🔁 Always check API every 10s, even when socket is connected
    periodicApiCheck = setInterval(() => {
      console.log('🕙 10s periodic API check running...');
      safeGetBids();
    }, 10000);

    // 🧹 Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket effect...');
      connectionCleanup?.();
      if (reconnectInterval) clearInterval(reconnectInterval);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      if (periodicApiCheck) clearInterval(periodicApiCheck);
    };
  }, [ride?.rideReq?.id, currentUserId]);



  const bidAcceptedRide = async (data: any) => {

    console.log("hiting bidaccepted rideer", data)

    try {

      console.log("accepting ids are ", data?.id);

      const payload = {
        customerId: data?.rideRequest?.passenger_id,
        bidId: data?.id,
        isSchedule: false,
        payment_via: "CASH",
        scheduledAt: new Date().toISOString(),
      };

      const res = await acceptBid(data?.id, payload);
      console.log("✅ Bid accepted successfully:", res);
      if (res.message === "Bid accepted successfully") {

        setRideAccepted(true);
      }

    } catch (error: any) {
      setRideAccepted(false);
      console.error("❌ Failed to accept bid:", err.response);
    }



  }





  // Listen for live bids (with fallback if no socket data)
  useEffect(() => {
    let hasReceivedSocketData = false;
    let timeoutId: ReturnType<typeof setTimeout>

    const unsubscribe = webSocketService.onReceivedBid((bidData) => {
      hasReceivedSocketData = true;
      console.log('📩 Received bid via socket:', bidData);

      setDrivers((prevDrivers) => {
        const exists = prevDrivers.some(
          (driver) => driver.riderId === bidData.riderId
        );
        if (exists) return prevDrivers;
        return [...prevDrivers, bidData];
      });
    });

    // ⏱ Fallback: if no socket data arrives after 5 seconds, fetch API bids
    timeoutId = setTimeout(() => {
      if (!hasReceivedSocketData) {
        console.log('⚠️ No socket data received — fetching from API');
        getBidsHandler();
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [socketConnected]);

  return (
    <View className="flex-1 pt-10">
      <ScrollView>
        {Array.isArray(drivers) && drivers.length > 0 ? (
          drivers.map((driver, index) => (
            <DriverOfferCard
              key={index}
              driver={driver}
              index={index}
              onAccept={() => {
                // setRideAccepted(true);
                bidAcceptedRide(driver)
              }}
              setRideAccepted={setRideAccepted}
              onDecline={() => alert(`Declined ${driver.name || driver.riderId}`)}
            />
          ))
        ) : (
          <Text className="text-center text-gray-500 mt-10">
            {socketConnected ? 'Waiting for drivers to place bids...' : 'Socket disconnected. Showing data from API...'}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default AcceptingRide;
