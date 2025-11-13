import { CustomText } from '@/components';
import { RootState } from '@/redux';
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
  const animation = useRef(new Animated.Value(1)).current;
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const rideSchedule = useSelector((state: RootState) => state.rideCreation.scheduleRide);

  const hourlyRide = useSelector((state: RootState) => state.rideCreation.hourlyRide);
  console.log('my driver data:', driver);

  const status =
    rideSchedule
      ? "schedule"
      : hourlyRide
        ? "hourlyRide"
        : "started";

  // ✅ Compute remaining time safely
  useEffect(() => {
    if (driver?.expiresAt) {
      const expiresAt = new Date(driver.expiresAt).getTime();
      const now = Date.now();
      const remainingMs = Math.max(expiresAt - now, 0);
      setRemainingTime(remainingMs);

      if (remainingMs > 0) {
        setDisabled(false);
        startExpiryCountdown(remainingMs);
      } else {
        setDisabled(true);
      }
    }
  }, [driver?.expiresAt]);

  // ✅ Slide-in animation
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, [index]);

  // ✅ Timer animation (fills from 100% → 0%)
  const startExpiryCountdown = (remainingMs: number) => {
    Animated.timing(animation, {
      toValue: 0,
      duration: remainingMs,
      useNativeDriver: false,
    }).start(() => setDisabled(true));

    // Disable when expired
    const timeout = setTimeout(() => {
      setDisabled(true);
      setRemainingTime(0);
    }, remainingMs);

    return () => clearTimeout(timeout);
  };

  // ✅ Update live countdown (mm:ss)
  useEffect(() => {
    if (!disabled && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1000) {
            clearInterval(interval);
            setDisabled(true);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [disabled, remainingTime]);

  const widthInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // ✅ Helper to format countdown
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View style={{ transform: [{ translateY: slideAnim }] }} className="bg-white rounded-3xl p-4 mb-4 mx-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-red-300 items-center justify-center">
            <Text className="text-white font-bold text-lg">{driver?.rider?.userProfile?.user?.name || 'john doe'}</Text>
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
        <TouchableOpacity onPress={onDecline} className="bg-[#F4F4F5] w-1/2 py-3 rounded-full items-center mr-2">
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
