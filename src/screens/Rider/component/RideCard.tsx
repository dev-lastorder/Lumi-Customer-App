import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { Feather, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { CustomText } from '@/components';
import { useDispatch } from 'react-redux';
import { setMyRideFare } from '@/redux/slices/RideSlices/rideCreationSlice';
import OfferYourFare from './OfferYourFare';
import PaymentBottomModal from './PaymentBottomModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

type RideCardProps = {
  name: string;
  fare: number;
  capacity: number;
  recommendedFare?: number;
  imageUrl: string;
};

const RideCard = ({ name, fare, capacity, recommendedFare, imageUrl }: RideCardProps) => {
  // const [newFare, setNewFare] = useState(fare);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);

  const [fareCheck, setFareCheck] = useState(false);
  const { currency } = useSelector((state: RootState) => state.appConfig);
  const dispatch = useDispatch();
  const formatRideName = (name?: string | null): string => {
    if (!name || typeof name !== 'string') {
      return '';
    }
    return name.replace(/_/g, ' ');
  };

   const reduxFare = useSelector((state: RootState) => state.rideCreation.myRideFare);

  // Local fare – based on Redux if available, else fallback to ride fare
  const [newFare, setNewFare] = useState(Number(reduxFare) || Number(fare));

  // Sync local fare → Redux every time user changes it
  useEffect(() => {
    dispatch(setMyRideFare(newFare.toFixed(2)));
  }, [newFare]);

  return (
    <>
      <View
        className={`
        bg-white rounded-2xl border border-[#e6e6e6] mx-4 mt-5 mb-5 
        ${Platform.OS === 'ios' ? 'shadow shadow-black/10 shadow-md' : 'elevation-2'}
      `}
      >
        <TouchableOpacity
          className="rounded-full bg-white self-end absolute top-5 right-2"
          onPress={() => {
            setOfferModalVisible(true);
            setFareCheck(true);
          }}
        >
          <MaterialIcons name="mode-edit" size={24} color="#7a7a7a" />
        </TouchableOpacity>

        <View className="relative bg-transparent" style={{ width: '90%' }}>
          <Image source={{ uri: imageUrl }} className="w-[7.2rem] h-[8rem] absolute left-1 -top-[3.38rem] mb-3 z-50" resizeMode="contain" />

          <View className="bg-[#3853A4] py-4 px-2 pt-[5px] flex-row items-center justify-between rounded-br-[42px]">
            <View className="pl-[100px] flex-1">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <CustomText lightColor="white" fontSize='sm' fontWeight="semibold" className="text-white text-[12px] font-extrabold">
                    {formatRideName(name)}
                  </CustomText>
                  <Feather name="info" size={14} color="#fff" className="ml-2" />
                </View>
                <View className="flex-row items-center">
                  <FontAwesome name="user-o" size={14} color="white" />
                  <Text className="text-white ml-1 text-xs">{capacity}</Text>
                </View>
              </View>

              <Text numberOfLines={1} className="text-[#dfe8ff] text-sm mt-2">
                Easy, Fast and convenient ....
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between px-2 py-4">
          <TouchableOpacity
            disabled={newFare === fare}
            onPress={() => {
              setNewFare((prev) => Math.max(fare, prev - 10));
            }}
            className={`
    w-12 h-12 rounded-full bg-[#EDEDED] items-center justify-center
    ${Platform.OS === 'ios' ? 'shadow shadow-black/5' : 'elevation-1'}
  `}
            style={{ opacity: newFare === fare ? 0.5 : 1 }}
          >
            <FontAwesome name="minus" size={20} color="#929292" />
          </TouchableOpacity>

          <View className="items-center flex-1">
            <CustomText lightColor="#1677A4" fontSize="lg" fontWeight="bold">
              {currency?.code} {newFare.toFixed(2)}
            </CustomText>

            <View className="mt-3 bg-[#f1f1f1] px-4 py-2 rounded-full">
              <Text className="text-[#9aa0a6] text-xs">Recommended fare : {currency?.code} {newFare.toFixed(2)}</Text>
            </View>

          </View>

          <TouchableOpacity
            onPress={() => {
              setNewFare((prev) => prev + 10);
            }}
            className={`
            w-12 h-12 rounded-full bg-[#EDEDED] items-center justify-center
            ${Platform.OS === 'ios' ? 'shadow shadow-black/5' : 'elevation-1'}
          `}
          >
            <FontAwesome name="plus" size={20} color="#929292" />
          </TouchableOpacity>
        </View>
      </View>

      <OfferYourFare visible={offerModalVisible} onClose={() => setOfferModalVisible(false)} fareCheck={fareCheck} />
    </>
  );
};

export default RideCard;
