import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BottomSheetIcon from '@/assets/svg/bottomSheet';
import LoadingSpinnerIconZeroStep from '@/assets/svg/progressBar/zeroStep';
import LoadingSpinnerIconStepOne from '@/assets/svg/progressBar/firstStep';
import LoadingSpinnerIconStepTwo from '@/assets/svg/progressBar/secondStep';
import LoadingSpinnerIconStepThree from '@/assets/svg/progressBar/thirdStep';
import LoadingSpinnerIconStepFourth from '@/assets/svg/progressBar/fourthStep';
import LoadingSpinnerIconStepFifth from '@/assets/svg/progressBar/fifthStep';
import { Ionicons } from '@expo/vector-icons';
import MessagingBottomSheet from '@/components/features/MessagingBottomSheet';
import CourierChatBottomSheet from '@/components/features/ChatBottomSheet/CourierChatBottomSheet';
import StoreChatBottomSheet from '@/components/features/ChatBottomSheet/StoreChatBottomSheet';

// Import your hooks
import { useOrderTracking, useOrderStatusInfo } from '@/hooks/useOrderTracking';
import { useRiderTracking } from '@/hooks/useRiderTracking';
import { CustomIcon } from '@/components';
import { canUserChat } from '@/utils/helpers/can-user-chat';

const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1E1E1E' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#FFFFFF' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1E1E1E' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#3C3C3C' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#999999' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3C5A78' }] },
];

const ORDER_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  ASSIGNED: 'ASSIGNED',
  PICKED: 'PICKED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  CANCELLEDBYREST: 'CANCELLEDBYREST',
};

const { width, height } = Dimensions.get('window');

interface OrderTrackingProps {
  orderId?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId: propOrderId }) => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ Use orderId from props or params (this is the _id, not orderId)
  const orderId = propOrderId || (id as string);

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [dark, setDark] = useState(false);
  const [showMessagingSheet, setShowMessagingSheet] = useState(false);
  const [showCourierChat, setShowCourierChat] = useState(false);
  const [showStoreChat, setShowStoreChat] = useState(false);

  const mapRef = useRef<MapView>(null);

  // ✅ Use your hooks here with the _id
  const { orderData, loading: orderLoading, error: orderError, remainingTime, statusText, refetch: refetchOrder } = useOrderTracking(orderId);

  const { riderLocation } = useRiderTracking(orderData?.rider?._id);

  // Get UI text based on order status
  const orderStatusInfo = useOrderStatusInfo(orderData, remainingTime);

  // Convert your working design to percentages
  const bottomSheetHeight = height * 0.45;
  const mapHeight = height * 0.7;
  const progressBarTop = bottomSheetHeight * 0.144;
  const buttonTop = bottomSheetHeight * 0.57;
  const buttonLeft = width * 0.0375;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        const current = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = current.coords;
        setUserLocation({ latitude, longitude });
      } catch (error) { }
    })();
  }, []);

  // ✅ Navigate to review screen when order is delivered
  useEffect(() => {
    if (orderData?.orderStatus === ORDER_STATUS.DELIVERED) {
      const timer = setTimeout(() => {
        router.push({
          pathname: '/order-review',
          params: {
            id: orderData._id, // ✅ Pass the _id
            restaurantName: orderData.restaurant?.name || 'Restaurant',
            orderDate: new Date(orderData.createdAt).toLocaleDateString('en-GB'),
          },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [orderData?.orderStatus, router, orderData?._id, orderData?.restaurant?.name, orderData?.createdAt]);

  const handleMessagePress = () => {
    setShowMessagingSheet(true);
  };

  const handleCloseMessagingSheet = () => {
    setShowMessagingSheet(false);
  };

  const handleOpenStoreChat = () => {
    if (!canUserChat(orderData?.orderStatus ?? '', 'STORE')) return;
    setShowStoreChat(true);
  };
  const handleOpenCourierChat = () => {
    if (!canUserChat(orderData?.orderStatus ?? '', 'RIDER')) return;

    setShowCourierChat(true);
  };

  const handleCloseCourierChat = () => {
    setShowCourierChat(false);
  };

  const handleCloseStoreChat = () => {
    setShowStoreChat(false);
  };

  // ✅ Determine map region with SEPARATED COORDINATES
  const getMapRegion = () => {
    if (!orderData) {
      return {
        latitude: userLocation?.latitude || 33.5831583,
        longitude: userLocation?.longitude || 73.0810976,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const restaurantLat = parseFloat(orderData.restaurant.location.coordinates[1]);
    const restaurantLng = parseFloat(orderData.restaurant.location.coordinates[0]);
    const deliveryLat = parseFloat(orderData.deliveryAddress.location.coordinates[1]);
    const deliveryLng = parseFloat(orderData.deliveryAddress.location.coordinates[0]);

    // ✅ Debug log to see the coordinates

    // If rider is assigned and picked up the order, center on rider location
    if (orderData.orderStatus === ORDER_STATUS.PICKED && riderLocation) {
      return {
        latitude: riderLocation.latitude,
        longitude: riderLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    // ✅ Show both restaurant and delivery locations with proper bounds
    const centerLat = (restaurantLat + deliveryLat) / 2;
    const centerLng = (restaurantLng + deliveryLng) / 2;

    // ✅ Ensure minimum delta to show both points clearly
    const latDelta = Math.max(Math.abs(restaurantLat - deliveryLat) * 1.5, 0.02);
    const lngDelta = Math.max(Math.abs(restaurantLng - deliveryLng) * 1.5, 0.02);

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  const initialRegion = getMapRegion();

  // Function to get the appropriate progress bar component
  const getProgressBarComponent = (status: string) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return <LoadingSpinnerIconStepOne width={190} height={190} />;
      case ORDER_STATUS.ACCEPTED:
        return <LoadingSpinnerIconStepTwo width={190} height={190} />;
      case ORDER_STATUS.ASSIGNED:
        return <LoadingSpinnerIconStepThree width={190} height={190} />;
      case ORDER_STATUS.PICKED:
        return <LoadingSpinnerIconStepFourth width={190} height={190} />;
      case ORDER_STATUS.DELIVERED:
      case ORDER_STATUS.COMPLETED:
        return <LoadingSpinnerIconStepFifth width={190} height={190} />;
      case ORDER_STATUS.CANCELLED:
      case ORDER_STATUS.CANCELLEDBYREST:
        return <LoadingSpinnerIconZeroStep width={190} height={190} />;
      default:
        return <LoadingSpinnerIconStepOne width={190} height={190} />;
    }
  };

  // ✅ Handle error state
  if (orderError) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-base mb-4 text-center">Error loading order: {orderError}</Text>
        <TouchableOpacity onPress={refetchOrder} className="p-3 bg-blue-500 rounded-lg">
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Loading state
  if (orderLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Loading order...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Map View - 70% of screen height */}
      <View className="relative w-full" style={{ height: mapHeight }}>
        <View className="absolute top-0 left-0 right-0 z-10">
          <TouchableOpacity
            onPress={() => {
              router.replace('/');
            }}
            className={`justify-center items-center rounded-full shadow-lg m-4 ${dark ? 'bg-neutral-900' : 'bg-white'} w-12 h-12 p-3`}
          >
            <CustomIcon icon={{ name: 'left', color: dark ? 'white' : 'black' }} />
          </TouchableOpacity>
        </View>

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={initialRegion}
          customMapStyle={dark ? MAP_DARK_STYLE : undefined}
          showsUserLocation={false}
        >
          {/* ✅ Restaurant Marker - RED */}
          {orderData && (
            <Marker
              coordinate={{
                latitude: parseFloat(orderData.restaurant.location.coordinates[1]),
                longitude: parseFloat(orderData.restaurant.location.coordinates[0]),
              }}
              title={orderData.restaurant.name}
              description="Restaurant"
            >
              <View className="bg-red-500 p-3 rounded-full border-2 border-white shadow-lg">
                <Ionicons name="restaurant" size={24} color="white" />
              </View>
            </Marker>
          )}

          {/* ✅ Customer/Delivery Marker - GREEN */}
          {orderData && (
            <Marker
              coordinate={{
                latitude: parseFloat(orderData.deliveryAddress.location.coordinates[1]),
                longitude: parseFloat(orderData.deliveryAddress.location.coordinates[0]),
              }}
              title="Delivery Address"
              description={orderData.deliveryAddress.deliveryAddress}
            >
              <View className="bg-green-500 p-3 rounded-full border-2 border-white shadow-lg">
                <Ionicons name="home" size={24} color="white" />
              </View>
            </Marker>
          )}

          {/* ✅ Rider Marker - BLUE (Only when picked up and we have rider location) */}
          {orderData?.orderStatus === ORDER_STATUS.PICKED && riderLocation && (
            <Marker
              coordinate={{
                latitude: riderLocation.latitude,
                longitude: riderLocation.longitude,
              }}
              title="Delivery Rider"
              description="Your rider is on the way"
            >
              <View className="bg-blue-500 p-3 rounded-full border-2 border-white shadow-lg">
                <Ionicons name="bicycle" size={24} color="white" />
              </View>
            </Marker>
          )}
        </MapView>
      </View>

      {/* Bottom Sheet - 45% of screen height */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-transparent"
        style={{
          height: bottomSheetHeight,
          width: width,
        }}
      >
        <BottomSheetIcon
          width={width}
          height={bottomSheetHeight}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: width,
            height: bottomSheetHeight,
          }}
        />

        {/* Loading Spinner - Responsive positioning but fixed size */}
        <View
          className="absolute justify-center items-center"
          style={{
            top: progressBarTop,
            left: width / 2 - 95,
            width: 190,
            height: 190,
          }}
        >
          {getProgressBarComponent(orderData?.orderStatus || ORDER_STATUS.PENDING)}
        </View>

        {/* Status Text - Middle of progress bar */}
        <View
          className="absolute left-0 right-0 items-center"
          style={{
            top: progressBarTop + 95 - 10,
          }}
        >
          <Text className="text-base font-semibold text-gray-800 text-center">{statusText}</Text>
        </View>

        {/* ✅ Three Text Lines Below Progress Bar - Real data */}
        <View
          className="absolute left-5 right-5 items-center"
          style={{
            top: progressBarTop + 190 + 20,
          }}
        >
          {/* First Line - Restaurant Name */}
          <Text className="text-lg font-bold text-gray-800 text-center mb-2">{orderStatusInfo.mainText}</Text>

          {/* Second Line - Order Info */}
          <Text className="text-sm text-gray-600 text-center mb-1.5">{orderStatusInfo.subText}</Text>

          {/* Third Line - Time Info */}
          <Text className="text-sm text-gray-600 text-center">{orderStatusInfo.timeText}</Text>
        </View>

        {/* ✅ Message Button - Only show when rider is assigned/picked and rider exists */}
        <TouchableOpacity
          onPress={handleMessagePress}
          className="absolute w-12 h-12 rounded-full bg-blue-500 justify-center items-center shadow-lg"
          style={{
            top: buttonTop,
            left: buttonLeft,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Ionicons name="chatbubble" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Messaging Bottom Sheet Modal */}
      <MessagingBottomSheet
        orderStatus={orderData?.orderStatus}
        visible={showMessagingSheet}
        onClose={handleCloseMessagingSheet}
        onOpenCourierChat={handleOpenCourierChat}
        onOpenStoreChat={handleOpenStoreChat}
      />

      {/* ✅ Courier Chat Bottom Sheet Modal - Pass orderId and rider info */}
      {canUserChat(orderData?.orderStatus ?? '', 'RIDER') && (
        <CourierChatBottomSheet
          visible={showCourierChat}
          onClose={handleCloseCourierChat}
          orderId={orderId}
          riderId={orderData?.rider?._id}
          riderName={orderData?.rider?.name || 'Courier Partner'}
        />
      )}

      {canUserChat(orderData?.orderStatus ?? '', 'STORE') && (
        <StoreChatBottomSheet
          visible={showStoreChat}
          onClose={handleCloseStoreChat}
          orderId={orderId}
          storeId={orderData?.restaurant?._id}
          storeName={orderData?.restaurant?.name || 'Store'}
        />
      )}
    </View>
  );
};

export default OrderTracking;
