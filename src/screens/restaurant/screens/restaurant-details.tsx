// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ViewabilityConfig, ViewToken, SectionList } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingPlaceholder, NoInternetConnection } from '@/components';
import CollapsibleImageHeaderWithControls from '@/components/common/CollapsibleImageHeaderWithControls';
import CartPopUp from '@/components/common/cartPopUp';
import RestaurantInfoSection from '../components/restaurant-details/RestaurantInfoSection';
import { useRestaurantFavourite } from '@/api';
import { DEFAULT_IMAGE_AREA_HEIGHT, DEFAULT_STICKY_HEADER_HEIGHT } from '@/components/common/constants';
import { useNetworkStatus } from '@/hooks';
import { openProductDetailModal } from '@/redux/slices/productModalSlice';
import { useAppDispatch, useAppSelector } from '@/redux';
import { getBaseVariationIdForItem } from '@/utils';
import { MenuItem } from '../interfaces/restaurant-details';
import { MenuCategory } from './interfaces';
import { useRestaurantData, useCartState, useTabBarLayout } from '../hooks';
import { AnimatedSectionList, CATEGORY_TABS_HEIGHT } from '../constants';
import { createProductFromMenuItem } from '../utils';
import {
  CategoryTabsContainer,
  ErrorFallback,
  MenuSectionHeader,
  MenuItemRenderer,
  NoDataFallback,
} from '../components/restaurant-details/ui-components';

const FluctusRestaurantScreen: React.FC = () => {
  const isConnected = useNetworkStatus();
  const { onToggleFavourite } = useRestaurantFavourite();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams();
  const restaurantId = typeof id === 'string' ? id : undefined;
  const insets = useSafeAreaInsets();
  const configuration = useAppSelector((state) => state.configuration.configuration);

  // Refs and State
  const sectionListRef = useRef<SectionList<MenuItem, MenuCategory>>(null);
  const isManualScrolling = useRef(false);
  const scrollEndTimer = useRef<NodeJS.Timeout | null>(null);
  const [headerContentHeight, setHeaderContentHeight] = useState(0);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Custom Hooks for data, cart, and layout
  const { loading, error, restaurantInfo, categories } = useRestaurantData(restaurantId);
  const { itemQuantities, defaultAddonIds } = useCartState(restaurantId, categories);
  const { tabScrollViewRef, handleTabLayout, handleTabBarLayout } = useTabBarLayout(categories, activeTab);
  const scrollY = useSharedValue(0);

  // Set initial active tab
  useEffect(() => {
    if (!activeTab && categories.length > 0) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);

  // Animation
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Sticky Header Logic
  const showStickyTabsThreshold = useMemo(
    () =>
      headerContentHeight > 0
        ? DEFAULT_IMAGE_AREA_HEIGHT + headerContentHeight - (DEFAULT_STICKY_HEADER_HEIGHT + insets.top)
        : Number.MAX_SAFE_INTEGER,
    [headerContentHeight, insets.top]
  );

  const animatedStickyTabsStyle = useAnimatedStyle(() => {
    const isVisible = scrollY.value >= showStickyTabsThreshold;
    return {
      opacity: isVisible ? 1 : 0,
      transform: [{ translateY: isVisible ? 0 : -10 }],
      pointerEvents: isVisible ? 'auto' : 'none',
    };
  });

  // Event Handlers
  const handleTabPress = useCallback(
    (tabId: string) => {
      const sectionIndex = categories.findIndex((s) => s.id === tabId);
      if (sectionIndex !== -1 && sectionListRef.current) {
        isManualScrolling.current = true;
        setActiveTab(tabId);
        sectionListRef.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
          viewOffset: DEFAULT_STICKY_HEADER_HEIGHT + insets.top + CATEGORY_TABS_HEIGHT,
          animated: true,
        });
        if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
        scrollEndTimer.current = setTimeout(() => {
          isManualScrolling.current = false;
        }, 700);
      }
    },
    [categories, insets.top]
  );

  const handleMenuItemPress = useCallback(
    (item: MenuItem) => {
      const product = createProductFromMenuItem(item, configuration?.currencySymbol, restaurantId);
      const quantityOfBaseConfigInCart = itemQuantities[item.id] || 0;
      const isEditing = quantityOfBaseConfigInCart > 0;
      const baseVariationId = getBaseVariationIdForItem(item);
      dispatch(
        openProductDetailModal({
          product,
          initialQuantity: isEditing ? quantityOfBaseConfigInCart : 1,
          initialVariationId: isEditing ? baseVariationId : product.variations[0]?.id,
          initialAddonIds: isEditing ? defaultAddonIds : undefined,
          actionType: isEditing ? 'edit' : 'add',
        })
      );
    },
    [itemQuantities, restaurantInfo, defaultAddonIds, dispatch, restaurantId]
  );

  const viewabilityConfig = useRef<ViewabilityConfig>({ viewAreaCoveragePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (isManualScrolling.current || viewableItems.length === 0) return;
    const topSectionId = viewableItems[0].section?.id;
    if (topSectionId && activeTab !== topSectionId) {
      setActiveTab(topSectionId);
    }
  }).current;

  // Memoized Render Components
  const keyExtractor = useCallback((item: MenuItem, index: number) => `${item.id}-${index}`, []);
  const renderItem = useCallback(
    ({ item, index, section }) => (
      <MenuItemRenderer item={item} index={index} section={section} itemQuantities={itemQuantities} onItemPress={handleMenuItemPress} />
    ),
    [itemQuantities, handleMenuItemPress]
  );
  const renderSectionHeader = useCallback(({ section }) => <MenuSectionHeader section={section} />, []);
  const ListHeaderComponent = useMemo(
    () => (
      <>
        <View style={{ height: DEFAULT_IMAGE_AREA_HEIGHT * 1.1 }} />
        <RestaurantInfoSection onLayout={(e) => setHeaderContentHeight(e.nativeEvent.layout.height)} restaurantData={restaurantInfo?.restaurant} />
        {/* <CategoryTabsContainer
          categories={categories}
          activeTab={activeTab}
          tabScrollViewRef={tabScrollViewRef}
          onTabPress={handleTabPress}
          onTabLayout={handleTabLayout}
          onTabBarLayout={handleTabBarLayout}
        /> */}
      </>
    ),
    [restaurantInfo, categories, activeTab, handleTabPress, handleTabLayout, handleTabBarLayout]
  );
  const ListFooterComponent = useMemo(() => <View style={{ height: insets.bottom + 32 }} />, [insets.bottom]);

  // Early returns
  if (!isConnected && !restaurantInfo) return <NoInternetConnection />;
  if (loading) return <LoadingPlaceholder />;
  if (error) return <ErrorFallback error={error} />;
  if (!restaurantInfo?.restaurant || categories.length === 0) return <NoDataFallback />;

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <AnimatedSectionList
        ref={sectionListRef}
        sections={categories}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        className="bg-background dark:bg-dark-background"
        removeClippedSubviews
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={7}
      />

      <CollapsibleImageHeaderWithControls
        restaurantInfo={{
          bannerImageSource: restaurantInfo.restaurant.image,
          logoImageSource: restaurantInfo.restaurant.logo,
          title: restaurantInfo.restaurant.name,
          restaurantId: restaurantInfo.restaurant._id,
          imageAreaHeight: DEFAULT_IMAGE_AREA_HEIGHT,
          stickyHeaderHeight: DEFAULT_STICKY_HEADER_HEIGHT,
        }}
        scrollY={scrollY}
        onBackPress={() => router.back()}
        onHeartPress={() => onToggleFavourite(restaurantInfo.restaurant._id)}
        onMorePress={() => router.push({ pathname: '/restaurant-reviews', params: { info: JSON.stringify(restaurantInfo.restaurant) } })}
        onSearchPress={() => router.push({ pathname: '/items-search', params: { restaurantId, shopType: 'restaurant' } })}
      />

      {/* Sticky Tabs Header */}
      <Animated.View
        style={[
          { position: 'absolute', top: DEFAULT_STICKY_HEADER_HEIGHT + insets.top, left: 0, right: 0, height: CATEGORY_TABS_HEIGHT, zIndex: 5 },
          animatedStickyTabsStyle,
        ]}
      >
        <CategoryTabsContainer
          categories={categories}
          activeTab={activeTab}
          tabScrollViewRef={tabScrollViewRef}
          onTabPress={handleTabPress}
          onTabLayout={handleTabLayout}
          onTabBarLayout={handleTabBarLayout}
        />
      </Animated.View>

      <CartPopUp />
    </View>
  );
};

export default FluctusRestaurantScreen;
