import { useQuery } from '@apollo/client';
import { GET_ORDER_BY_ID } from '@/api/graphql/query/active0rders';

export function usePastOrderDetail(orderId: string) {
  const { data, loading, error, refetch } = useQuery(GET_ORDER_BY_ID, {
    variables: { orderId },
    fetchPolicy: 'cache-and-network',
    skip: !orderId,
  });

  function getOrderDisplayDate(order: any) {
    if (order?.status?.toLowerCase() === 'pending') return order?.orderDate;
    if (order?.status?.toLowerCase() === 'accepted') return order?.acceptedAt;
    if (order?.status?.toLowerCase() === 'assigned') return order?.assignedAt;
    if (order?.status?.toLowerCase() === 'cancelled') return order?.cancelledAt;
    if (order?.status?.toLowerCase() === 'completed') return order?.deliveredAt;
    return order?.orderDate;
  }

  return {
    order: data?.order || {},
    loading,
    error,
    getOrderDisplayDate,
    refetch,
  };
}
