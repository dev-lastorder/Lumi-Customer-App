import { LayoutChangeEvent } from 'react-native';

export type OpeningTimes = {
  day: string;
  times: { startTime: string[]; endTime: string[] }[];
};

export type Restaurant = {
  _id: string;
  name: string;
  shopType: string;
  rating: number | null;
  reviewCount: number;
  reviewAverage: number;
  image: string;
  logo: string;
  deliveryTime: number;
  openingTimes: OpeningTimes[];
  minimumOrder: number;
  deliveryInfo: {
    minDeliveryFee: number;
  };
};

export type RestaurantInfoSectionProps = {
  onLayout?: (event: LayoutChangeEvent) => void;
  restaurantData?: Restaurant;
};

export interface CategoryTabItemProps {
  category: string;
  isActive: boolean;
  onSelect: (title: string, index: number) => void;
  onLayout: (event: LayoutChangeEvent) => void;
  index: number;
}

export interface CategoryTabsProps {
  categories: string[];
  activeCategoryTitle: string;
  onSelectCategory: (title: string, index: number) => void;
  handleTabLayout: (tabId: string, event: LayoutChangeEvent) => void;
  onTabBarScrollViewLayout?: (event: LayoutChangeEvent) => void;
}


export interface Coupon {
    _id: string;
    discount: number;
    title: string;
    enabled:boolean;
    lifeTimeActive: boolean;
    startDate: string;
    endDate: string; 
}