import { ActivityIndicator, Alert, Image, Platform, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomerMap from '@/screens/Rider/component/CustomerMap';
import { HeaderIcon } from '@/components/common/AnimatedHeader/components';
import { router, useNavigation } from 'expo-router';
import { useGoBackIcon } from '@/components/common/AnimatedHeader/hooks';
import ExtandableBottomSheet from '@/screens/Rider/component/ExtandableBottomSheet';
import { CustomText } from '@/components';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';
import FindingDriver from '@/screens/Rider/component/FindingDriver';
import AcceptingRide from '@/screens/Rider/component/RideAccepted/AcceptingRide';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { createRide } from '@/screens/Rider/utils/requestRide';
import LocationSearchModal from '@/screens/Rider/component/LocationSearchModel';
import { setRide, setSliceFindingRide } from '@/redux/slices/RideSlices/rideCreationSlice';
import { useDispatch } from 'react-redux';
import OfferYourFare from '@/screens/Rider/component/OfferYourFare';
import AddStopLocationModal from '@/screens/Rider/component/AddStopLocationModal';
import PaymentBottomModal from '@/screens/Rider/component/PaymentBottomModal';
import ScheduleRideModal from '@/screens/Rider/utils/ScheduleRideModal';
import dayjs from 'dayjs';
import { Sidebar } from '@/components/common/SiderBar/Siderbar';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { webSocketService } from '@/services/websocketService';
import { useAppConfig } from '@/hooks/useAppConfig';
import { useZoneCheck } from '@/hooks/rideHooks/useZoneCheck';
import { rideRequestsService } from '@/screens/Rider/utils/rideRequestService';

type Stop = {
  lat: number;
  lng: number;
  address: string;
  order: number;
};

const CustomerRide = ({ rideDataExist }: any) => {

  console.log("rideDataExist", rideDataExist);
  const goBackIcon = useGoBackIcon();
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [rideConfirmation, setRideConfirmation] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(rideDataExist);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [myRideDataExist, setMyRideDataExist] = useState<any>();
  const [fareCheck, setFareCheck] = useState(false);
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [showStopModal, setShowStopModal] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [findingRide, setFindingRide] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const newFromLocation = useSelector((state: RootState) => state.rideLocation.fromLocation);
  const newToLocation = useSelector((state: RootState) => state.rideLocation.toLocation);
  const rideDuration = useSelector((state: RootState) => state.rideCreation.rideDuration);
  const rideDistance = useSelector((state: RootState) => state.rideCreation.rideKm);
  const [stopLocation, setStopLocation] = useState('');
  const [showMyStop, setShowMyStop] = useState(false);
  const [stopCoords, setStopCoords] = useState<{ lat: string; lng: string } | null>(null);
  const [calendarModalVisible, setcalendarModalVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const { data, error } = useZoneCheck(33.6844, 73.0479);
  const activeRide = useSelector((state: RootState) => state.activeRide.onGoingActiveRideData);


  console.log("my zonedaata:", data)
  console.log("my zonedaata error:", error)

  const selectedRide = useSelector((state: RootState) => state.rideSelection.selectedRide);
  const fromCoords = useSelector((state: RootState) => state.rideLocation.fromCoords);
  const toCoords = useSelector((state: RootState) => state.rideLocation.toCoords);

  const rideSchedule = useSelector((state: RootState) => state.rideCreation.scheduleRide);

  const hourlyRide = useSelector((state: RootState) => state.rideCreation.hourlyRide);
  console.log('hourlyRide', hourlyRide);
  const scheduleTime = useSelector((state: RootState) => state.rideCreation.scheduleRideTime);

  const dateObj = scheduleTime ? new Date(scheduleTime) : null;

  const myRideFare = useSelector((state: RootState) => state.rideCreation.myRideFare);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const familyRide = useSelector((state: RootState) => state.rideCreation.familyRide);
  const { } = useAppConfig();

  const showDatePicker = () => {
    setcalendarModalVisible(true);
  };

  const hideDatePicker = () => {
    setcalendarModalVisible(false);
  };

  useEffect(() => {
    if (hourlyRide && newFromLocation && newToLocation) {
      setOfferModalVisible(true);
    }
  }, [hourlyRide, newFromLocation, newToLocation]);

  useEffect(() => {
    console.log('ride accepted', rideAccepted);
  }, [rideAccepted]);

  const handleRideAccept = async () => {
    try {
      setLoading(true);

      const data = {
        pickup: { lat: Number(fromCoords?.lat), lng: Number(fromCoords?.lng) },
        dropoff: { lat: Number(toCoords?.lat), lng: Number(toCoords?.lng) },
        ride_type_id: String(selectedRide?.ride_type_id),
        fare: selectedRide?.fare,
        payment_via: 'CASH',
        is_hourly: hourlyRide,
        stops: [] as Stop[],
        pickup_address: fromLocation,
        pickup_location: fromLocation,
        dropoff_location: toLocation,
        destination_address: toLocation,
        is_scheduled: rideSchedule,
        is_family: familyRide,
        estimated_time: rideDuration,
        estimated_distance: rideDistance,
        offered_fair: parseFloat(Number(myRideFare).toFixed(2)),
        ...(dateObj && rideSchedule && { scheduled_at: dateObj.toISOString() }),
      };
      console.log('🚀 ~ handleRideAccept ~ data:', data);

      if (stopCoords) {
        data.stops.push({
          lat: Number(stopCoords.lat),
          lng: Number(stopCoords.lng),
          address: 'Stop 1',
          order: 1,
        });
      }

      const response = await createRide(data);
      webSocketService.emitRideRequest({
        rideRequestData: data,
        latitude: fromCoords?.lat,
        longitude: fromCoords?.lng,
        radiusKm: 100,
      });

      setLoading(false);

      console.log('Ride created:', response);
      dispatch(setRide(response));
      dispatch(setSliceFindingRide(true));

      setRideConfirmation(false);
      setFindingRide(true);
      setStopLocation('');
      setStopCoords(null);
    } catch (err: any) {
      console.error('❌ Ride creation failed:', err.response);

      const errorMessage =
        err?.response?.data?.message?.[0] || err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';

      Alert.alert('Ride Creation Failed', errorMessage);

      setLoading(false);
      setStopLocation('');
    }
  };

  useEffect(() => {
    console.log(' i am setting offer modal');
    if (hourlyRide && newFromLocation && newToLocation) {
      console.log('modal set');

      setOfferModalVisible(true);
    }
  }, [hourlyRide, newFromLocation, newToLocation]);



  useEffect(() => {


    if (!rideDataExist) {
      return;
    }

    const fetchActiveRide = async () => {
      const activeRide = await rideRequestsService.getActiveRide();
      console.log("🚗 Current active ride:", activeRide);

      // Handle both possible response structures
      if (activeRide?.isActiveRide === false) {
        setMyRideDataExist(false);
      } else if (activeRide && !activeRide?.isActiveRide) {
        // Means the key is missing but ride data exists
        setMyRideDataExist(true);
      } else {
        setMyRideDataExist(!!activeRide);
      }

    };

    fetchActiveRide();
  }, [rideDataExist]);

  return (
    <View className="flex-1 bg-white relative">
      <CustomerMap stopCoords={stopCoords} rideAccepted={rideAccepted} myRideDataExist={myRideDataExist} rideDataExist={rideDataExist} findingRide={false} />

      {error && !rideConfirmation && (
        <View
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: [{ translateX: -150 }, { translateY: -30 }],
            width: 300,
            backgroundColor: "rgba(255, 0, 0, 0.85)",
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 18,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 6, // Android shadow
            zIndex: 9999,
          }}
        >
          <CustomText
            style={{
              color: "white",
              textAlign: "center",
            }}

            fontWeight='bold'
            fontSize='md'
          >
            {error}
          </CustomText>
        </View>


      )

      }

      {rideConfirmation ? (
        <>
          <View
            style={{
              position: 'absolute',
              top: insets.top + 10,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <View className="w-4/5 bg-white rounded-2xl p-4 shadow-md">
              <TouchableOpacity className="flex-row items-center gap-2 mb-5" onPress={() => setModalVisible(true)}>
                <Image source={require('@/assets/images/toIcon.png')} className="w-5 h-5" resizeMode="contain" />
                <CustomText numberOfLines={2} fontSize="sm" className="text-gray-500 text-sm w-64">
                  {fromLocation}
                </CustomText>
              </TouchableOpacity>

              {stopLocation ? (
                <TouchableOpacity className="flex-row items-center gap-2 mb-2" onPress={() => setShowMyStop(true)}>
                  <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5" resizeMode="contain" />

                  <CustomText fontSize="sm" className="text-gray-500 text-sm w-64">
                    2 Stops
                  </CustomText>

                  <Entypo name="plus" size={20} color="black" className="right-4" />
                </TouchableOpacity>
              ) : (
                <View className="flex flex-row items-center gap-2 mb-2 ">
                  <TouchableOpacity className="flex-row items-center gap-2" onPress={() => setModalVisible(true)}>
                    <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5" resizeMode="contain" />

                    <CustomText numberOfLines={2} fontSize="sm" className="text-gray-500 text-sm w-64">
                      {toLocation}
                    </CustomText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowStopModal(true)}>
                    <Entypo name="plus" size={20} color="black" className="right-4" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <>
          {!activeRide && (
            <View
              style={{
                position: 'absolute',
                top: insets.top + 10,
                left: 15,
              }}
            >
              <HeaderIcon onPress={() => router.back()} iconName={goBackIcon} iconType="Ionicons" />
            </View>
          )

          }

          <TouchableOpacity
            className="bg-white border border-[#E4E4E7] w-10 h-10 rounded-full items-center justify-center"
            style={{
              position: 'absolute',
              top: insets.top + 12,
              right: 15,
            }}
            onPress={() => setDrawerOpen(true)}
          >
            <Octicons name="three-bars" size={20} color="black" />
          </TouchableOpacity>
        </>
      )}

      {fallback && !rideAccepted && (
        <View className="absolute w-full top-10 h-full">
          <AcceptingRide setRideAccepted={setRideAccepted} />
        </View>
      )}

      {!findingRide || rideAccepted ? (
        <ExtandableBottomSheet
          rideConfirmation={rideConfirmation}
          setRideConfirmation={setRideConfirmation}
          rideAccepted={rideAccepted}
          setRideAccepted={setRideAccepted}
          rideCompleted={rideCompleted}
          setRideCompleted={setRideCompleted}
          setFindingRide={setFindingRide}
          setFallback={setFallback}
          setFromLocation={setFromLocation}
          setToLocation={setToLocation}
          fromLocation={fromLocation}
          toLocation={toLocation}
        />
      ) : (
        <>
          {!rideAccepted && findingRide && (
            <FindingDriver fallback={fallback} setFallback={setFallback} setRideConfirmation={setRideConfirmation} setFindingRide={setFindingRide} />
          )}
        </>
      )}

      {rideConfirmation && (
        <>
          <View
            className="absolute bg-white bottom-0 w-full space-y-3"
            style={{ paddingBottom: Platform.OS == 'ios' ? insets.bottom : insets.bottom + 10 }}
          >
            {/* Cash Button */}

            <View className="border-t-2 border-gray-200">
              {rideSchedule && (
                <TouchableOpacity className="py-3 px-5 flex-row justify-between items-center" onPress={() => setcalendarModalVisible(true)}>
                  <View className="flex-row gap-2 items-center">
                    <MaterialCommunityIcons name="calendar-clock-outline" size={24} color="black" />

                    {dateObj ? <CustomText>{dayjs(dateObj).format('ddd, MMM D. hh:mm A')}</CustomText> : <CustomText>Schedule ride</CustomText>}
                  </View>

                  <Entypo name="chevron-small-right" size={24} color="#71717A" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="py-3 px-5 flex-row justify-between items-center"
                onPress={() => {
                  setPaymentVisible(true);
                }}
              >
                <View className="flex-row gap-2 items-center">
                  <Image source={require('../../assets/images/cash.png')} className="w-10 h-10" resizeMode="contain" />

                  <CustomText fontSize="sm">Cash</CustomText>
                </View>

                <Entypo name="chevron-small-right" size={24} color="#71717A" />
              </TouchableOpacity>
            </View>

            <View className="px-5">
              <TouchableOpacity
                className="bg-[#3853A4] rounded-full py-4 items-center"
                onPress={handleRideAccept}
                disabled={!selectedRide}
                style={{ opacity: selectedRide ? 1 : 0.5 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <CustomText lightColor="white" fontWeight="medium" className="text-white text-base font-semibold">
                    Find a ride
                  </CustomText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <LocationSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        fromLocation={fromLocation}
        toLocation={toLocation}
        setFromLocation={setFromLocation}
        setToLocation={setToLocation}
        setRideConfirmation={setRideConfirmation}
      />

      <OfferYourFare visible={offerModalVisible} onClose={() => setOfferModalVisible(false)} fareCheck={fareCheck} />

      <AddStopLocationModal
        visible={showStopModal}
        onClose={() => setShowStopModal(false)}
        setStopLocation={setStopLocation}
        setStopCoords={setStopCoords}
      />
      <ScheduleRideModal
        visible={calendarModalVisible}
        onClose={() => setcalendarModalVisible(false)}
        onConfirm={(date) => {
          console.log('Selected:', date);
        }}
      />

      <Sidebar visible={drawerOpen} onClose={() => setDrawerOpen(false)} activeBar="lumiDrive" />

      <PaymentBottomModal visible={showMyStop} onClose={() => setShowMyStop(false)} title="Destination Addresses">
        <View className="flex-row items-center gap-2 mb-2">
          <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5" resizeMode="contain" />

          <CustomText fontSize="sm" className="text-gray-500 text-sm w-72 ">
            {toLocation}
          </CustomText>

          <AntDesign name="close" size={20} color="black" />
        </View>
        <View className="flex-row items-center gap-2 mb-2">
          <Image source={require('@/assets/images/fromIcon.png')} className="w-5 h-5" resizeMode="contain" />

          <CustomText fontSize="sm" className="text-gray-500 text-sm w-72">
            {stopLocation}
          </CustomText>

          <AntDesign name="close" size={20} color="black" />
        </View>
      </PaymentBottomModal>

      {/* Payment Modal */}
      <PaymentBottomModal visible={paymentVisible} onClose={() => setPaymentVisible(false)} title="Choose Payment Method">
        <TouchableOpacity className="bg-[#FAFAFA] py-4 p-2 flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Image source={require('@/assets/images/cash.png')} className="w-8 h-8" resizeMode="contain" />
            <CustomText fontSize="sm" fontWeight="bold">
              Cash
            </CustomText>
          </View>
          <Feather name="check" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className=" py-4 p-2 flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <FontAwesome name="credit-card" size={24} color="black" />
            <CustomText fontSize="sm">Card</CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="py-4 p-2 flex-row items-center gap-2">
          <AntDesign name="plus" size={24} color="black" />
          <CustomText fontSize="sm" fontWeight="medium">
            Add Payment Methods
          </CustomText>
        </TouchableOpacity>
      </PaymentBottomModal>
    </View>
  );
};

export default CustomerRide;
