export const canUserChat = (orderStatus: string, type: 'STORE' | 'RIDER'): boolean => {
  if (!orderStatus) {
    return false; // No order status available
  }

  const canChatWithStore = (status: string) => !['PENDING', 'CANCELLED', 'COMPLETED'].includes(status);
  const canChatWithRider = (status: string) => ["ASSIGNED", 'PICKED', 'DELIVERED'].includes(status);

  switch (type) {
    case 'STORE':
      return canChatWithStore(orderStatus);
    case 'RIDER':
      return canChatWithRider(orderStatus);
    default:
      return false;
  }
};
