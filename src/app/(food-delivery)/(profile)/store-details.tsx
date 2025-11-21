import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { StoreDetailsScreen } from '@/screens/store/screens';
import CartPopUp from '@/components/common/cartPopUp';
import { setCartPopupVisibility, useAppDispatch, useAppSelector } from '@/redux';
import { useLocalSearchParams } from 'expo-router';

const StoreDetails = () => {
  const dispatch = useAppDispatch();
  const currentRestaurantId = useAppSelector((state) => state.cart.currentRestaurantId);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const { id } = useLocalSearchParams();
  const storeId = typeof id === 'string' ? id : undefined;
  // Control cart popup visibility
  useEffect(() => {
    const shouldShowPopup =
      totalQuantity > 0 &&
      storeId === currentRestaurantId;

    dispatch(setCartPopupVisibility(shouldShowPopup));
  }, [totalQuantity, storeId, currentRestaurantId]);

  return (
    <View className='flex-1'>
      <StoreDetailsScreen />
      <CartPopUp />
    </View>
  );
};

export default StoreDetails;
