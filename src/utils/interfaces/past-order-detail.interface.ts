export interface PODRestaurant {
  _id: string;
  name: string;
  image: string;
  address: string;
  location: {
    coordinates: [string, string];
  };
  phone?: string;
}

export interface PODRider {
  _id: string;
  name: string;
  phone: string;
}

export interface PODAddonOption {
  _id: string;
  title: string;
  price: number;
}

export interface PODAddon {
  _id: string;
  title: string;
  options: PODAddonOption[];
}

export interface PODItemVariation {
  title: string;
  price: number;
}

export interface PODOrderItem {
  _id: string;
  title: string;
  image: string;
  name: string;
  price: string;
  quantity: number;
  variation: PODItemVariation;
  addons: PODAddon[];
}

export interface PODDeliveryAddress {
  deliveryAddress: string;
  details: string | null;
  label: string;
  location: {
    coordinates: [string, string];
  };
}

export interface PODReview {
  _id: string;
  createdAt: string;
  description: string;
  isActive: boolean;
  rating: number;
  updatedAt: string;
}

export interface PODPastOrder {
  _id: string;
  orderId: string;
  restaurant: PODRestaurant;
  orderStatus: string;
  orderDate: string;
  completionTime: string;
  preparationTime: string;
  expectedTime: string;
  isPickedUp: boolean;
  rider: PODRider;
  items: PODOrderItem[];
  orderAmount: number;
  deliveryCharges: number;
  tipping: number;
  taxationAmount: number;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: PODDeliveryAddress;
  acceptedAt: string;
  assignedAt: string;
  cancelledAt: string;
  deliveredAt: string;
  id: string | null;
  isActive: boolean;
  isRiderRinged: boolean;
  isRinged: boolean;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  pickedAt: string;
  reason: string | null;
  status: string | null;
  review: PODReview;
  selectedPrepTime: number;
}
