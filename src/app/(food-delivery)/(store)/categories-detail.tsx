import React, { useEffect } from 'react';
import { CategoriesDetailScreen } from '@/screens';
import { setCartPopupVisibility, useAppDispatch, useAppSelector } from '@/redux';
import CartPopUp from '@/components/common/cartPopUp';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const CategoriesDetail = () => {
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
      <CategoriesDetailScreen />
      <CartPopUp />
    </View>
  );
};

export default CategoriesDetail;
