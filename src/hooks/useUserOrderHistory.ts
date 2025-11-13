import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_ORDERS, GET_USER_ORDERS } from '@/api/graphql/query/active0rders';

export function useUserOrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);

  const { data, loading, error, fetchMore, refetch } = useQuery(ALL_ORDERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.orders) {
        setOrders([...data.orders]);
      }
    },
  });

  // Call this when user scrolls to end

  return {
    orders,
    error,
    loading,
  };
}
