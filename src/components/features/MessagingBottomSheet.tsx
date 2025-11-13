import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { CustomText } from '../common';
import { canUserChat } from '@/utils/helpers/can-user-chat';

const { width, height } = Dimensions.get('window');

interface MessagingBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onOpenCourierChat: () => void;
  onOpenStoreChat: () => void;
  orderStatus?: string;
}

const MessagingBottomSheet: React.FC<MessagingBottomSheetProps> = ({ orderStatus, visible, onClose, onOpenCourierChat, onOpenStoreChat }) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const router = useRouter();

  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth?.user);

  // Extract username from user data with fallback to 'Alex'
  const getUserName = () => {
    if (currentUser?.name) {
      // Extract first name if full name is provided
      const firstName = currentUser.name.split(' ')[0];
      return firstName;
    }
    return 'Alex'; // Fallback name
  };

  useEffect(() => {
    if (visible) {
      // Reset position before animating in
      slideAnim.setValue(400);
      backdropAnim.setValue(0);
      isAnimating.current = true;

      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    } else if (!visible && !isAnimating.current) {
      // Only animate out if not currently animating
      isAnimating.current = true;

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 400,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    }
  }, [visible, slideAnim, backdropAnim]);

  const handleSupportPress = () => {
    onClose(); // Close current sheet first
    setTimeout(() => {
      router.push('/(food-delivery)/(profile)/help');
    }, 300); // Wait for animation to complete
  };

  const handleCourierPress = () => {
    onClose(); // Close current sheet first
    // Reduced timeout to make it feel more responsive
    setTimeout(() => {
      onOpenCourierChat(); // Open courier chat sheet
    }, 200); // Shorter delay
  };

  const handleStorePress = () => {
    onClose(); // Close current sheet first
    // Reduced timeout to make it feel more responsive
    setTimeout(() => {
      onOpenStoreChat(); // Open courier chat sheet
    }, 200); // Shorter delay
  };

  const handleClose = () => {
    // Trigger the closing animation by calling onClose
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      {/* Animated Backdrop */}
      <Animated.View
        className="absolute top-0 left-0 right-0 bottom-0 z-50"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: backdropAnim,
        }}
      >
        <TouchableOpacity className="flex-1" onPress={handleClose} activeOpacity={1} />
      </Animated.View>

      {/* Animated Bottom Sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-10 z-50"
        style={{
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {/* Handle bar */}
        <View className="w-9 h-1 bg-gray-300 rounded-sm self-center mt-2 mb-3" />

        {/* Close button */}
        <TouchableOpacity className="absolute top-4 right-4 w-8 h-8 rounded-2xl bg-gray-100 justify-center items-center z-50" onPress={handleClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>

        {/* Content */}
        <View className="px-5 pt-4">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-black mb-1">Hi {getUserName()}! 👋</Text>
            <Text className="text-base text-gray-600 font-normal">How can we help you?</Text>
          </View>

          {/* Options */}
          <View className="gap-3">
            {/* Contact Wolt Support */}
            <TouchableOpacity className="bg-white rounded-xl border border-gray-200 overflow-hidden" onPress={handleSupportPress} activeOpacity={0.7}>
              <View className="flex-row items-center p-4">
                <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center mr-3">
                  <Ionicons name="headset-outline" size={24} color="#007AFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-black mb-0.5">Contact Wolt Support 💙</Text>
                  <Text className="text-sm text-gray-600 leading-5">Talk with a support hero about anything</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </View>
            </TouchableOpacity>

            {/* Chat with Store */}
            {canUserChat(orderStatus ?? '', 'STORE') && (
              <TouchableOpacity className="bg-white rounded-xl border border-gray-200 overflow-hidden" onPress={handleStorePress} activeOpacity={0.7}>
                <View className="flex-row items-center p-4">
                  <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center mr-3">
                    <Ionicons name="bicycle-outline" size={24} color="#007AFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black mb-0.5">Chat with the Store 🚴</Text>
                    <Text className="text-sm text-gray-600 leading-5">Give order instructions in real-time</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            )}

            {/* Chat with Courier Partner */}
            {canUserChat(orderStatus ?? '', 'RIDER') && (
              <TouchableOpacity
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                onPress={handleCourierPress}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center p-4">
                  <View className="w-10 h-10 rounded-full bg-blue-50 justify-center items-center mr-3">
                    <Ionicons name="bicycle-outline" size={24} color="#007AFF" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black mb-0.5">Chat with the Courier Partner 🚴</Text>
                    <Text className="text-sm text-gray-600 leading-5">Give drop-off instructions in real-time</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default MessagingBottomSheet;
