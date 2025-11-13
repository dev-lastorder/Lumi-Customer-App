export interface Restaurant {
  _id: string;
  name: string;
  image: string;
  address?: string;
  description?: string;
  deliveryTime?: number;
  totalOrders: number;
  reviewAverage: number;
  minimumOrder: number;
  status: string;
  subTitle: string;
  location?: {
    coordinates: number[];
  };
  deliveryInfo?: {
    minDeliveryFee: number;
  };
  openingTimes?: {
    day: string;
    times: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  options?: {
    _id: string;
    description: string;
    isOutOfStock: boolean;
    price: number;
    title: string;
  }[];
  addons?: {
    _id: string;
    description: string;
    isOutOfStock: boolean;
    options: any; // You can further type this if needed
    quantityMaximum: number;
    quantityMinimum: number;
    title: string;
  }[];
  categories?: {
    _id: string;
    foods: {
      _id: string;
      currency: string;
      description: string;
      image: string;
      isActive: boolean;
      isOutOfStock: boolean;
      price: number;
      restaurantId: string;
      restaurantName: string;
      subCategory: string;
      title: string;
      updatedAt: string;
      variations: {
        _id: string;
        addons: any; // You can further type this if needed
        discounted: number;
        isOutOfStock: boolean;
        price: number;
        title: string;
      }[];
    }[];
  }[];
  deliveryOptions?: {
    pickup: Boolean;
    delivery: Boolean;
  };
}
