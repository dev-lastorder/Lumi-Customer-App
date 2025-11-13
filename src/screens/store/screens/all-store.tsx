import { ScrollView, Text, View } from 'react-native';
import StoreCategoryList from '../components/allStores/StoreCategoryList';
import StoresList from '../components/allStores/StoresList';
import { CustomText, ScreenWrapperWithAnimatedHeader } from '@/components';
import { useDispatch } from 'react-redux';
import { setShowFilters } from '@/redux/slices/storeSlice';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import FilterBottomSheet from '../components/allStores/filterBottomSheet';

const AllStores = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { appliedFilters, appliedSort } = useSelector((state: RootState) => state.store);

  return (
    <ScreenWrapperWithAnimatedHeader
      title={'Stores'}
      showGoBack
      contentContainerStyle={{ marginTop: 20 }}
      onSettingsPress={() => {
        dispatch(setShowFilters(true));
      }}
      onMapPress={() => {
        router.push('/(food-delivery)/(store)/store-map-view');
      }}
      settingsBadge={
        appliedFilters?.length > 0 || appliedSort !== 'Recommended'
          ? Number(appliedFilters?.length) + Number(appliedSort === 'Recommended' ? 0 : 1)
          : ''
      }
    >
      <View className="gap-4">
        <CustomText variant="heading2" fontFamily="Inter" fontWeight="black" className="pl-4">
          All Stores
        </CustomText>
        <StoreCategoryList />
        <StoresList />
      </View>

      <FilterBottomSheet />
    </ScreenWrapperWithAnimatedHeader>
  );
};

export default AllStores;
