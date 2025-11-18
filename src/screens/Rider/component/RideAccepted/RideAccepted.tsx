import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Alert, Share, Platform } from 'react-native';
import { FontAwesome, Feather, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomText } from '@/components';
import FromSvg from '@/assets/svg/fromSvg';
import ToSvg from '@/assets/svg/toSvg';
import { useDispatch } from 'react-redux';
import { clearLastSelectedRide } from '@/redux/slices/RideSlices/rideSelectionSlice';
import { resetLocations } from '@/redux/slices/RideSlices/rideLocationSlice';
import { clearRide, resetHourlyRide } from '@/redux/slices/RideSlices/rideCreationSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import RideChatIndex from '../RideChat/RideIndex';
import RideSafetyIndex from '../RideSafety/RideSafetyIndex';
import PaymentBottomModal from '../PaymentBottomModal';
import DriverRating from '../DriverRating/DriverRating';
import { getEmergencyContact } from '../../utils/getEmergencyContact';
import { rideRequestsService } from '../../utils/rideRequestService';
import DriverCallModal from './DriverCallModal';
import { webSocketService } from '@/services/websocketService';

interface Props {
  setRideAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  setRideCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setRideConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setFindingRide: React.Dispatch<React.SetStateAction<boolean>>;
  setFallback: React.Dispatch<React.SetStateAction<boolean>>;
}

const RideAccepted: React.FC<Props> = ({ setRideAccepted, setRideCompleted, setRideConfirmation, setFindingRide, setFallback }) => {
  const dispatch = useDispatch();

  const fromLocation = useSelector((state: RootState) => state.rideLocation.fromLocation);
  const toLocation = useSelector((state: RootState) => state.rideLocation.toLocation);
  const [chatVisible, setChatVisible] = useState(false);
  const [callVisible, setCallVisible] = useState(false);
  const [safetyVisible, setSafetyVisible] = useState(false);
  const myRideFare = useSelector((state: RootState) => state.rideCreation.myRideFare);
  const [cancelRide, setCancelRide] = useState(false);
  const [rideData, setRideData] = useState<any>();
  const [showDriverRating, setShowDriverRating] = useState(false);
  const { currency, emergencyContact } = useSelector((state: RootState) => state.appConfig);

  const handleCancel = () => {
    dispatch(clearLastSelectedRide());
    dispatch(resetLocations());
    dispatch(clearRide());
    setRideAccepted(false);
    setRideCompleted(false);
    setRideConfirmation(false);
    setFindingRide(false);
    setFallback(false);
    dispatch(resetHourlyRide());
  };

  const handleCancelRide = async (rideId: string, rideData: any) => {

    console.log("rideData in ride accepted cancel", rideData);
    webSocketService.rideCancel({
      rideId: rideId,
      genericUserId: rideData?.driver?.user?.id,
    })
    const result = await rideRequestsService.cancelRide(rideId);

 
    if (result?.success === false) {
      Alert.alert("Error", result.error.message || "Could not cancel ride.");
    } else {
      Alert.alert("Success", "Ride canceled successfully.");
      handleCancel();
      setCancelRide(false)
    }

  }


  const handleShare = async () => {
    try {
      const latitude = 25.276987;
      const longitude = 55.296249;

      const rideLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      await Share.share({
        message: `🚖 I'm on a ride! Track me live: ${rideLink}`,
      });
    } catch (error) {
      console.log('Error sharing ride:', error);
    }
  };

  const handleEmergencyCall = async () => {
    try {
      console.log('🚨 handleEmergencyCall triggered');

      if (emergencyContact) {
        console.log('emergency tel:', emergencyContact);
        const cleanNumber = emergencyContact.replace(/[^+\d]/g, '');
        const telURL = `tel:${cleanNumber}`;
        const supported = await Linking.canOpenURL(telURL);
        console.log(supported, telURL);

        if (!supported) {
          Alert.alert('Unsupported', 'This device does not support phone calls.');
          return;
        }

        await Linking.openURL(telURL);
      } else {
        Alert.alert('Error', 'Emergency contact not found.');
      }
    } catch (error) {
      console.error('🚨 handleEmergencyCall error:', error);
      Alert.alert('Error', 'Something went wrong while trying to make the emergency call.');
    }
  };

  const locations = [
    {
      address: '88 Zurab Gorgiladze St',
      city: 'Georgia, Batumi',
      selected: false,
    },
    {
      address: '5 Noe Zhordania St',
      city: 'Georgia, Batumi',
      selected: true,
    },
  ];

  useEffect(() => {
    const fetchActiveRide = async () => {
      const activeRide = await rideRequestsService.getActiveRide();
      console.log("🚗 Current active ride:", activeRide);
      setRideData(activeRide);
    };

    fetchActiveRide();
  }, []);


  console.log("hellofghfeuogheiufheri", rideData);

  return (
    <View className="flex-1 p-4 relative">
      <View className="flex-row items-center justify-between">
        <View className="items-center">
          <Image source={require('@/assets/images/bookRide.png')} className="w-32 h-20" resizeMode="contain" />
        </View>

        <View className="items-end">

          {rideData?.ride_status === "IN_PROGRESS" ? (
            <CustomText fontWeight="semibold" lightColor="#3853A4">

              Drop Off
            </CustomText>
          ) : (
            <CustomText fontWeight="semibold" lightColor="#3853A4">
              Arriving in 4 mins
            </CustomText>
          )
          }
        </View>
      </View>

      <View className="flex-row items-center justify-between mb-5">
        <CustomText fontSize="sm" lightColor="#71717A" className="mt-1">
          {rideData?.vehicle?.model || 'Honda City'}
        </CustomText>

        <CustomText fontSize="sm" fontWeight="semibold" className="mt-1">
          {rideData?.vehicle?.plate_number || 'ABC-1234'}
        </CustomText>
      </View>

      <View className="border-b border-gray-100 mb-4" />

      <TouchableOpacity className="flex-row items-center justify-between mb-4" onPress={() => setShowDriverRating(true)}>
        <View className="flex-row items-center">
          <Image source={{ uri: rideData?.driver?.user?.profile || rideData?.user?.profile || 'https://i.pravatar.cc/100?img=3' }} className="w-12 h-12 rounded-full" />
          <View className="ml-3">
            <CustomText className="text-base font-medium">{rideData?.driver?.user?.name}</CustomText>
            <View className="flex-row items-center mt-1">
              <FontAwesome name="star" size={14} color="#3853A4" />
              <Text className="ml-1 text-sm text-gray-700">{rideData?.averageRating}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity className="items-center bg-[#F4F4F5] rounded-full p-3" onPress={() => setChatVisible(true)}>
            <Ionicons name="call" size={22} color="#3853A4" />
          </TouchableOpacity>
          <TouchableOpacity className="items-center bg-[#F4F4F5] rounded-full p-3" onPress={() => setSafetyVisible(true)}>
            <AntDesign name="Safety" size={22} color="#3853A4" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <View className="border-b border-gray-200 mb-4" />

      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity className="bg-[#3853A4] rounded-full px-4 py-1">
            <Text className="text-white text-sm font-medium">Payment</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Image source={require('@/assets/images/cash.png')} className="w-10 h-10 ml-5" resizeMode="contain" />

            <CustomText fontWeight="semibold" className="ml-4">
              {currency?.code} {rideData?.agreed_price || myRideFare}
            </CustomText>
            <CustomText lightColor="#71717A" fontSize="xs" className="ml-1">
              Cash
            </CustomText>
          </View>
        </View>
      </View>
      <View className="border-b border-gray-200 mb-4" />

      <View className="mb-8">
        {/* Wrapper with relative positioning */}
        <View className="relative ml-2">
          {/* Vertical line */}
          <View className="absolute top-5 bottom-0 h-20 left-2 w-[2px] bg-gray-300" />

          {/* Start location */}
          <View className="flex-row items-center gap-4">
            <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5 bg-white" resizeMode="contain" />
            <View className="pt-2 w-80">
              <CustomText numberOfLines={2} fontSize="sm">
                {rideData?.pickup_location || fromLocation}
              </CustomText>
            </View>
          </View>

          {/* End location */}
          <View className="flex-row items-center gap-4 mt-5 w-80">
            <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5 bg-white" resizeMode="contain" />
            <View>
              <CustomText numberOfLines={2} fontSize="sm">
                {rideData?.dropoff_location || toLocation}
              </CustomText>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity className="flex-row justify-between items-center py-3" onPress={handleShare}>
        <View className="flex-row items-center gap-2">
          <Ionicons name="share-outline" size={22} color="black" />
          <Text className="text-sm">Share my ride</Text>
        </View>
        <Feather name="chevron-right" size={20} color="black" />
      </TouchableOpacity>

      <TouchableOpacity className="flex-row justify-between items-center py-3">
        <TouchableOpacity className="flex-row items-center gap-2" onPress={handleEmergencyCall}>
          <MaterialCommunityIcons name="alarm-light-outline" size={22} color="#DC2626" />
          <Text className="text-sm text-[#DC2626]">Call emergency</Text>
        </TouchableOpacity>
        <Feather name="chevron-right" size={20} color="#DC2626" />
      </TouchableOpacity>

      <View className="mt-auto">
        <TouchableOpacity className="border border-[#DC2626] rounded-full py-4 items-center mt-6" onPress={() => handleCancelRide(rideData?.ride_id, rideData)}>
          <Text className="text-[#DC2626] text-base font-semibold">Cancel the ride</Text>
        </TouchableOpacity>
      </View>

      <DriverRating visible={showDriverRating} onClose={() => setShowDriverRating(false)} />

      <RideSafetyIndex visible={safetyVisible} onClose={() => setSafetyVisible(false)} rideData={rideData} />



      <RideChatIndex
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        onStartCall={() => {
          setChatVisible(false);
          setCallVisible(true);
        }}
        driverId={rideData?.driver?.user?.id || ""}
        driverName={rideData?.driver?.user?.name || "John Doe"}
        driverAvatar={rideData?.driver?.user?.profile || "https://i.pravatar.cc/100?img=3"}
      />

      <DriverCallModal
        visible={callVisible}
        onClose={() => setCallVisible(false)}
        onBack={() => {
          setCallVisible(false);
          setChatVisible(true);
        }}
        driverName="Aleksandr V."
        driverAvatar="https://i.pravatar.cc/100?img=3"
      />

      <PaymentBottomModal visible={cancelRide} onClose={() => setCancelRide(false)} title="Are you sure?">
        <TouchableOpacity className="bg-red-500 flex rounded-full py-3 mb-2" onPress={() => handleCancelRide(rideData?.ride_id, rideData)}>
          <CustomText lightColor="white" className="text-center">
            Yes, cancel the ride
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity className=" flex rounded-full bg-[#F4F4F5] py-3" onPress={() => setCancelRide(false)}>
          <CustomText className="text-center">No, Continue the ride</CustomText>
        </TouchableOpacity>
      </PaymentBottomModal>
    </View>
  );
};

export default RideAccepted;