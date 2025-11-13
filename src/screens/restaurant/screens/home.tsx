import { View } from 'react-native';
import { CategoryList } from '../components/home/CategoryList';
import RestaurantList from '../components/home/RestaurantList';
import { CustomText, ScreenWrapperWithAnimatedHeader } from '@/components';
import { useDispatch } from 'react-redux';
import { setShowFilters } from '@/redux/slices/restaurantSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FilterBottomSheet from '../components/home/filterBottomSheet';
import { IShopType } from '@/screens/discovery/components/shop-types/interface';

const Home = () => {
  // Params
  const params = useLocalSearchParams();
  const shopType: IShopType = params?.shopType ? JSON.parse(params?.shopType as string) : {};

  // Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  const { appliedFilters, appliedSort } = useSelector((state: RootState) => state.restaurant);

  return (
    <ScreenWrapperWithAnimatedHeader
      title={shopType?.title ?? 'Restaurants'}
      location={'Pakistan'}
      showGoBack
      contentContainerStyle={{ marginTop: 20 }}
      onSettingsPress={() => dispatch(setShowFilters(true))}
      onMapPress={() => router.push('/(food-delivery)/(restaurant)/restaurant-map-view')}
      settingsBadge={
        appliedFilters?.length > 0 || appliedSort !== 'Recommended'
          ? Number(appliedFilters?.length) + Number(appliedSort === 'Recommended' ? 0 : 1)
          : ''
      }
    >
      <View className="gap-4">
        <CustomText variant="heading2" fontFamily="Inter" fontWeight="black" className="pl-4">
          {shopType?.title ?? 'Restaurants'}
        </CustomText>
        <CategoryList shopType={shopType?.title} />
        <RestaurantList shopType={shopType?.title} />
      </View>

      {/* Bottom Sheet */}
      <FilterBottomSheet />
    </ScreenWrapperWithAnimatedHeader>
  );
};

export default Home;
