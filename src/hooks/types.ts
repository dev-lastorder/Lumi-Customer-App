// src/hooks/useTabScrollSync/types.ts
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import Animated from 'react-native-reanimated'; // Or import ScrollView from 'react-native' if not using Reanimated

// Define or import MenuCategory to match your data structure
// This is a placeholder; ensure it matches your actual `MenuCategory` from `dummyRestaurantData.ts`
export interface MenuItemSummary {
  // Assuming menu items have at least an ID
  id: number | string;
  // ... other properties of menu items if needed for type completion
}

export interface MenuCategory {
  id: string; // Unique identifier for the category
  title: string; // This will be used as the ID for sections/tabs
  data: MenuItemSummary[]; // The actual items in the category
  // ... any other properties your MenuCategory might have
}

export interface TabItemLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  measured: boolean;
}

export type TabItemLayoutsMap = Record<string, TabItemLayout | undefined>; // Key is section title
export type SectionOffsetsMap = Record<string, number | undefined>; // Key is section title

export interface UseTabScrollSyncProps {
  sections: MenuCategory[]; // Now expects an array of MenuCategory
  initialActiveTabId?: string | null; // Represents a section title
  scrollThresholdFactor?: number;
  tabBarItemMarginHorizontal?: number;
  onOffsetsCalculated?: (offsets: SectionOffsetsMap) => void;
}

export interface UseTabScrollSyncReturn {
  activeTab: string | null; // Represents a section title
  scrollViewRef: React.RefObject<Animated.ScrollView | null>; // Using Reanimated ScrollView
  tabScrollViewRef: React.RefObject<Animated.ScrollView | null>; // Using Reanimated ScrollView
  getSectionRef: (sectionTitle: string) => (el: View | null) => void;
  handleTabPress: (sectionTitle: string) => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleMomentumScrollEnd: () => void;
  handleSectionLayout: (sectionTitle: string, event?: LayoutChangeEvent) => void;
  handleTabLayout: (sectionTitle: string, event: LayoutChangeEvent) => void;
  handleTabBarLayout: (event: LayoutChangeEvent) => void;
  handleContentScrollViewLayout: (event: LayoutChangeEvent) => void;
  handleContentScrollViewContentSizeChange: (w: number, h: number) => void;
  tabItemLayouts: TabItemLayoutsMap;
}
