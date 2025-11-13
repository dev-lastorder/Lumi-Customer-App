// src/hooks/useOrderTracking.ts
import { useState, useEffect, useRef } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';

// GraphQL Queries and Subscriptions
import { GET_ORDER_DETAILS } from '@/api/graphql/query/order';
import { ORDER_STATUS_SUBSCRIPTION, ORDER_UPDATES_SUBSCRIPTION } from '@/api';

// Interfaces
import { OrderTrackingData, UseOrderTrackingResult } from '@/utils/interfaces/order';

export const useOrderTracking = (orderId: string): UseOrderTrackingResult => {
  const [remainingTime, setRemainingTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth?.user);

  // Check if this is a dummy orderId (for testing purposes)
  const isDummyOrder = !orderId || orderId.includes('dummy') || orderId.length < 20;

  // ✅ Query order details using _id (not orderId)
  const {
    data: orderQueryData,
    loading: orderLoading,
    error: orderError,
    refetch,
  } = useQuery(GET_ORDER_DETAILS, {
    variables: { id: orderId }, // This should be the _id from MongoDB
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    skip: !orderId || isDummyOrder,
    // ✅ Add polling for real-time updates as fallback
    pollInterval: 10000, // Poll every 10 seconds
    onCompleted: (data) => {},
    onError: (error) => {},
  });

  // ✅ Subscribe to order status changes for the user
  const { data: statusSubscriptionData, error: subscriptionError } = useSubscription(ORDER_STATUS_SUBSCRIPTION, {
    variables: { userId: user?.id },
    skip: !user?.id || isDummyOrder,
    onSubscriptionData: ({ subscriptionData }) => {
      // Force refetch when we get subscription data for our order
      const updatedOrder = subscriptionData?.data?.orderStatusChanged?.order;
      if (updatedOrder && updatedOrder._id === orderId) {
        refetch();
      }
    },
    onSubscriptionComplete: () => {},
    onError: (error) => {},
  });

  // ✅ Subscribe to specific order updates using _id
  const { data: orderSubscriptionData } = useSubscription(ORDER_UPDATES_SUBSCRIPTION, {
    variables: { id: orderId }, // This should match the _id
    skip: !orderId || isDummyOrder,
    onSubscriptionData: ({ subscriptionData }) => {
      // Force refetch when we get subscription data
      if (subscriptionData?.data?.subscriptionOrder) {
        refetch();
      }
    },
    onError: (error) => {
      console.error('❌ Order updates subscription error:', error);
    },
  });

  // Get order data from query (only if not dummy)
  const orderData: OrderTrackingData | null = !isDummyOrder ? orderQueryData?.order || null : null;

  // ✅ Calculate remaining time
  useEffect(() => {
    if (orderData && !['DELIVERED', 'CANCELLED', 'CANCELLEDBYREST', 'COMPLETED'].includes(orderData.orderStatus)) {
      const calculateRemainingTime = () => {
        const expectedTime = orderData.orderStatus === 'PENDING' ? orderData.preparationTime : orderData.completionTime;

        if (!expectedTime) return 0;

        const remainingMinutes = Math.floor((new Date(expectedTime).getTime() - Date.now()) / 1000 / 60);
        return remainingMinutes > 0 ? remainingMinutes : 0;
      };

      const initialTime = calculateRemainingTime();
      setRemainingTime(initialTime);

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const updatedTime = calculateRemainingTime();
        setRemainingTime(updatedTime);

        if (updatedTime <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }, 1000);
    } else {
      // Clear interval for completed orders
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRemainingTime(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [orderData?.orderStatus, orderData?.preparationTime, orderData?.completionTime]);

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'PENDING':
        return 'Order Received';
      case 'ACCEPTED':
        return 'Order Confirmed';
      case 'ASSIGNED':
        return 'Rider Assigned';
      case 'PICKED':
        return 'Order Picked Up';
      case 'DELIVERED':
        return 'Order Delivered';
      case 'COMPLETED':
        return 'Order Completed';
      case 'CANCELLED':
      case 'CANCELLEDBYREST':
        return 'Order Cancelled';
      default:
        return 'Processing Order';
    }
  };

  // ✅ SEPARATE COORDINATES for testing - Restaurant and delivery at different locations
  const fallbackData: OrderTrackingData = {
    _id: orderId,
    orderId: `DUMMY-${orderId}`,
    orderStatus: 'ASSIGNED',
    restaurant: {
      _id: 'dummy-restaurant',
      name: "McDonald's Downtown",
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop',
      address: '123 Main St, Downtown',
      location: {
        coordinates: ['73.0810976', '33.5831583'], // Restaurant coordinates
      },
    },
    deliveryAddress: {
      location: {
        coordinates: ['73.0656976', '33.5931583'], // ✅ DIFFERENT coordinates for delivery (moved ~2km away)
      },
      deliveryAddress: '456 Customer St, F-8 Markaz',
      details: 'Apartment 3C',
      label: 'Home',
    },
    items: [
      {
        _id: 'item1',
        title: 'Big Mac Meal',
        quantity: 1,
        variation: {
          title: 'Large',
          price: 12.99,
        },
      },
      {
        _id: 'item2',
        title: 'Chicken McNuggets',
        quantity: 2,
        variation: {
          title: '6 pieces',
          price: 8.99,
        },
      },
    ],
    orderAmount: 25.99,
    deliveryCharges: 2.5,
    tipping: 3.0,
    taxationAmount: 2.5,
    isPickedUp: false,
    createdAt: new Date().toISOString(),
    completionTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes from now
    preparationTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
  };

  const statusText = orderData ? getStatusText(orderData.orderStatus) : getStatusText(fallbackData.orderStatus);
  const error = !isDummyOrder && orderError ? orderError.message : null;

  // For dummy orders, set a fake remaining time for testing
  useEffect(() => {
    if (isDummyOrder) {
      setRemainingTime(25); // 25 minutes remaining for dummy
    }
  }, [isDummyOrder]);

  return {
    orderData: orderData || fallbackData,
    loading: !isDummyOrder && orderLoading,
    error,
    remainingTime: isDummyOrder ? 25 : remainingTime,
    statusText,
    refetch,
  };
};

// ✅ Helper function to get order status info for UI
export const useOrderStatusInfo = (orderData: OrderTrackingData | null, remainingTime: number) => {
  if (!orderData) {
    return {
      mainText: 'Loading order...',
      subText: 'Please wait while we fetch your order details',
      timeText: '',
    };
  }

  const formatRemainingTime = (minutes: number): string => {
    if (minutes <= 0) return '';
    const minTime = Math.max(minutes - 2, 0); // Show a range
    const maxTime = minutes + 3;
    return `${minTime}-${maxTime} mins`;
  };

  const timeText = remainingTime > 0 ? formatRemainingTime(remainingTime) : '';

  switch (orderData.orderStatus) {
    case 'PENDING':
      return {
        mainText: orderData.restaurant.name,
        subText: 'Your order has been received and is being prepared',
        timeText: timeText || 'Preparing your order...',
      };
    case 'ACCEPTED':
      return {
        mainText: orderData.restaurant.name,
        subText: 'Your order has been confirmed and is being prepared',
        timeText: timeText || 'Estimated prep time: 15-20 minutes',
      };
    case 'ASSIGNED':
      return {
        mainText: orderData.restaurant.name,
        subText: 'A rider has been assigned to your order',
        timeText: timeText || 'Rider is heading to the restaurant',
      };
    case 'PICKED':
      return {
        mainText: orderData.restaurant.name,
        subText: 'Your order has been picked up and is on the way',
        timeText: timeText || 'Estimated delivery: 10-15 minutes',
      };
    case 'DELIVERED':
      return {
        mainText: orderData.restaurant.name,
        subText: 'Your order has been delivered successfully!',
        timeText: 'Enjoy your meal 🎉',
      };
    case 'COMPLETED':
      return {
        mainText: orderData.restaurant.name,
        subText: 'Order completed successfully!',
        timeText: 'Thank you for your order 🙏',
      };
    case 'CANCELLED':
    case 'CANCELLEDBYREST':
      return {
        mainText: orderData.restaurant.name,
        subText: 'Your order has been cancelled',
        timeText: 'We apologize for the inconvenience',
      };
    default:
      return {
        mainText: orderData.restaurant.name,
        subText: 'Processing your order...',
        timeText: timeText,
      };
  }
};
