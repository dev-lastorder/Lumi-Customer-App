// hooks/useActiveOrders.ts - Fixed version with frontend solution

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { useAppSelector } from '@/redux';
// Fixed import path - correct spelling
import { GET_ACTIVE_ORDERS, GET_USER_ORDERS, ORDER_STATUS_SUBSCRIPTION } from '@/api/graphql/query/active0rders';

// Types
interface ActiveOrder {
  _id: string;
  orderId: string;
  restaurant: {
    _id: string;
    name: string;
    image?: string;
    address: string;
    location?: {
      coordinates: string[];
    };
  };
  orderStatus: string;
  orderDate: string;
  completionTime?: string;
  preparationTime?: string;
  expectedTime?: string;
  isPickedUp: boolean;
  rider?: {
    _id: string;
    name: string;
    phone: string;
  };
  items: Array<{
    _id: string;
    title: string;
    quantity: number;
    variation: {
      title: string;
      price: number;
    };
    addons?: Array<{
      _id: string;
      title: string;
      options: Array<{
        _id: string;
        title: string;
        price: number;
      }>;
    }>;
  }>;
  orderAmount: number;
  deliveryCharges: number;
  tipping: number;
  taxationAmount: number;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
  deliveryAddress?: {
    deliveryAddress: string;
    details?: string;
    label: string;
    location: {
      coordinates: string[];
    };
  };
  // Calculated fields
  estimatedTime: string;
  progress: number;
  statusText: string;
}

// Active order statuses - orders that are not completed or cancelled
const ACTIVE_ORDER_STATUSES = ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED'];

// Order statuses that should be removed from active orders
const COMPLETED_ORDER_STATUSES = ['DELIVERED', 'COMPLETED', 'CANCELLED', 'CANCELLEDBYREST'];

// Helper function to calculate remaining time
const calculateRemainingTime = (order: any): string => {
  const targetTime = order.completionTime || order.preparationTime || order.expectedTime;

  if (!targetTime) return '15-25 mins';

  const now = Date.now();
  const target = new Date(targetTime).getTime();
  const diffMinutes = Math.max(0, Math.floor((target - now) / (1000 * 60)));

  if (diffMinutes <= 5) return '5-10 mins';
  if (diffMinutes <= 15) return '10-15 mins';
  if (diffMinutes <= 25) return '15-25 mins';
  if (diffMinutes <= 35) return '25-35 mins';

  return `${diffMinutes}-${diffMinutes + 10} mins`;
};

// Helper function to get progress based on status
const getOrderProgress = (status: string): number => {
  switch (status) {
    case 'PENDING':
      return 0.25;
    case 'ACCEPTED':
      return 0.5;
    case 'ASSIGNED':
      return 0.75;
    case 'PICKED':
      return 0.9;
    default:
      return 0;
  }
};

// Helper function to get status text
const getStatusText = (order: any): string => {
  switch (order.orderStatus) {
    case 'PENDING':
      return 'Order placed. Waiting for restaurant confirmation.';
    case 'ACCEPTED':
      return 'Restaurant is preparing your order.';
    case 'ASSIGNED':
      return order.rider ? `${order.rider.name} will deliver your order.` : 'Rider assigned to your order.';
    case 'PICKED':
      return order.rider ? `${order.rider.name} has picked up your food.` : 'Your order has been picked up.';
    default:
      return 'Order in progress.';
  }
};

// Custom hook
export const useActiveOrders = () => {
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Fixed user ID detection
  const userId = user?.id;

  // DISABLED: Primary query (undeliveredOrders) - commented out since it's missing ASSIGNED status
  // const {
  //   data: undeliveredOrdersData,
  //   loading: undeliveredLoading,
  //   error: undeliveredError,
  //   refetch: refetchUndelivered
  // } = useQuery(GET_ACTIVE_ORDERS, {
  //   variables: { offset: 0 },
  //   skip: true, // Disabled until backend is fixed
  //   fetchPolicy: 'cache-and-network',
  //   errorPolicy: 'all',
  // });

  // Use general orders query and filter on frontend
  const {
    data: allOrdersData,
    loading: allOrdersLoading,
    error: allOrdersError,
    refetch: refetchAllOrders,
  } = useQuery(GET_USER_ORDERS, {
    variables: { offset: 0 },
    skip: !isAuthenticated || !token,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    pollInterval: 30000,
    onError: (error) => {},
    onCompleted: (data) => {},
  });

  // Subscription for real-time updates
  const { data: subscriptionData, error: subscriptionError } = useSubscription(ORDER_STATUS_SUBSCRIPTION, {
    variables: { userId: userId || '' },
    skip: !isAuthenticated || !token || !userId,
    onError: (error) => {},
    onData: ({ data }) => {},
  });

  // Process and filter active orders
  const processedActiveOrders = useMemo(() => {
    let orders: any[] = [];

    // Only use allOrdersData since we disabled undeliveredOrders
    if (allOrdersData?.orders) {
      orders = allOrdersData.orders;
    }

    // Filter only active orders and add calculated fields
    const filteredOrders = orders
      .filter((order) => {
        const isActive = ACTIVE_ORDER_STATUSES.includes(order.orderStatus);
        const isCompleted = COMPLETED_ORDER_STATUSES.includes(order.orderStatus);

        return isActive;
      })
      .map((order) => ({
        ...order,
        estimatedTime: calculateRemainingTime(order),
        progress: getOrderProgress(order.orderStatus),
        statusText: getStatusText(order),
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filteredOrders;
  }, [allOrdersData]);

  // Update active orders when data changes
  useEffect(() => {
    setActiveOrders(processedActiveOrders);
  }, [processedActiveOrders]);

  // Handle subscription updates - improved logic
  useEffect(() => {
    if (subscriptionData?.orderStatusChanged?.order) {
      const updatedOrder = subscriptionData.orderStatusChanged.order;
      // const origin = subscriptionData.orderStatusChanged.origin;

      setActiveOrders((prevOrders) => {
        const existingOrderIndex = prevOrders.findIndex((order) => order._id === updatedOrder._id);
        let newOrders = [...prevOrders];

        if (COMPLETED_ORDER_STATUSES.includes(updatedOrder.orderStatus)) {
          // Order is completed/cancelled - remove it
          if (existingOrderIndex >= 0) {
            newOrders.splice(existingOrderIndex, 1);
          }
        } else if (ACTIVE_ORDER_STATUSES.includes(updatedOrder.orderStatus)) {
          // Order is still active - add calculated fields
          const processedOrder = {
            ...updatedOrder,
            estimatedTime: calculateRemainingTime(updatedOrder),
            progress: getOrderProgress(updatedOrder.orderStatus),
            statusText: getStatusText(updatedOrder),
          };

          if (existingOrderIndex >= 0) {
            // Update existing order
            newOrders[existingOrderIndex] = processedOrder;
          } else {
            // Add new order to the beginning
            newOrders.unshift(processedOrder);
          }
        } else {
        }

        // Sort by creation time (newest first)
        return newOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    }
  }, [subscriptionData]);

  const refetchOrders = async () => {
    if (isAuthenticated && token) {
      try {
        await refetchAllOrders();
      } catch (error) {
        console.error('❌ Error refetching orders:', error);
      }
    }
  };

  // Auto-refetch when user logs in
  useEffect(() => {
    if (isAuthenticated && token && userId) {
      ;
      // Small delay to ensure authentication is fully set up
      const timer = setTimeout(() => {
        refetchOrders();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, token, userId]);

  const loading = allOrdersLoading;
  const error = allOrdersError;

  return {
    activeOrders,
    activeOrdersCount: activeOrders.length,
    loading,
    error: error || subscriptionError,
    refetch: refetchOrders,
    // Debug info
    isAuthenticated,
    userId,
    hasToken: !!token,
    subscriptionActive: !subscriptionError && !!userId,
  };
};
