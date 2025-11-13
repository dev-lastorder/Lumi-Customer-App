import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import GradientBackground from '@/components/common/GradientBackground/GradientBackground';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { CustomText } from '@/components';
import { Octicons, Entypo } from '@expo/vector-icons';
import { Sidebar } from '@/components/common/SiderBar/Siderbar';
import { router } from 'expo-router';

// Import our new hook
import { useGetReservations } from '@/hooks/reservation/useReservation';
import { BackendRide } from '@/services/api/types/reservationTypes';

export default function RideReservation() {
  const inset = useSafeAreaInsets();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Use our hook to get reservations
  const { data: reservations = [], isLoading, error, refetch } = useGetReservations({ offset: 0 });

  // Render individual reservation item
  const renderReservationItem = ({ item }: { item: BackendRide }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.navigate({ pathname: '/ride-reservation-detail', params: { reservation: JSON.stringify(item) } });
        }}
        className="flex-row items-center justify-between mb-5"
      >
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mr-3">
            <Image source={require('@/assets/images/bookRide.png')} className="w-12 h-12" resizeMode="contain" />
          </View>
          <View>
            <Text className="text-base font-semibold text-black">{item.is_hourly ? 'Hourly Ride' : 'Ride'}</Text>
            <Text className="text-xs text-gray-500">
              {item.scheduledAt
                ? new Date(item.scheduledAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                : new Date(item.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <View className="mt-1">
              <Text className={`text-xs px-2 py-1 rounded-md font-medium ${getStatusStyle(item.status)}`}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View className="items-end flex-row gap-2">
          <Text className="text-base font-semibold text-black">{item.agreed_price}</Text>
          <Entypo name="chevron-thin-right" size={20} color="black" />
        </View>
      </TouchableOpacity>
    );
  };

  // Helper function for status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled by you':
      case 'Cancelled by driver':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <GradientBackground>
      <>
        <TouchableOpacity
          className="bg-white border border-[#E4E4E7] w-10 h-10 rounded-full items-center justify-center"
          style={{
            position: drawerOpen ? 'relative' : 'absolute',
            top: inset.top,
            left: 15,
            zIndex: drawerOpen ? 0 : 50,
            elevation: drawerOpen ? 0 : 10,
          }}
          onPress={() => setDrawerOpen(true)}
        >
          <Octicons name="three-bars" size={20} color="black" />
        </TouchableOpacity>

        <View className="px-4 py-4" style={{ paddingTop: Platform.OS === 'ios' ? inset.top + 5 : inset.top + 10 }}>
          <CustomText fontSize="lg" fontWeight="semibold" className="text-center mb-5">
            Reservation
          </CustomText>

          {/* Loading State */}
          {isLoading && (
            <View style={{ height: 400 }} className="justify-center items-center">
              <ActivityIndicator size="large" />
              <CustomText className="mt-2 text-gray-600">loading...</CustomText>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View className="flex-1 justify-center items-center">
              <CustomText className="text-red-500 mb-4">Failed to load reservations</CustomText>
              <TouchableOpacity onPress={() => refetch()} className="bg-blue-500 px-4 py-2 rounded">
                <CustomText className="text-white">Try Again</CustomText>
              </TouchableOpacity>
            </View>
          )}

          {/* Success State */}
          {!isLoading && !error && (
            <>
              {reservations.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                  <CustomText>No reservations found</CustomText>
                </View>
              ) : (
                <FlatList
                  data={reservations}
                  keyExtractor={(item) => item.id}
                  renderItem={renderReservationItem}
                  onRefresh={refetch}
                  refreshing={isLoading}
                />
              )}
            </>
          )}
        </View>

        <Sidebar visible={drawerOpen} onClose={() => setDrawerOpen(false)} activeBar="reservation" />
      </>
    </GradientBackground>
  );
}
