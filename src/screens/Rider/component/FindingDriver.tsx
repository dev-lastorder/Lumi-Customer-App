import { View, Text, Pressable, Animated, Easing, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AcceptingRide from './RideAccepted/AcceptingRide';
import { useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/redux';
import { getNearbyDrivers } from '../utils/getNearByVehicles';
import { useDispatch } from 'react-redux';
import { resetLocations } from '@/redux/slices/RideSlices/rideLocationSlice';
import { clearRide } from '@/redux/slices/RideSlices/rideCreationSlice';
import { clearLastSelectedRide } from '@/redux/slices/RideSlices/rideSelectionSlice';
import { router } from 'expo-router';
import { raiseFare } from '../utils/requestRide';
import { webSocketService } from '@/services/websocketService';

interface Props {
  fallback: boolean;
  setFallback: React.Dispatch<React.SetStateAction<boolean>>;
  setRideConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setFindingRide: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindingDriver: React.FC<Props> = ({ fallback, setFallback, setRideConfirmation, setFindingRide }) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(60);
  const [showFinding, setShowFinding] = useState(true);
  const dispatch = useDispatch();
  const ride = useSelector((state: RootState) => state.rideCreation.ride) as any;
  const [fareRaised, setFareRaised] = useState(false);

  const myRideFare = useSelector((state: RootState) => state.rideCreation.myRideFare);
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState(Number(ride?.offeredFair) || Number(myRideFare) || 56.7);
  const [basePrice] = useState(price);

  console.log('fallback in finding driver', ride);

  const handleDecrease = () => {
    setPrice((prev) => {
      const newPrice = parseFloat((prev - 0.5).toFixed(2));
      if (newPrice <= basePrice) setFareRaised(false);
      return newPrice;
    });
  };

  const handleIncrease = () => {
    setPrice((prev) => {
      const newPrice = parseFloat((prev + 0.5).toFixed(2));
      if (newPrice > basePrice) setFareRaised(true);
      return newPrice;
    });
  };
  const fromLocation = useSelector((state: RootState) => state.rideLocation.fromLocation);
  const fromCoords = useSelector((state: RootState) => state.rideLocation.fromCoords);
  const toLocation = useSelector((state: RootState) => state.rideLocation.toLocation);
  const toCoords = useSelector((state: RootState) => state.rideLocation.toCoords);

  const handleCancelRide = () => {
    setFallback(false);
    setRideConfirmation(false);
    setFindingRide(false);
    dispatch(resetLocations());
    dispatch(clearRide());
    dispatch(clearLastSelectedRide());
  };


  const handleRaiseFare = async () => {
    console.log("handdle ride fare", ride.rideReq)
    setLoading(true);
    try {
      console.log("handdle ride fare", ride.rideReq.id)
      const data = await raiseFare(ride.rideReq?.id, price);
      console.log('my raised fair data is :', data)
      webSocketService.emitRideRaiseFare({
        rideRequestData: {
          ...data.rideReq,

        },
        latitude: fromCoords?.lat ?? 0,
        longitude: fromCoords?.lng ?? 0,
        radiusKm: 500,
      });


      Alert.alert('Success', data.message || 'Fare raised successfully!');
      setFareRaised(false);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animate the progress bar
  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowFinding(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (timer !== 0) {
      setFallback(true);
    } else {
      setFallback(false);
      handleCancelRide();
      router.push('/(ride)/customer-ride');
    }
  }, [timer]);

  return (
    <View className="rounded-t-3xl px-5 py-6 pt-10 overflow-hidden">
      {/* Background gradient */}
      <LinearGradient
        colors={['#DBD6FB', '#FEFEFF']}
        locations={[0, 0.4]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBackground}
      />

      {/* Step 1: Finding driver */}
      {showFinding ? (
        <>
          <Text className="text-center text-lg font-semibold text-black mb-3 mx-10">Finding a driver near you...</Text>

          <View className="h-[2px] w-full bg-gray-200 overflow-hidden mb-5">
            <Animated.View style={{ transform: [{ translateX }] }} className="h-[2px] w-1/3 bg-green-500 rounded-full" />
          </View>

          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={handleDecrease} className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
              <Text className="text-gray-500 font-semibold">-0.5</Text>
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-[#006D5B]">
              {currency?.code} {price.toFixed(2)}
            </Text>

            <TouchableOpacity onPress={handleIncrease} className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center">
              <Text className="text-blue-600 font-semibold">+0.5</Text>
            </TouchableOpacity>
          </View>
          <Pressable
            disabled={!fareRaised || loading} // disable while loading
            onPress={handleRaiseFare}
            className={`rounded-full py-4 mb-4 border flex-row justify-center items-center ${fareRaised ? 'border-gray-400' : 'border-gray-200 bg-gray-50 opacity-50'
              }`}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#4B5563" /> // or any color you want
            ) : (
              <Text
                className={`text-center font-semibold ${fareRaised ? 'text-gray-700' : 'text-gray-400'
                  }`}
              >
                Raise Fare
              </Text>
            )}
          </Pressable>
          <Pressable className="bg-gray-100 rounded-full py-4 mb-2">
            <Text className="text-center text-gray-500 font-semibold">Cancel ride</Text>
          </Pressable>
        </>
      ) : (
        /* Step 2: Accept offer countdown */
        <View className="items-center p-4 pt-2">
          <Text className="text-gray-600 text-base mb-3">
            Accept an offer from a driver
            <Text className="font-bold">{`0:${timer < 10 ? '0' : ''}${timer}`}</Text>
          </Text>
          <TouchableOpacity className="bg-gray-100 w-full rounded-full py-4" onPress={handleCancelRide}>
            <Text className="text-center font-semibold">Cancel ride</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default FindingDriver;
