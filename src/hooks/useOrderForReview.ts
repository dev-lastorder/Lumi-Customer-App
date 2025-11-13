// src/hooks/useOrderForReview.ts
import { useQuery } from '@apollo/client';
import { GET_ORDER_FOR_REVIEW } from '@/api';

export const useOrderForReview = (orderId: string) => {
  const isDummyOrder = !orderId || orderId.includes('dummy') || orderId.length < 20;
  
  const { data, loading, error } = useQuery(GET_ORDER_FOR_REVIEW, {
    variables: { id: orderId },
    skip: !orderId || isDummyOrder,
    fetchPolicy: 'cache-and-network',
  });

  // ✅ DUMMY DATA - Keeps your design intact when real data isn't available
  const dummyOrderData = {
    _id: orderId,
    orderId: orderId,
    orderStatus: 'DELIVERED',
    restaurant: {
      _id: 'dummy-restaurant',
      name: "Subway Arnulfstrasse", // 👈 Same as your original dummy
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&crop=center', // 👈 Same as your original
      address: '123 Main St, Downtown'
    },
    items: [
      {
        _id: 'item1',
        title: 'Big Mac Meal',
        quantity: 1,
        variation: {
          title: 'Large',
          price: 12.99
        }
      }
    ],
    orderAmount: 25.99,
    deliveryCharges: 2.50,
    tipping: 3.00,
    taxationAmount: 2.50,
    createdAt: new Date().toISOString(),
    review: null // No existing review
  };

  return {
    orderData: isDummyOrder ? dummyOrderData : data?.order || null,
    loading: !isDummyOrder && loading,
    error: !isDummyOrder && error?.message || null,
  };
};