import { View, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import { CustomText } from '@/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderIcon } from '@/components/common/AnimatedHeader/components';
import { useGoBackIcon } from '@/components/common/AnimatedHeader/hooks';
import { goBack } from 'expo-router/build/global-state/routing';
import PaymentBottomModal from '../PaymentBottomModal';
import RideDetailsCard from './RideDetailsCard';
import DriverDetailsCard from './DriverDetailsCard';
import SchedualDetailsCard from './SchedualDetailsCard';
import PaymentDetailsCard from './PaymentDetailsCard';
import RideRoutesDetailsCard from './RideRoutesDetailsCard';
import RideStatusDetailsCard from './RideStatusDetailsCard';
import InstructionDetailsCard from './InstructionDetailsCard';
import { useLocalSearchParams } from 'expo-router';
import { useCancelReservation } from '@/hooks/reservation/useReservation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

const OrderDetail = () => {
  const { reservation } = useLocalSearchParams<{ reservation: string }>();
  const ride = JSON.parse(reservation);

  const inset = useSafeAreaInsets();
  const goBackIcon = useGoBackIcon();
  const [isVisible, setisVisible] = useState(false);

  const { mutate: cancelReservation, isPending: isCanceling } = useCancelReservation();
const { currency } = useSelector((state: RootState) => state.appConfig);
  const handleCancel = () => {
    cancelReservation(ride.id, {
      onSuccess: () => {
        console.log('Reservation cancelled successfully');
        setisVisible(false); // ✅ Close modal only after success
      },
      onError: (error) => {
        console.error('Error canceling reservation:', error);
        setisVisible(false); // ✅ Close modal only after error
      },
    });
  };

  const riderDetailsObj = {
    type: ride.is_hourly ? 'Hourly Ride' : 'Ride',
    price: `${currency?.code} ${ride.agreed_price}`,
    image: require('@/assets/images/bookRide.png'),
  };

  const driverDetailsObj = {
    name: ride.rider?.name ?? 'John Doe',
    image: ride.rider?.profile_image ?? 'https://i.pravatar.cc/100?img=3',
    rating: ride.rider?.rating ?? 4.89,
    numberOfRides: ride.rider?.total_rides ?? 502,
    car: {
      name: ride.rider?.vehicleType ?? 'Toyota Camry',
      plateNumber: ride.rider?.plate_number ?? 'NJ - K47 MPL',
    },
  };

  const schedualDetailsObj = {
    day: new Date(ride.scheduledAt ?? ride.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: new Date(ride.scheduledAt ?? ride.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };

  const paymentDetailsObj = {
    method: ride.payment_via,
  };

  const rideRoutesDetailsObj = {
    startLocation: '1001 Parsippany Boulevard,Troy Hills',
    endLocation: '445 Vreeland Avenue,Troy Hills',
  };

  const rideStatusDetailsObj = {
    status: ride.status,
  };

  return (
    <>
      <GradientBackground>
        <>
          {/* Header */}
          <View
            className="bg-white border border-[#E4E4E7] w-10 h-10 rounded-full items-center justify-center"
            style={{
              position: 'absolute',
              top: inset.top,
              left: 15,
              zIndex: 50,
              elevation: 10,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HeaderIcon iconName={goBackIcon} iconType="Ionicons" onPress={goBack} />
          </View>
          <View className="px-4 py-4" style={{ paddingTop: Platform.OS === 'ios' ? inset.top + 5 : inset.top + 10 }}>
            <CustomText fontSize="lg" fontWeight="semibold" className="text-center mb-5">
              Reservation detail
            </CustomText>
          </View>
          <View
            className="bg-white border border-[#E4E4E7] w-10 h-10 rounded-full items-center justify-center"
            style={{
              position: 'absolute',
              top: inset.top,
              right: 15,
              zIndex: 50,
              elevation: 10,
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HeaderIcon iconName="dots-three-vertical" iconType="Entypo" onPress={() => setisVisible(true)} />
          </View>

          {/*ride details */}
          <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: inset.bottom }} showsVerticalScrollIndicator={false}>
            <RideDetailsCard details={riderDetailsObj} />
            <DriverDetailsCard details={driverDetailsObj} />
            {ride.isScheduled && <SchedualDetailsCard details={schedualDetailsObj} />}
            <PaymentDetailsCard details={paymentDetailsObj} />
            <RideRoutesDetailsCard details={rideRoutesDetailsObj} />
            <RideStatusDetailsCard details={rideStatusDetailsObj} />
            <InstructionDetailsCard />
          </ScrollView>
        </>
      </GradientBackground>
      <PaymentBottomModal visible={isVisible} onClose={() => setisVisible(false)} title="Are you sure?">
        <TouchableOpacity className="bg-red-500 flex rounded-full py-3 mb-2" onPress={handleCancel} disabled={isCanceling}>
          {isCanceling ? (
            <View className="flex-row justify-center items-center">
              <ActivityIndicator size="small" color="white" />
              <CustomText lightColor="white" className="text-center ml-2">
                Canceling...
              </CustomText>
            </View>
          ) : (
            <CustomText lightColor="white" className="text-center">
              Yes, cancel the ride
            </CustomText>
          )}
        </TouchableOpacity>

        <TouchableOpacity className=" flex rounded-full bg-[#F4F4F5] py-3" onPress={() => setisVisible(false)}>
          <CustomText className="text-center">No, Continue the ride</CustomText>
        </TouchableOpacity>
      </PaymentBottomModal>
    </>
  );
};

export default OrderDetail;
