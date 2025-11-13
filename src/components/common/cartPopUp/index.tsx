import { Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '@/redux';

import Animated, { useAnimatedStyle, withSpring, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

const CartPopUp = () => {
  const router = useRouter();

  const { totalQuantity, totalPrice, isCartPopupVisible, currentRestaurantId, items } = useAppSelector((state) => state.cart);

  const configuration = useAppSelector((state) => state.configuration.configuration);

  // Animation setup
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  // Animate based on visibility state
  useEffect(() => {


    if (isCartPopupVisible) {

      translateY.value = withSpring(0);
      opacity.value = withTiming(1);
    } else {

      translateY.value = withSpring(100);
      opacity.value = withTiming(0);
    }
  }, [isCartPopupVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  // Debug early returns
  if (!isCartPopupVisible) {
    return null;
  }

  if (totalQuantity === 0) {
    return null;
  }



  return (
    <Animated.View style={[animatedStyle]} className="absolute bottom-4 left-4 right-4 rounded-full bg-primary shadow-lg">
      <TouchableOpacity
        onPress={() => {

          router.push('/order-details');
        }}
        className="flex-row items-center justify-between px-6 py-4"
      >
        <View className="flex-row items-center space-x-3 gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <Text className="font-bold text-primary">{totalQuantity}</Text>
          </View>
          <Text className="text-lg font-semibold text-white">View order</Text>
        </View>
        <Text className="text-lg font-bold text-white">
          {configuration?.currencySymbol || '$'} {totalPrice.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CartPopUp;
