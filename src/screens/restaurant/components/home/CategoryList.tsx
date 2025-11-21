import { View, ScrollView, ActivityIndicator, TouchableOpacity, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_ALL_CUISINES } from '@/api/graphql/query/getAllCuisines';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks';
import { setSelectedCuisine } from '@/redux/slices/restaurantSlice';
import { RootState } from '@/redux';
import CategoryCard from '@/components/features/CategoryCard';
import LoadingCard from '../LoadingCard';
import DisplayErrorCard from '../DisplayErrorCard';
import ItemNotFoundCard from '../ItemNotFoundCard';
import { CustomText } from '@/components';
import { ICategoryListComponentProps } from '../intefaces';
import adjust from '@/utils/helpers/adjust';
import SectionHeader from '@/components/common/SectionHeader';
import { useRouter } from 'expo-router';

interface Cuisine {
  _id: string;
  name: string;
  image: string;
  shopType: string;
}

interface GetAllCuisinesData {
  getAllCuisines: {
    cuisines: Cuisine[];
    currentPage: number;
    totalPages: number;
  };
}



const useCuisines = (shopType: string) => {
  const dispatch = useDispatch();
  const selectedCuisine = useSelector((state: RootState) => state.restaurant.selectedCuisine);

  const { data, loading, error, fetchMore } = useQuery<GetAllCuisinesData>(GET_ALL_CUISINES, {
    variables: { input: { shopType, page: 1, limit: 8 } },
    notifyOnNetworkStatusChange: true,
  });

  const cuisinesData = data?.getAllCuisines;
  const isInitialLoading = loading && !cuisinesData;
  const isFetchingMore = loading && !!cuisinesData;

  const loadMore = useCallback(() => {
    if (isFetchingMore || !cuisinesData || cuisinesData.currentPage >= cuisinesData.totalPages) {
      return;
    }

    fetchMore({
      variables: {
        input: {
          shopType,
          page: cuisinesData.currentPage + 1,
          limit: 5,
        },
      },
    });
  }, [isFetchingMore, cuisinesData, shopType, fetchMore]);

  const handleSelectCuisine = useCallback(
    (cuisineName: string) => {
      const newSelectedCuisine = selectedCuisine === cuisineName ? '' : cuisineName;
      dispatch(setSelectedCuisine(newSelectedCuisine));
    },
    [dispatch, selectedCuisine]
  );

  const clearSelection = useCallback(() => {
    dispatch(setSelectedCuisine(''));
  }, [dispatch]);

  return {
    cuisines: cuisinesData?.cuisines ?? [],
    isLoading: isInitialLoading,
    isFetchingMore,
    error,
    selectedCuisine,
    loadMore,
    selectCuisine: handleSelectCuisine,
    clearSelection,
  };
};

const useScrollEndHandler = (onEndReached: () => void, isFetchingMore: boolean) => {
  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

      if (isNearEnd && !isFetchingMore) {
        onEndReached();
      }
    },
    [onEndReached, isFetchingMore]
  );
};

const LoadMoreIndicator = () => {
  const { primary } = useThemeColor();
  return (
    <View className="flex-1 justify-center items-center p-4">
      <ActivityIndicator size="small" color={primary} />
    </View>
  );
};

const SelectedCuisineChip = ({ name, onClear }: { name: string; onClear: () => void }) => {
  const { primary } = useThemeColor();
  return (
    <View className="bg-white dark:bg-primary/10 px-3 py-1 rounded-full flex-row items-center">
      <CustomText fontSize="xs" fontWeight="medium" className="text-gray-800 dark:text-primary mr-2">
        {name}
      </CustomText>
      <TouchableOpacity onPress={onClear}>
        <AntDesign name="close" size={14} color={primary} />
      </TouchableOpacity>
    </View>
  );
};

export const CategoryList = ({ shopType = 'Restaurant' }: ICategoryListComponentProps) => {
  const { cuisines, isLoading, error } = useCuisines(shopType);
  const router = useRouter();

  const handleCategoryPress = (cuisine: Cuisine) => {
    
  };

  const renderContent = () => {
    if (isLoading) return <LoadingCard message="Loading categories..." />;
    if (error) return <DisplayErrorCard message={error.message || 'Something went wrong'} />;
    if (cuisines.length === 0) return <ItemNotFoundCard message="No categories found" />;

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2" contentContainerStyle={{ gap: adjust(12) }}>
        {cuisines.map((cuisine) => (
          <CategoryCard key={cuisine._id} category={cuisine} onPress={() => handleCategoryPress(cuisine)} />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={{ gap: 4 }}>
      <SectionHeader title="Categories" onSeeAll={() => router.push({ pathname: '/see-all-categories', params: { title: 'All Categories' } })} />
      {renderContent()}
    </View>
  );
};
