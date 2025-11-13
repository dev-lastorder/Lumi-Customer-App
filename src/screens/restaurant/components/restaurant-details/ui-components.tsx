// @ts-nocheck
import React, { useMemo, useCallback, memo, forwardRef } from 'react';
import { View, LayoutChangeEvent, Pressable, Image as RNImage, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { CustomIcon, CustomText, SomethingWentWrong } from '@/components';
import { MenuCategory, MenuItem } from '../../interfaces/restaurant-details';
import { useAppSelector } from '@/redux';
import { PanGestureHandler } from 'react-native-gesture-handler';
import adjust from '@/utils/helpers/adjust';
import { useDispatch } from 'react-redux';
import { setQuantity, selectQuantityByProduct } from '@/redux';
import { getBaseVariationIdForItem } from '@/utils';
import { useQuantityDispatch, useSwipeGesture } from '../../hooks';
import { SWIPE_THRESHOLD } from '../../constants';

const MenuItemCard = memo<MenuItemCardProps>(({ name, description, price, image, isLastItem, onPress, quantityInCart }) => {
  return (
    <Pressable
      onPress={onPress}
      className={`
        flex-row items-start px-4 py-5 bg-background dark:bg-dark-background
        ${!isLastItem ? 'border-b border-border dark:border-dark-grey/30' : ''}
      `}
    >
      <View className="flex-1 pr-4">
        <CustomText fontSize="lg" fontWeight="bold" className="text-text dark:text-dark-text mb-1.5" isDefaultColor={false}>
          {name}
        </CustomText>
        <CustomText fontSize="sm" className="text-text dark:text-dark-text mb-2.5 leading-snug" isDefaultColor={false} numberOfLines={3}>
          {description}
        </CustomText>
        <CustomText fontSize="md" fontWeight="bold" className="text-primary dark:text-dark-primary" isDefaultColor={false}>
          {price}
        </CustomText>
      </View>
      <View className="relative">
        {image && <RNImage source={{ uri: image }} className="w-28 h-28 rounded-xl" resizeMode="cover" />}
        {quantityInCart > 0 && (
          <View className="absolute -top-1.5 -right-1.5 bg-primary rounded-full w-6 h-6 flex items-center justify-center border-2 border-background dark:border-dark-background">
            <CustomText isDefaultColor={false} className="text-white font-bold text-xs">
              {quantityInCart}
            </CustomText>
          </View>
        )}
      </View>
    </Pressable>
  );
});

const CategoryTabItem = ({ category, isActive, onSelect, onLayout, index }: CategoryTabItemProps) => {
  const handlePress = () => onSelect(category, index);

  return (
    <TouchableOpacity
      key={category}
      onLayout={onLayout}
      onPress={handlePress}
      className={`py-2 px-4 rounded-full mr-2.5 items-center justify-center transition-colors duration-200 ${isActive ? 'bg-primary dark:bg-dark-primary' : 'bg-background-card dark:bg-dark-background-card border border-border dark:border-dark-border/30'
        }`}
    >
      <CustomText
        fontWeight={isActive ? 'bold' : 'medium'}
        fontSize="sm"
        className={isActive ? 'text-button-text dark:text-dark-button-text' : 'text-text dark:text-dark-text'}
        isDefaultColor={false}
      >
        {category}
      </CustomText>
    </TouchableOpacity>
  );
};

const CategoryTabs = forwardRef<Animated.ScrollView, CategoryTabsProps>(
  ({ categories, activeCategoryTitle, onSelectCategory, handleTabLayout, onTabBarScrollViewLayout }, scrollRef) => (
    <View className="bg-background dark:bg-dark-background">
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={onTabBarScrollViewLayout}
        className="py-3 border-b border-border dark:border-dark-border/30"
        contentContainerClassName="px-4 items-center"
      >
        {categories.map((category, index) => (
          <CategoryTabItem
            key={`${category}-${index}`}
            category={category}
            isActive={category === activeCategoryTitle}
            onSelect={onSelectCategory}
            onLayout={(event) => handleTabLayout(category, event)}
            index={index}
          />
        ))}
      </Animated.ScrollView>
    </View>
  )
);

// Memoized for performance to prevent re-renders on scroll
export const MenuSectionHeader: React.FC<{ section: MenuCategory }> = React.memo(({ section }) => (
  <View className="px-4 py-5 bg-background-alt dark:bg-dark-background-alt border-t border-b border-border dark:border-dark-border/30">
    <CustomText variant="heading2" fontWeight="bold" className="text-text dark:text-dark-text" isDefaultColor={false}>
      {section.title}
    </CustomText>
  </View>
));

// Memoized for performance to prevent re-renders on scroll
export const MenuItemRenderer: React.FC<{
  item: MenuItem;
  index: number;
  section: MenuCategory;
  itemQuantities: Record<string, number>;
  onItemPress: (item: MenuItem) => void;
}> = React.memo(({ item, index, section, itemQuantities, onItemPress }) => {
  const configuration = useAppSelector((state) => state.configuration.configuration);
  const currentQuantity = itemQuantities[item.id] || 0;

  const { increaseQuantity } = useQuantityDispatch(item, currentQuantity);
  const { gestureHandler, animatedStyle, checkIconStyle } = useSwipeGesture(increaseQuantity);

  return (
    <View className={currentQuantity > 0 ? 'pl-1 bg-primary dark:bg-dark-primary' : 'bg-primary dark:bg-dark-primary'}>
      <View className="absolute inset-0 justify-center items-start">
        <Animated.View
          className="bg-card dark:bg-dark-card rounded-full justify-center items-center"
          style={[{ width: adjust(28), height: adjust(28) }, checkIconStyle]}
        >
          {currentQuantity > 0 ? (
            <CustomText fontSize="sm" fontFamily="Inter" fontWeight="semibold" className="text-primary" isDefaultColor={false}>
              +1
            </CustomText>
          ) : (
            <CustomIcon icon={{ name: 'check', type: 'MaterialIcons', size: adjust(16) }} className="text-primary" />
          )}
        </Animated.View>
      </View>
      <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-SWIPE_THRESHOLD, SWIPE_THRESHOLD]}>
        <Animated.View style={[animatedStyle]}>
          <MenuItemCard
            name={item.name}
            description={item.description}
            price={`${configuration?.currencySymbol || '$'}${item.price.toFixed(2)}`}
            image={item.image}
            isLastItem={index === section.data.length - 1}
            onPress={() => onItemPress(item)}
            quantityInCart={itemQuantities[item.id] || 0}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
});

export const CategoryTabsContainer: React.FC<{
  categories: MenuCategory[];
  activeTab: string | null;
  tabScrollViewRef: React.RefObject<Animated.ScrollView>;
  onTabPress: (tabId: string) => void;
  onTabLayout: (tabId: string, event: LayoutChangeEvent) => void;
  onTabBarLayout: (event: LayoutChangeEvent) => void;
}> = ({ categories, activeTab, tabScrollViewRef, onTabPress, onTabLayout, onTabBarLayout }) => {
  const categoryTitles = useMemo(() => categories.map((cat) => cat.title), [categories]);
  const currentActiveCategoryTitle = useMemo(
    () => categories.find((sec) => sec.id === activeTab)?.title || categoryTitles[0] || '',
    [activeTab, categoryTitles, categories]
  );
  const onSelectCategoryTab = useCallback(
    (title: string) => {
      const category = categories.find((sec) => sec.title === title);
      if (category) onTabPress(category.id);
    },
    [onTabPress, categories]
  );
  const handleCategoryTabLayout = useCallback(
    (title: string, event: LayoutChangeEvent) => {
      const category = categories.find((sec) => sec.title === title);
      if (category) onTabLayout(category.id, event);
    },
    [onTabLayout, categories]
  );
  return (
    <CategoryTabs
      ref={tabScrollViewRef}
      categories={categoryTitles}
      activeCategoryTitle={currentActiveCategoryTitle}
      onSelectCategory={onSelectCategoryTab}
      handleTabLayout={handleCategoryTabLayout}
      onTabBarScrollViewLayout={onTabBarLayout}
    />
  );
};

// Error Boundary Components
export const ErrorFallback: React.FC<{ error?: any }> = ({ error }) => {

  return <SomethingWentWrong title="Something went wrong" description="Failed to load restaurant details." />;
};

export const NoDataFallback: React.FC = () => <SomethingWentWrong title="No Data Found" description="This restaurant's menu could not be loaded." />;
