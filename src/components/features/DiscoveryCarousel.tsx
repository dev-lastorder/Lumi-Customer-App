import { Href, RelativePathString, useRouter } from 'expo-router';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

import { CustomCarousel, CustomIcon, CustomText } from '../common';
import RestaurantStoreCard from './RestaurantStoreCard';

import { IDiscoveryCarousel } from './interface';
import { IDiscoveryPreview, Restaurant } from '@/utils/interfaces';

import { getValueOrDefault } from '@/utils/methods';
import { DETAILS_ROUTE_BASED_ON_SHOP_TYPE, SCREEN_WIDTH } from '@/utils';
import adjust from '@/utils/helpers/adjust';
import { IRestaurant } from './AnimatedRestaurantCard';

const useDiscoveryNavigation = () => {
  const router = useRouter();

  const goToDetails = (id: string, shopType: string) => {
    const route = getValueOrDefault(DETAILS_ROUTE_BASED_ON_SHOP_TYPE, shopType.toLowerCase(), '/restaurant-details') as RelativePathString;
    console.log(route)
    router.push({ pathname: route, params: { id: String(id) } });
  };

  const goToSeeAll = (title: string, queryArguments: any) => {
    router.push({
      pathname: '/see-all',
      params: { title, queryArguments: JSON.stringify(queryArguments) },
    });
  };

  return { goToDetails, goToSeeAll };
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

const StoreCarouselItem = ({ item, onPress }: { item: Restaurant; onPress: () => void }) => (
  <View className="">
    <RestaurantStoreCard
      style={{ width: SCREEN_WIDTH * 0.8 }}
      item={item}
      onPress={onPress}
      showFavIcon={false}
    />
  </View>
);

export default function DiscoveryCarousel<T>(props: IDiscoveryCarousel<T>) {
  const { title, data = [], queryArguments } = props;
  const { goToDetails, goToSeeAll } = useDiscoveryNavigation();



  const handleStorePress = (item: IDiscoveryPreview) => {
    goToDetails(item._id?.toString(), item?.shopType ?? '');
  };

  const handleSeeAllPress = () => {
    goToSeeAll(title, queryArguments);
  };

  // console.log(JSON.stringify(data, null, 2))

  if (!data || data.length === 0) return null;

  return (
    <View className="gap-4" style={{}} accessibilityLabel={`${title} section`}>
      <HeaderSection title={title} onSeeAllPress={handleSeeAllPress} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: adjust(12), paddingHorizontal: adjust(16) }}>
        {data.map((item, index) => (
          <StoreCarouselItem key={item._id?.toString() || index.toString()} item={item} onPress={() => handleStorePress(item)} />
        ))}
      </ScrollView>
    </View>
  );
}
