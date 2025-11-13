// components/ActiveOrdersFAB.tsx - Updated version

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useActiveOrders } from '@/hooks/useActiveOrder';

const { width, height } = Dimensions.get('window');

const FAB_SIZE = 56;
const BOTTOM_SHEET_HEIGHT = height * 0.7;

// Colors
const WOLT_BLUE = '#009DE0';
const WOLT_BLUE_DARK = '#0070A3';

// Order Progress Bar Component
const OrderProgressBar: React.FC<{ progress: number; status: string }> = ({ progress, status }) => {
  const getProgressColor = () => {
    switch (status) {
      case 'PENDING': return '#FFA500';
      case 'ACCEPTED': return '#4CAF50';
      case 'ASSIGNED': return '#2196F3';
      case 'PICKED': return '#FF9800';
      default: return '#4CAF50';
    }
  };

  return (
    <View className="my-2">
      <View className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: getProgressColor()
          }}
        />
      </View>
    </View>
  );
};

// Individual Order Item Component
const OrderItem: React.FC<{
  order: any;
  onPress: (order: any) => void;
}> = ({ order, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-gray-50 rounded-xl p-4 mx-0 my-2 border border-gray-200"
      onPress={() => onPress(order)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-900">{order.orderId}</Text>
        <Text className="text-sm text-gray-600 font-semibold">{order.estimatedTime}</Text>
      </View>

      <Text className="text-sm text-gray-600 mb-3">{order.restaurant.name}</Text>

      <OrderProgressBar progress={order.progress} status={order.orderStatus} />

      <Text className="text-sm text-gray-800 leading-5">{order.statusText}</Text>
    </TouchableOpacity>
  );
};

// Bottom Sheet Component
const ActiveOrdersBottomSheet: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  orders: any[];
  loading: boolean;
  isAuthenticated: boolean;
  onRefresh: () => void;
}> = ({ isVisible, onClose, orders, loading, isAuthenticated, onRefresh }) => {
  const router = useRouter();

  const handleOrderPress = (order: any) => {
    // Navigate to order tracking page with the order's _id
    router.push({
      pathname: '/order-tracking',
      params: { id: order._id },
    });
    onClose();
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <View className="items-center justify-center py-16">
          <FontAwesome name="user-times" size={48} color="#ccc" />
          <Text className="text-lg font-semibold text-gray-500 mt-4">Please log in</Text>
          <Text className="text-sm text-gray-400 mt-2 text-center">
            Sign in to view your active orders
          </Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View className="items-center justify-center py-16">
          <ActivityIndicator size="large" color={WOLT_BLUE} />
          <Text className="text-lg text-gray-500 mt-4">Loading orders...</Text>
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View className="items-center justify-center py-16">
          <FontAwesome name="inbox" size={48} color="#ccc" />
          <Text className="text-lg font-semibold text-gray-500 mt-4">No active orders</Text>
          <Text className="text-sm text-gray-400 mt-2 text-center">
            Your current orders will appear here
          </Text>
          <TouchableOpacity
            className="mt-5 px-5 py-2.5 bg-blue-500 rounded-full"
            onPress={onRefresh}
          >
            <Text className="text-white text-base font-semibold">Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return orders.map((order) => (
      <OrderItem
        key={order._id}
        order={order}
        onPress={handleOrderPress}
      />
    ));
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0 bg-black/50" />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <View
          className="bg-white rounded-t-3xl"
          style={{ height: BOTTOM_SHEET_HEIGHT }}
        >
          {/* Handle */}
          <View className="w-10 h-1 bg-gray-300 rounded-full self-center mt-2.5 mb-5" />

          {/* Header */}
          <View className="flex-row justify-between items-center px-5 pb-5 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {orders.length} Order{orders.length !== 1 ? 's' : ''} InProgress
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Orders List */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          >
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Main FAB Component
const ActiveOrdersFAB: React.FC = () => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const {
    activeOrders,
    activeOrdersCount,
    loading,
    isAuthenticated,
    refetch,
  } = useActiveOrders();


  const toggleBottomSheet = () => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  const handleRefresh = () => {

    refetch();
  };

  // Show FAB when user is authenticated and has active orders or is loading
  const shouldShowFAB = loading || (isAuthenticated && activeOrdersCount > 0);

  if (!shouldShowFAB) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <View className="absolute bottom-8 right-5 z-50">
        <TouchableOpacity
          className={`w-14 h-14 rounded-full justify-center items-center shadow-lg ${loading ? 'bg-blue-700' : 'bg-blue-600'
            }`}
          onPress={toggleBottomSheet}
          activeOpacity={0.8}
          disabled={loading}
          style={{
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <FontAwesome
              name="shopping-bag"
              color="#FFFFFF"
              size={24}
            />
          )}

          {/* Badge with order count */}
          {activeOrdersCount > 0 && !loading && (
            <View
              className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-6 h-6 justify-center items-center border-2 border-white"
              style={{
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <Text className="text-white text-xs font-bold text-center">
                {activeOrdersCount > 99 ? '99+' : activeOrdersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <ActiveOrdersBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={toggleBottomSheet}
        orders={activeOrders}
        loading={loading}
        isAuthenticated={isAuthenticated}
        onRefresh={handleRefresh}
      />
    </>
  );
};

export default ActiveOrdersFAB;