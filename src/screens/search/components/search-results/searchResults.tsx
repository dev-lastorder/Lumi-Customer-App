// Cores
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
// Components
import { CardFilteredRestaurant } from '../card-filteredrestaurants';
import { LoadingPlaceholder, SomethingWentWrong } from '@/components';
import { CardFilteredFoodGrid } from '../card-filteredFoodGrid';
// Hooks & Apis
import useGetFilteredRestaurants from '@/api/hooks/useGetFilteredRestaurants';
import { IRestaurant, IPropsSearchResults } from '@/api/hooks/interfaces/filteredRestaurants';
import { Product } from '@/utils/interfaces/product-detail';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, useAppSelector } from '@/redux';
import { useRouter } from 'expo-router';
import { openProductModal } from '@/utils/helpers/openProductModal';
import { useQuery } from '@apollo/client';
import { GET_FILTERED_RESTAURANTS } from '@/api';

const searchResults: React.FC<IPropsSearchResults> = ({ keyword, saveSearch, locationPicker, setSeeAllFoods, seeAllFoods, setIsFocus }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [foods, setFoods] = useState<Product[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);


  const dispatch = useDispatch();


  const handleFoodItemPress = (item: Product) => {
    openProductModal(dispatch, item);
  };

  const onRestaurantPress = (id: string) => {
    router.push({
      pathname: "/restaurant-details",
      params: { id }
    })
  };

  const { commitFilter: shopType, commitSort, commitOpenOnly } = useSelector((state: RootState) => state.search)

  const {
    data,
    error,
    loading,
    fetchMore,
  } = useQuery(GET_FILTERED_RESTAURANTS, {
    variables: {
      input: {
        keyword,
        limit: 15,
        sortBy: commitSort,
        userLocation: {
          longitude: Number(locationPicker?.longitude),
          latitude: Number(locationPicker?.latitude),
        },
        page,
        shopType: shopType === 'all' ? null : shopType,
        status: commitOpenOnly ? 'open' : 'all',
      },
    },
    notifyOnNetworkStatusChange: true,
    skip: !keyword?.trim(),
  });

  // Reset data when keyword changes
  useEffect(() => {
    setRestaurants([]);
    setFoods([]);
    setInitialLoading(true);
    setPage(1);
  }, [keyword]);

  // Handle ONLY initial data load (page 1)
  useEffect(() => {
    if (data && keyword) {
      setRestaurants(data.getFilteredRestaurants?.restaurants || []);
      setFoods(data.getFilteredRestaurants?.foods || []);
      setInitialLoading(false);
    }
  }, [data, keyword]);

  const handleLoadMore = () => {
    const nextPage = (data?.getFilteredRestaurants?.currentPage || 1) + 1;

    fetchMore({
      variables: {
        input: {
          keyword,
          limit: 15,
          sortBy: commitSort,
          userLocation: {
            longitude: Number(locationPicker?.longitude),
            latitude: Number(locationPicker?.latitude),
          },
          page: nextPage,
          shopType: shopType === 'all' ? null : shopType,
          status: commitOpenOnly ? 'open' : 'all',
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        const incoming = fetchMoreResult.getFilteredRestaurants?.restaurants || [];
        setRestaurants((prevRestaurants) => [
          ...(prevRestaurants || []),
          ...incoming,
        ]);
        return {
          getFilteredRestaurants: {
            ...fetchMoreResult.getFilteredRestaurants,
            restaurants: [
              ...(prev.getFilteredRestaurants?.restaurants || []),
              ...incoming,
            ],
            foods: [
              ...(prev.getFilteredRestaurants?.foods || []),
            ],
          },
        };
      },
    });
    setPage(nextPage);
  };

  // Show loading if:
  // 1. It's the initial load and we're loading, OR
  // 2. We're loading and have no data at all
  const shouldShowLoading =
    (initialLoading && loading) ||
    (loading && !data && foods?.length === 0 && restaurants?.length === 0);



  if (shouldShowLoading) {
    return (
      <View className="w-[100%] h-[100%] gap-4">
        <LoadingPlaceholder />
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-[100%] h-[100%] gap-4">
        <SomethingWentWrong
          title="Something went wrong"
          description={'An error has interrupted your experience. Please refresh or try again. We appreciate your patience'}
          imageSource={require('@/assets/GIFs/no-data-at-this-location.gif')}
          imageStyles={{ height: 300, width: 300 }}
        />
      </View>
    );
  }

  const filterData = data?.getFilteredRestaurants;

  return (
    <View className="w-[100%] h-[100%] gap-4">
      {seeAllFoods ? (
        <CardFilteredFoodGrid foodsData={foods} saveSearch={saveSearch} onFoodPress={handleFoodItemPress} />
      ) : (
        <CardFilteredRestaurant
          data={restaurants}
          foods={foods}
          saveSearch={saveSearch}
          loading={loading && restaurants?.length > 0}
          isInitialLoading={initialLoading}
          canLoadMore={filterData?.currentPage != null && filterData?.totalPages != null && filterData?.currentPage < filterData?.totalPages}
          onLoadMore={handleLoadMore}
          setSeeAllFoods={setSeeAllFoods}
          seeAllFoods={seeAllFoods}
          setIsFocus={setIsFocus}
          onRestaurantPress={onRestaurantPress}
        />
      )}
    </View>
  );
};

export default searchResults;
