import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { selectSuperAppIsAuthenticated, selectSuperAppUser, updateUser } from '@/redux';

export default function TermsAndServiceScreen() {
  const scrollY = new Animated.Value(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectSuperAppIsAuthenticated);
  const user = useSelector(selectSuperAppUser);

  const { height: screenHeight } = Dimensions.get('window');
  const HEADER_HEIGHT = screenHeight * 0.15;

  // Interpolate top color from #DAD5FB to #ffffff
  const topColor = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: ['#DAD5FB', '#ffffff'],
    extrapolate: 'clamp',
  });

  // Interpolate bottom color from #fcfcfc to #ffffff
  const bottomColor = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: ['#fcfcfc', '#ffffff'],
    extrapolate: 'clamp',
  });

  // Interpolate header background to white as we scroll
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2],
    outputRange: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  });

  const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPosition = contentOffset.y;
    const scrollHeight = contentSize.height - layoutMeasurement.height;

    // Check if at bottom (with small threshold)
    const atBottom = scrollPosition >= scrollHeight - 20;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleAcceptAndContinue = () => {
    console.log('✅ Terms accepted');
    console.log('🔐 Current auth state:', { isAuthenticated, userName: user?.name });
    
    // Ensure user has accepted terms (optional - store in user profile)
    if (user) {
      dispatch(updateUser({ 
        ...user, 
        // You could add terms_accepted: true if your backend supports it
      }));
    }
    
    // Navigate to home
    console.log('🏠 Navigating to home');
    router.replace('/home');
  };
  
  // Static content based on provided details
  const staticContent = (
    <View className="px-4 pt-20 pb-10">
      <Text className="text-xl font-bold mb-2 text-gray-800">Compliance with Laws</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">
        All users (drivers and riders) must comply with the traffic rules and the Land Transport Regulations set by the Ministry of Transport in
        Qatar.
      </Text>

      <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">Account</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Users must provide accurate information when registering.</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Accounts are personal and cannot be shared.</Text>

      <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">3. Safety</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">
        • Vehicles must be licensed, roadworthy, and registered under an authorized limousine company.
      </Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Drivers must hold a valid Qatari driving license and be fit to drive.</Text>

      <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">4. Fares & Payment</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">
        • Fares are calculated according to the approved tariff by the Ministry of Transport.
      </Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Payments can be made through the app or in cash (where available).</Text>

      <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">5. Conduct</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Users must treat each other with respect and avoid any harmful behavior.</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• The app may not be used for any unlawful purposes.</Text>

      <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">6. Liability</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">
        • The company is not liable for delays or events beyond its control (traffic, force majeure, etc.).
      </Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Passengers are covered by insurance as required by law.</Text>

      <Text className="text-xl font-bold mt-4 mb-2 text-gray-800">7. Changes</Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">
        • The company is not liable for delays or events beyond its control (traffic, force majeure, etc.).
      </Text>
      <Text className="text-base mb-4 text-gray-800 leading-6">• Passengers are covered by insurance as required by law.</Text>

      <TouchableOpacity className="bg-[#3853A4] rounded-3xl py-4 px-8 w-[95%] self-center mt-5 mb-4" onPress={handleAcceptAndContinue}>
        <Text className="text-white text-lg font-bold text-center">Accept & Continue</Text>
      </TouchableOpacity>

      {/* Add bottom padding to account for fixed button */}
      <View className="h-24" />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'left', 'right']}>
      <AnimatedGradient
        colors={[topColor, bottomColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute top-0 left-0 right-0 z-10"
        style={{ height: HEADER_HEIGHT }}
      >
        <Animated.View className="absolute inset-0" style={{ backgroundColor: headerBackgroundColor }} />
        <SafeAreaView className="flex-1 justify-center">
          <View className="w-full px-4">
            <Text className="text-[#9F9F9F] text-base font-bold">AGREEMENT</Text>
            <Text className="text-[#494949] text-3xl font-bold">Terms of Service</Text>
            <Text className="text-[#7C7C7C] text-sm">Last updated on 5/12/2022</Text>
          </View>
        </SafeAreaView>
      </AnimatedGradient>

      <Animated.ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 30 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
          listener: handleScroll,
        })}
        scrollEventThrottle={16}
      >
        {staticContent}
      </Animated.ScrollView>

      {/* Fade-out gradient at bottom (only when not at bottom) */}
      {!isAtBottom && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 1)']}
          className="absolute bottom-0 left-0 right-0 z-5"
          style={{ height: 120 }}
          pointerEvents="none"
        />
      )}

      {/* Fixed Scroll Control Buttons at Bottom */}
      <SafeAreaView className="absolute bottom-0 left-0 right-0 z-10" edges={['bottom']}>
        {!isAtBottom ? (
          <View className="w-full py-4 px-5 items-center">
            <TouchableOpacity className="rounded-3xl py-3 px-8 border-2 border-[#383699] w-60" onPress={scrollToBottom}>
              <Text className="text-[#383699] text-base font-semibold text-center">Scroll to Bottom</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white w-full py-4 px-5 items-center">
            <TouchableOpacity className="rounded-3xl py-3 px-8 border-2 border-gray-800" onPress={scrollToTop}>
              <Text className="text-gray-800 text-base font-semibold text-center">Scroll to Top</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaView>
  );
}
