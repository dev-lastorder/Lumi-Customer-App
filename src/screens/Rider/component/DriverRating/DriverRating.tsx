import React from 'react';
import { View, Image, ScrollView, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomIcon, CustomText } from '@/components';
import { HeaderIcon } from '@/components/common/AnimatedHeader/components';
import { useGoBackIcon } from '@/components/common/AnimatedHeader/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import adjust from '@/utils/helpers/adjust';
import { RatingDistribution } from './RatingDistribution';
import ReviewCard from './ReviewCard';

interface RideSafetyIndexProps {
  visible: boolean;
  onClose: () => void;
  rideData: any;
}

const DriverRating: React.FC<RideSafetyIndexProps> = ({ visible, onClose, rideData }) => {
  const goBackIcon = useGoBackIcon();
  const insets = useSafeAreaInsets();


  const getJoinedTime = (createdAt: string | number | Date) => {
    if (!createdAt) return '';

    const joinDate = new Date(createdAt);
    const now = new Date();

    const yearsDiff = now.getFullYear() - joinDate.getFullYear();
    const monthsDiff = now.getMonth() - joinDate.getMonth();
    const daysDiff = now.getDate() - joinDate.getDate();

    let totalMonths = yearsDiff * 12 + monthsDiff;
    if (daysDiff < 0) totalMonths -= 1; // adjust if current day is before join day

    if (totalMonths < 1) return '1 Month ago';
    if (totalMonths < 12) return `${totalMonths} month${totalMonths > 1 ? 's' : ''} ago`;

    const years = Math.floor(totalMonths / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };


  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl h-[100%] overflow-hidden">
          <LinearGradient
            colors={['#DBD6FB', '#FEFEFF']}
            locations={[0, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView className="flex-1">
            <View
              style={{
                position: 'absolute',
                top: insets.top + 10,
                left: 15,
                zIndex: 999
              }}
            >
              <HeaderIcon iconName={goBackIcon} iconType="Ionicons" onPress={onClose} />
            </View>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 40, paddingTop: insets.top + 20 }}
              className="px-5"
              showsVerticalScrollIndicator={false}
            >
              {/* Rider info */}
              <View className="flex items-center">
                <Image source={{ uri: rideData?.driver?.user?.profile || rideData?.user?.profile || 'https://i.pravatar.cc/100?img=3' }} className="w-[108] h-[108] rounded-full" />
                <CustomText fontSize="lg" fontWeight="semibold" className="mt-4">
                  {rideData?.driver?.user?.name}
                </CustomText>
              </View>

              {/* Rider history */}
              <View className="border-t border-gray-200 mt-4 mb-4" />
              <View className="flex-row items-center gap-10 justify-between">
                <View className="flex items-center">
                  <CustomText fontSize="md" fontWeight="semibold">
                    {rideData?.driver?.dynamic_info?.riderTotalRides || 0}
                  </CustomText>
                  <CustomText fontSize="sm">Rides</CustomText>
                </View>

                <View className="flex items-center">
                  <CustomText fontSize="md" fontWeight="semibold">
                    {getJoinedTime(rideData?.driver?.user?.createdAt)}

                  </CustomText>
                  <CustomText fontSize="sm">Joined us</CustomText>
                </View>

                <View className="flex items-center">
                  <View className="flex-row items-center gap-1">
                    <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(18), color: '#FBC02D' }} />
                    <CustomText fontSize="md" fontWeight="semibold">
                      {rideData?.driver?.dynamic_info?.averageRating || 0}
                    </CustomText>
                  </View>
                  <CustomText fontSize="sm">Rating</CustomText>
                </View>
              </View>
              <View className="border-t border-gray-200 mt-4 mb-4" />

              {/* Reviews */}
              {rideData?.driver?.dynamic_info?.averageRating < 0 && (
                <>
                  {/* <View>
                    <CustomText fontSize="lg" fontWeight="semibold">
                      Top reviews
                    </CustomText>
                  </View>

                  <View className="flex-row items-center mt-4 mb-4 gap-2">
                    <CustomText fontSize="lg" fontWeight="semibold" className="mt-2">
                      4.89
                    </CustomText>
                    <View className="flex-row items-center gap-2">
                      <View className="bg-[#FBC02D] rounded-md p-2">
                        <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(12), color: 'white' }} />
                      </View>
                      <View className="bg-[#FBC02D] rounded-md p-2">
                        <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(12), color: 'white' }} />
                      </View>
                      <View className="bg-[#FBC02D] rounded-md p-2">
                        <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(12), color: 'white' }} />
                      </View>
                      <View className="bg-[#FBC02D] rounded-md p-2">
                        <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(12), color: 'white' }} />
                      </View>

                      <View className="relative rounded-md overflow-hidden">
                     
                        <View className="absolute right-0 top-0 h-full w-1/2 bg-gray-200" />

                        <View className="absolute left-0 top-0 h-full w-1/2 bg-[#FBC02D]" />

                        <View className="p-2 items-center justify-center">
                          <CustomIcon icon={{ type: 'AntDesign', name: 'star', size: adjust(12), color: 'white' }} />
                        </View>
                      </View>
                    </View>
                  </View>

                  <CustomText fontSize="lg" fontWeight="medium" className="mt-2 mb-2">
                    Based on 84 Reviews
                  </CustomText>

                  <RatingDistribution
                    ratings={[
                      { star: 5, count: 44 },
                      { star: 4, count: 8 },
                      { star: 3, count: 22 },
                      { star: 2, count: 7 },
                      { star: 1, count: 1 },
                    ]}
                  />

                  <ReviewCard />
                  <ReviewCard />
                  <ReviewCard />
                  <ReviewCard /> */}
                </>
              )

              }
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default DriverRating;
