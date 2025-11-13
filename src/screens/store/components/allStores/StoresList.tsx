import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';

import { GET_NEARBY_RESTAURANTS_AND_STORE } from '@/api/graphql/query/getNearbyRestaurantsAndStores';
import { useLocationPicker } from '@/hooks/useLocationPicker';
import { RootState } from '@/redux';
import { Restaurant as Store } from '@/utils/interfaces';

import RestaurantStoreCard from '@/components/features/RestaurantStoreCard';
import LocationRequiredCard from '@/screens/restaurant/components/LocationRequiredCard';
import LoadingCard from '@/screens/restaurant/components/LoadingCard';
import DisplayErrorCard from '@/screens/restaurant/components/DisplayErrorCard';
import ItemNotFoundCard from '@/screens/restaurant/components/ItemNotFoundCard';

/* ----------------------------- Hook: useStoreData ---------------------------- */
const useStoreData = () => {
  const {
    location: { latitude, longitude },
  } = useLocationPicker();

  const [restaurants, setRestaurants] = React.useState<Store[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);

  const { appliedFilters, appliedSort, selectedCuisine } = useSelector(
    (state: RootState) => state.store
  );

  const skipQuery = !(latitude && longitude);

  const { loading, data, error, refetch, fetchMore } = useQuery(GET_NEARBY_RESTAURANTS_AND_STORE, {
    variables: {
      input: {
        shopType: 'grocery',
        userLocation: {
          latitude: Number(latitude),
          longitude: Number(longitude),
        },
        page: currentPage,
        filters: appliedFilters,
        sortBy: appliedSort === 'Recommended' ? '' : appliedSort,
        cuisine: selectedCuisine,
      },
    },
    skip: skipQuery,
    onCompleted: ({ getNearbyRestaurantsOrStores }) => {
      const { restaurants, currentPage, totalPages } = getNearbyRestaurantsOrStores;
      setRestaurants(restaurants);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    },
    onError: (err) => {console.error('Error fetching stores:', err);},
  });

  return {
    loading,
    error,
    refetch,
    restaurants,
    isFetchingMore,
    setIsFetchingMore,
    skipQuery,
  };
};

/* -------------------------- UI: StoreListHeader -------------------------- */
const StoreListHeader = () => (
  <View className="px-4">
    <Text className="text-text dark:text-dark-text text-lg font-semibold">Stores</Text>
  </View>
);

/* ------------------------ UI: StoreListContainer ------------------------- */
const StoreListContainer = ({
  stores,
  onPressStore,
  isFetchingMore,
}: {
  stores: Store[];
  onPressStore: (id: string) => void;
  isFetchingMore: boolean;
}) => (
  <View className="relative px-5">
    <FlatList
      data={stores}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <RestaurantStoreCard item={item} onPress={() => onPressStore(item._id)} />
      )}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-4" />}
      className="mt-2 pb-8"
      scrollEnabled={false}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingMore ? (
          <View>
            <Text className="text-text dark:text-dark-text">Loading more...</Text>
          </View>
        ) : null
      }
    />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 100,
      }}
      pointerEvents="none"
    />
  </View>
);

/* ------------------------------- Main Screen ------------------------------ */
const StoresList = () => {
  const router = useRouter();
  const {
    loading,
    error,
    refetch,
    restaurants,
    skipQuery,
    isFetchingMore,
    setIsFetchingMore,
  } = useStoreData();

  const handleStoreCardPress = (id: string) => {
    router.push({
      pathname: '/(food-delivery)/(store)/store-details',
      params: { id },
    });
  };

  const handleRetry = () => {
    refetch();
  };

  const renderContent = () => {
    if (skipQuery) return <LocationRequiredCard />;
    if (loading) return <LoadingCard message="Restaurants loading..." />;
    if (error)
      return (
        <DisplayErrorCard
          message={`Error: ${error.message || 'Something went wrong'}`}
          onRetry={handleRetry}
        />
      );
    if (!restaurants.length) return <ItemNotFoundCard />;
    return (
      <StoreListContainer
        stores={restaurants}
        onPressStore={handleStoreCardPress}
        isFetchingMore={isFetchingMore}
      />
    );
  };

  return (
    <View>
      <StoreListHeader />
      {renderContent()}
    </View>
  );
};

export default StoresList;
