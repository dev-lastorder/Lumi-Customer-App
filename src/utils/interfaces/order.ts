// src/utils/interfaces/order.ts
export interface OrderTrackingData {
    _id: string;
    orderId: string;
    orderStatus: 'PENDING' | 'ACCEPTED' | 'ASSIGNED' | 'PICKED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'CANCELLEDBYREST';
    restaurant: {
      _id: string;
      name: string;
      image?: string;
      address: string;
      location: {
        coordinates: [string, string]; // [longitude, latitude]
      };
    };
    deliveryAddress: {
      location: {
        coordinates: [string, string]; // [longitude, latitude]
      };
      deliveryAddress: string;
      details?: string;
      label: string;
    };
    items: OrderItem[];
    user?: {
      _id: string;
      name: string;
      phone?: string;
    };
    rider?: {
      _id: string;
      name: string;
      phone?: string;
      location?: {
        coordinates: [string, string];
      };
    };
    orderAmount: number;
    deliveryCharges?: number;
    tipping?: number;
    taxationAmount?: number;
    isPickedUp: boolean;
    completionTime?: string;
    preparationTime?: string;
    expectedTime?: string;
    acceptedAt?: string;
    pickedAt?: string;
    deliveredAt?: string;
    assignedAt?: string;
    instructions?: string;
    createdAt: string;
  }
  
  export interface OrderItem {
    _id: string;
    title: string;
    quantity: number;
    variation: {
      title: string;
      price: number;
    };
    description?: string;
    image?: string;
  }
  
  export interface UseOrderTrackingResult {
    orderData: OrderTrackingData | null;
    loading: boolean;
    error: string | null;
    remainingTime: number;
    statusText: string;
    refetch: () => void;
  }
  
  // Enhanced order status info
  export interface OrderStatusInfo {
    mainText: string;
    subText: string;
    timeText: string;
    canCancel?: boolean;
    canChat?: boolean;
    showRider?: boolean;
  }