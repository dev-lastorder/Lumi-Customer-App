import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_NEARBY_RESTAURANTS_AND_STORE } from '@/api/graphql/query/getNearbyRestaurantsAndStores';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import RestaurantStoreCard from '@/components/features/RestaurantStoreCard';
import LocationRequiredCard from '../LocationRequiredCard';
import DisplayErrorCard from '../DisplayErrorCard';
import ItemNotFoundCard from '../ItemNotFoundCard';
import LoadingCard from '../LoadingCard';
import SectionHeader from '@/components/common/SectionHeader';
import { useRouter } from 'expo-router';
import { Restaurant } from '@/utils/interfaces';
import { IRestaurantListComponentProps } from '../intefaces';
import adjust from '@/utils/helpers/adjust';



// -----------------
// 🔸 Hooks
// -----------------
const useRestaurantsQuery = (shopType: string, latitude?: number | undefined | string | null, longitude?: number | undefined | string | null) => {
  const { appliedFilters, appliedSort, selectedCuisine } = useSelector((state: RootState) => state.restaurant);

  const skip = !(latitude && longitude);

  const { loading, data, error, refetch, fetchMore } = useQuery(GET_NEARBY_RESTAURANTS_AND_STORE, {
    variables: {
      input: {
        shopType: shopType ?? 'restaurant',
        userLocation: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        page: 1,
        filters: appliedFilters,
        sortBy: appliedSort === 'Recommended' ? '' : appliedSort,
        cuisine: selectedCuisine,
      },
    },
    skip,
  });

  return { loading, data, error, refetch, skip };
};

const useRestaurantNavigation = () => {
  const router = useRouter();

  const goToDetails = (id: string) => {
    router.navigate({
      pathname: '/restaurant-details',
      params: { id },
    });
  };

  return { goToDetails };
};

// -----------------
// 🔸 Components
// -----------------
const RestaurantListView = ({ restaurants, onPressItem }: { restaurants: Restaurant[]; onPressItem: (id: string) => void }) => {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <RestaurantStoreCard item={item} onPress={() => onPressItem(item._id)} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: adjust(16), gap: adjust(16), paddingBottom: adjust(32) }}
      // scrollEnabled={false}
      nestedScrollEnabled={true}
      onEndReachedThreshold={0.5}
    />
  );
};

const RestaurantListContainer = ({
  skip,
  loading,
  error,
  restaurants,
  refetch,
  onItemPress,
}: {
  skip: boolean;
  loading: boolean;
  error?: Error;
  restaurants: Restaurant[];
  refetch: () => void;
  onItemPress: (id: string) => void;
}) => {
  if (skip) return <LocationRequiredCard />;

  if (loading) return <LoadingCard message="Restaurants loading..." />;

  if (error) return <DisplayErrorCard message={`Error: ${error.message || 'Something went wrong'}`} onRetry={refetch} />;

  if (!restaurants.length) return <ItemNotFoundCard />;

  return <RestaurantListView restaurants={restaurants} onPressItem={onItemPress} />;
};

// -----------------
// 🔸 Main Component
// -----------------
const RestaurantList = ({ shopType }: IRestaurantListComponentProps) => {
  const {
    location: { latitude, longitude },
  } = useLocationPicker();

  const { loading, data, error, refetch, skip } = useRestaurantsQuery(shopType ?? 'restaurant', latitude, longitude);
  const { goToDetails } = useRestaurantNavigation();

  const restaurants: Restaurant[] = data?.getNearbyRestaurantsOrStores?.restaurants ?? [];

  // console.log(JSON.stringify(restaurants, null, 2));

  return (
    <View className="flex-1 gap-4">
      <SectionHeader title="Categories" showSeeAll={false} />
      <RestaurantListContainer
        skip={skip}
        loading={loading}
        error={error}
        refetch={() =>
          refetch({
            input: {
              shopType: shopType ?? 'restaurant',
              userLocation: { latitude: Number(latitude), longitude: Number(longitude) },
              page: 1,
            },
          })
        }
        restaurants={restaurants}
        onItemPress={goToDetails}
      />
    </View>
  );
};

export default RestaurantList;
