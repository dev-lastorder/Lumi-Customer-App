// --- UPDATED TYPE DEFINITIONS BASED ON YOUR API CONTEXT & HOOK REQUIREMENTS ---

import { Product } from '@/utils/interfaces/product-detail';
import { LayoutChangeEvent } from 'react-native';

// Local types for components (MenuCategory and MenuItem)
// We've changed 'restaurantInfo' to 'data' in MenuCategory to match src/hooks/types.ts
export interface MenuItem {
  id: string;
  name: string; // Your components expect 'name'
  description: string;
  price: number;
  image?: string; // This can be a URL string or undefined
  isOutOfStock?: boolean;
  // variations are not used by MenuItemCard, so we don't necessarily need to map them here
}

export interface MenuCategory {
  id: string;
  title: string;
  data: MenuItem[]; // *** CHANGED FROM 'restaurantInfo' TO 'data' ***
}

export interface APIRestaurantCategoryData {
  id: string; // The category's ID
  title: string; // The category's title
  isActive: boolean;
  data: Product[]; // The array of menu items for this category is under 'data'
}

export interface GetRestaurantCategoriesWithItemsAPIResponse {
  getRestaurantCategoriesWithItems: {
    status: boolean;
    error: string | null;
    data: APIRestaurantCategoryData[]; // Array of category objects
  };
}
// --- END UPDATED TYPE DEFINITIONS ---


export interface MenuCategory {
    id: string;
    title: string;
    data: MenuItem[];
}

export interface TabLayout {
    x: number;
    y: number;
    width: number;
    height: number;
    measured: boolean;
}

export type TabItemLayoutsMap = Record<string, TabLayout>;





export interface MenuItemCardProps {
  name: string;
  description: string;
  price: string | number;
  image?: string;
  isLastItem: boolean;
  onPress?: () => void;
  quantityInCart?: number;
}


export interface CategoryTabItemProps {
  category: string;
  isActive: boolean;
  onSelect: (category: string, index: number) => void;
  onLayout: (event: LayoutChangeEvent) => void;
  index: number;
}

export interface CategoryTabsProps {
  categories: string[];
  activeCategoryTitle: string;
  onSelectCategory: (category: string, index: number) => void;
  handleTabLayout: (category: string, event: LayoutChangeEvent) => void;
  onTabBarScrollViewLayout?: (event: LayoutChangeEvent) => void;
}