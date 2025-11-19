import { CustomText } from '@/components';
import { RootState, useAppSelector } from '@/redux';
import { webSocketService } from '@/services/websocketService';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { useSelector } from 'react-redux';

interface DriverOfferCardProps {
  driver: {
    name: string;
    price: number;
    rating: number;
  };
  onAccept: () => void;
  onDecline: () => void;
  index: number;
  setRideAccepted: any;
}

const DriverOfferCard: React.FC<DriverOfferCardProps> = ({ driver, onAccept, onDecline, index, setRideAccepted }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const TOTAL_TIME = 15000;

  const [remainingTime, setRemainingTime] = useState(TOTAL_TIME);
  const [disabled, setDisabled] = useState(false);

  const animation = useRef(new Animated.Value(1)).current;
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const rideSchedule = useSelector((state: RootState) => state.rideCreation.scheduleRide);
  const ride = useAppSelector((state) => state.rideCreation.ride);


  const hourlyRide = useSelector((state: RootState) => state.rideCreation.hourlyRide);
  console.log('my driver data:', driver);

  const status =
    rideSchedule
      ? "schedule"
      : hourlyRide
        ? "hourlyRide"
        : "started";


  // ✅ Slide-in animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      delay: index * 150,
      useNativeDriver: true
    }).start();
  }, []);

  // =============== Timer Logic ===============
  useEffect(() => {
    setRemainingTime(TOTAL_TIME);
    setDisabled(false);

    // progress bar animation
    Animated.timing(animation, {
      toValue: 0,
      duration: TOTAL_TIME,
      useNativeDriver: false
    }).start(() => setDisabled(true));

    // countdown clock
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1000) {
          clearInterval(interval); 
          setDisabled(true);

          // Auto-remove card when expired
          onDecline(driver?.rideRequest?.id);

          return 0;
        }
        return prev - 1000;
      });
    }, 1000);


    return () => clearInterval(interval);
  }, [driver]);

  const widthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  // Format mm:ss
  const formatTime = (ms: number) => {
    const secs = Math.floor(ms / 1000);
    return `0:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }] }} className="bg-white rounded-3xl p-4 mb-4 mx-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {driver?.rider?.userProfile?.user?.profile ? (
              <Image
                source={{ uri: driver?.rider?.userProfile?.user?.profile }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full bg-[#1E2B66] items-center justify-center">
                <Text className="text-white font-bold text-lg">
                  {driver?.rider?.userProfile?.user?.name?.charAt(0) || 'J'}
                </Text>
              </View>
            )}
          </View>


          <View>
            <View className="gap-1 flex-row items-center">
              <CustomText fontSize="sm">{driver?.rider?.userProfile?.user?.name || 'Unknown Driver'}</CustomText>
              <CustomText fontSize="sm">⭐ {driver?.rating || '—'}</CustomText>
              <CustomText lightColor="#71717A" fontSize="sm">
                ({driver?.rides || 0} rides)
              </CustomText>
            </View>

            <CustomText fontSize="sm">{driver?.rider?.rideTypes?.name || 'Vehicle Info Missing'}</CustomText>
          </View>
        </View>

        <View className="items-end">
          <CustomText fontSize="sm" fontWeight="semibold">
            {remainingTime > 0 ? formatTime(remainingTime) : 'Expired'}
          </CustomText>
        </View>
      </View>

      <CustomText fontSize="xl" lightColor="#1677A4" fontWeight="semibold" className="mt-4">
        {currency?.code} {driver?.price?.toFixed(2) || '—'}
      </CustomText>

      <View className="flex-row mt-3">
        <TouchableOpacity onPress={() => onDecline(driver?.rideRequest?.id)} className="bg-[#F4F4F5] w-1/2 py-3 rounded-full items-center mr-2">
          <CustomText lightColor="#18181B">Decline</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            if (!disabled) {
              setRideAccepted(true);
              onAccept?.();
              webSocketService.emitBidAccepted(driver?.rideRequest?.id, driver?.rider?.userProfile?.user?.id, status);
            }
          }}
          style={{
            flex: 1,
            backgroundColor: disabled ? '#ccc' : '#1E2B66', // darker default color
            borderRadius: 999,
            overflow: 'hidden',
            marginLeft: 8,
          }}
        >
          {/* Timer overlay */}
          <View style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
            <Animated.View
              style={{
                height: '100%',
                width: widthInterpolate,
                backgroundColor: 'rgba(0,0,0,0.3)', // darkens instead of lightens
              }}
            />
          </View>

          {/* Button text */}
          <View style={{ paddingVertical: 12, alignItems: 'center' }}>
            <CustomText lightColor="white">{disabled ? 'Expired' : 'Accept'}</CustomText>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default DriverOfferCard;
