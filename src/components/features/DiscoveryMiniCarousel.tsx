import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useRouter, RelativePathString } from 'expo-router';

// Components
import { CustomText } from '../common';
import RestaurantStoreMiniCard from './RestaurantStoreMiniCard';

// Interfaces & Utils
import { IDiscoveryMiniCarousel } from './interface';
import { getValueOrDefault } from '@/utils/methods';
import { DETAILS_ROUTE_BASED_ON_SHOP_TYPE, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils';
import { setSelectedCuisine } from '@/redux/slices/restaurantSlice';
import adjust from '@/utils/helpers/adjust';

// 🔹 Utility: Determines route for a shop type
const getDetailsRoute = (shopType: string): RelativePathString => {
  return getValueOrDefault(DETAILS_ROUTE_BASED_ON_SHOP_TYPE, shopType.toLowerCase(), '/restaurant-details') as RelativePathString;
};

// 🔹 Handler: On MiniCard press
const handleCardPress = (
  item: any,
  type: string,
  shopType: string,
  router: ReturnType<typeof useRouter>,
  dispatch: ReturnType<typeof useDispatch>
) => {
  const id = item?._id?.toString();

  if (type === 'cuisine') {
    dispatch(setSelectedCuisine(item.name));
    router.push(shopType === 'restaurant' ? '/restaurant-home' : '/store-home');
    return;
  }

  router.push({
    pathname: getDetailsRoute(item?.shopType ?? shopType),
    params: { id },
  });
};

const HeaderSection = ({ title, onSeeAllPress }: { title: string; onSeeAllPress: () => void }) => (
  <View className="flex flex-row items-center justify-between" style={{ paddingHorizontal: adjust(16) }}>
    <View className="flex-row items-center flex-1 flex-shrink min-w-0 pr-2">
      <CustomText fontSize="md" fontWeight="semibold" numberOfLines={1} className="flex-shrink">
        {title} 🔥
      </CustomText>
    </View>

    <View className="flex-shrink-0">
      <TouchableOpacity
        onPress={onSeeAllPress}
        className=" bg-bgLight dark:bg-dark-bgLight px-3 py-1 rounded-xl"
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`See all ${title.toLowerCase()}`}
      >
        <CustomText fontSize="xs" fontWeight="medium">
          See All
        </CustomText>
      </TouchableOpacity>
    </View>
  </View>
);

// 🔸 Subcomponent: FlatList of Mini Cards
const MiniCardList = ({
  data,
  type,
  shopType,
  isMini,
  onItemPress,
}: {
  data: any[];
  type: string;
  shopType: string;
  isMini: boolean;
  onItemPress: (item: any) => void;
}) => (
  <View>
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item?._id}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 5, gap: adjust(12), paddingHorizontal: adjust(16) }}
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      renderItem={({ item }) => (
        <RestaurantStoreMiniCard
          item={{
            image: isMini ? item?.logo : item?.image || '',
            name: item?.name,
          }}
          onPress={() => {
            onItemPress(item)}}
        />
      )}
    />
  </View>
);

// 🔹 Main Component: DiscoveryMiniCarousel
export default function DiscoveryMiniCarousel<T>({
  isMini = false,
  title,
  data = [],
  type = 'cuisine',
  shopType = 'restaurant',
  queryArguments,
}: IDiscoveryMiniCarousel<T>) {
  const router = useRouter();
  const dispatch = useDispatch();

  if (!data || data.length === 0) return null;

  const onSeeAll = () => {
    router.push({
      pathname: '/see-all-categories',
      params: {
        title,
        queryArguments: JSON.stringify(queryArguments),
      },
    });
  };

  return (
    <View className="gap-4">
      <HeaderSection title={title} onSeeAllPress={onSeeAll} />
      <MiniCardList
        data={data}
        type={type}
        shopType={shopType}
        isMini={isMini}
        onItemPress={(item) => handleCardPress(item, type, shopType, router, dispatch)}
      />
    </View>
  );
}
