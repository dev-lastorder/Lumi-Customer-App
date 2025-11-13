// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useDispatch } from 'react-redux';

import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useQuery } from '@apollo/client';
import { shallowEqual } from 'react-redux';
import { selectQuantityByProduct, setCartPopupVisibility, setQuantity, useAppDispatch, useAppSelector } from '@/redux';
import { GET_RESTAURANT_DETAILS, GET_RESTAURANT_CATEGORIES_WITH_ITEMS } from '@/api';
import { getBaseVariationIdForItem } from '@/utils';
import { Product, ProductVariation } from '@/utils/interfaces/product-detail';
import { GetRestaurantCategoriesWithItemsAPIResponse, MenuItem, MenuCategory } from '../interfaces/restaurant-details';
import { TabLayout, TabItemLayoutsMap } from './interfaces';
import { transformCategoriesData } from './utils';
import { SWIPE_THRESHOLD } from './constants';

// =====================================================================================
// HOOKS
// =====================================================================================
export const useRestaurantData = (restaurantId?: string) => {
  const {
    loading: restaurantLoading,
    error: restaurantError,
    data: restaurantInfo,
  } = useQuery(GET_RESTAURANT_DETAILS, {
    variables: { id: restaurantId },
    skip: !restaurantId,
  });

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery<GetRestaurantCategoriesWithItemsAPIResponse>(GET_RESTAURANT_CATEGORIES_WITH_ITEMS, {
    variables: { input: { restaurantId } },
    skip: !restaurantId,
  });

  const transformedCategories = useMemo(() => transformCategoriesData(categoriesData), [categoriesData]);

  return {
    loading: restaurantLoading || categoriesLoading,
    error: restaurantError || categoriesError,
    restaurantInfo,
    categories: transformedCategories,
  };
};

export const useCartState = (restaurantId?: string, categories?: MenuCategory[]) => {
  const dispatch = useAppDispatch();
  const currentRestaurantId = useAppSelector((state) => state.cart.currentRestaurantId);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const defaultAddonIds: string[] = [];

  const itemQuantities = useAppSelector((state) => {
    const result: Record<string, number> = {};
    categories?.forEach((category) =>
      category?.data?.forEach((menuItem) => {
        const baseVariationId = getBaseVariationIdForItem(menuItem);
        result[menuItem.id] = selectQuantityByProduct(state, menuItem.id, baseVariationId, defaultAddonIds);
      })
    );
    return result;
  }, shallowEqual);

  useEffect(() => {
    const shouldShowPopup = totalQuantity > 0 && restaurantId === currentRestaurantId;
    dispatch(setCartPopupVisibility(shouldShowPopup));
  }, [totalQuantity, restaurantId, currentRestaurantId, dispatch]);

  return { itemQuantities, defaultAddonIds };
};

export const useTabBarLayout = (sections: MenuCategory[], activeTab: string | null) => {
  const [tabItemLayouts, setTabItemLayouts] = useState<TabItemLayoutsMap>({});
  const [tabBarScrollViewWidth, setTabBarScrollViewWidth] = useState<number>(0);
  const tabScrollViewRef = useRef<Animated.ScrollView | null>(null);

  const handleTabLayout = useCallback((tabId: string, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setTabItemLayouts((prev) => (prev[tabId]?.measured ? prev : { ...prev, [tabId]: { x, y, width, height, measured: true } }));
  }, []);

  const handleTabBarLayout = useCallback((event: LayoutChangeEvent) => setTabBarScrollViewWidth(event.nativeEvent.layout.width), []);

  useEffect(() => {
    if (!activeTab || !tabScrollViewRef.current || tabBarScrollViewWidth === 0) return;
    const activeTabLayout = tabItemLayouts[activeTab];
    if (!activeTabLayout?.measured) return;
    const activeTabCenter = activeTabLayout.x + activeTabLayout.width / 2;
    const targetScrollX = Math.max(0, activeTabCenter - tabBarScrollViewWidth / 2);
    tabScrollViewRef.current?.scrollTo({ x: targetScrollX, animated: true });
  }, [activeTab, tabItemLayouts, tabBarScrollViewWidth]);

  return { tabScrollViewRef, handleTabLayout, handleTabBarLayout };
};

export const useQuantityDispatch = (item: MenuItem, currentQuantity: number) => {
  const dispatch = useDispatch();
  const variationId = getBaseVariationIdForItem(item);
  const addonIds: string[] = [];

  const increaseQuantity = () => {
    dispatch(
      setQuantity({
        product: item,
        variationId,
        selectedAddonIds: addonIds,
        quantity: currentQuantity + 1,
      })
    );
  };

  return { increaseQuantity };
};

export const useSwipeGesture = (onSwipeRight: () => void) => {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      if (translateX.value > SWIPE_THRESHOLD) {
        runOnJS(onSwipeRight)();
      }
      translateX.value = withTiming(0, { duration: 200 });
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const checkIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value / 8 }],
    opacity: interpolate(translateX.value, [SWIPE_THRESHOLD * 0.4, SWIPE_THRESHOLD * 1.2], [0, 1], Extrapolation.CLAMP),
  }));

  return { gestureHandler, animatedStyle, checkIconStyle };
};
