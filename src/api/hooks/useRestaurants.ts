// src/api/useRestaurants.ts
import { useQuery } from '@apollo/client';

// API
import {
  GET_MOST_ORDER_RESTAURANTS_PREVIEW,
  GET_RECENT_ORDER_RESTAURANTS_PREVIEW,
  GET_RESTAURANTS_PREVIEWS,
  GET_TOP_RATED_VENDORS_PREVIEW,
} from '@/api/graphql/query/restaurant';

// Interface
import { IUseRestaurantHook, IUseRestaurantVariables } from '@/utils/interfaces';

const PAGINATION = {
  pagination: {
    pageNo: 0,
    pageSize: 5,
  },
};

export const useRestaurants = <T extends IUseRestaurantVariables>(props: IUseRestaurantHook<T>) => {
  const { queryArguments, pagination = PAGINATION } = props;

  // Determine skip flags
  const skipNearby = !queryArguments?.NearByRestaurants || queryArguments.NearByRestaurants.skip;
  const skipRecent = !queryArguments?.RecentOrderRestaurants || queryArguments.RecentOrderRestaurants.skip;
  const skipMost = !queryArguments?.MostOrderRestaurants || queryArguments.MostOrderRestaurants.skip;
  const skipTop = !queryArguments?.TopRatedVendors || queryArguments.TopRatedVendors.skip;

  // 1️⃣ ALWAYS call useQuery, but skip when needed
  const {
    data: nearByData,
    loading: nearByLoading,
    error: nearByError,
    refetch: refetchNearby,
    fetchMore: fetchMoreNearby,
  } = useQuery(GET_RESTAURANTS_PREVIEWS, {
    skip: skipNearby,
    variables: {
      ...queryArguments?.NearByRestaurants?.variables,
      ...pagination,
    },
    fetchPolicy: 'network-only',
  });

  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
    fetchMore: fetchMoreRecent,
  } = useQuery(GET_RECENT_ORDER_RESTAURANTS_PREVIEW, {
    skip: skipRecent,
    variables: {
      ...queryArguments?.RecentOrderRestaurants?.variables,
      ...pagination,
    },
  });

  const {
    data: mostData,
    loading: mostLoading,
    error: mostError,
    refetch: refetchMost,
    fetchMore: fetchMoreMost,
  } = useQuery(GET_MOST_ORDER_RESTAURANTS_PREVIEW, {
    skip: skipMost,
    variables: {
      ...queryArguments?.MostOrderRestaurants?.variables,
      ...pagination,
    },
  });

  const {
    data: topData,
    loading: topLoading,
    error: topError,
    refetch: refetchTop,
    fetchMore: fetchMoreTop,
  } = useQuery(GET_TOP_RATED_VENDORS_PREVIEW, {
    skip: skipTop,
    variables: {
      ...queryArguments?.TopRatedVendors?.variables,
      ...pagination,
    },
  });

  return {
    nearByRestaurants: {
      data: {
        groceryorders: nearByData?.nearByRestaurantsPreview?.[queryArguments?.NearByRestaurants?.variables?.shopType?.indexOf('grocery') ?? 0] || [],
        restaurantorders:
          nearByData?.nearByRestaurantsPreview?.[queryArguments?.NearByRestaurants?.variables?.shopType?.indexOf('restaurant') ?? 0] || [],
      },
      loading: nearByLoading,
      error: nearByError || null,
      refetch: refetchNearby,
      fetchMore: fetchMoreNearby,
    },

    recentOrderRestaurants: {
      data: recentData?.recentOrderRestaurantsPreview || [],
      loading: recentLoading,
      error: recentError || null,
      refetch: refetchRecent,
      fetchMore: fetchMoreRecent,
    },

    mostOrderRestaurants: {
      data: {
        all: mostData?.mostOrderedRestaurantsPreview?.[0] || [],
        groceryorders:
          mostData?.mostOrderedRestaurantsPreview?.[queryArguments?.MostOrderRestaurants?.variables?.shopType?.indexOf('grocery') ?? 0] || [],
        restaurantorders:
          mostData?.mostOrderedRestaurantsPreview?.[queryArguments?.MostOrderRestaurants?.variables?.shopType?.indexOf('restaurant') ?? 0] || [],
      },
      loading: mostLoading,
      error: mostError || null,
      refetch: refetchMost,
      fetchMore: fetchMoreMost,
    },

    topRatedVendors: {
      data: {
        all: topData?.topRatedVendorsPreview?.[0] ?? [],
        groceryorders: topData?.topRatedVendorsPreview?.[queryArguments?.TopRatedVendors?.variables?.shopType?.indexOf('grocery') ?? 0] || [],
        restaurantorders: topData?.topRatedVendorsPreview?.[queryArguments?.TopRatedVendors?.variables?.shopType?.indexOf('restaurant') ?? 0] || [],
      },
      loading: topLoading,
      error: topError || null,
      refetch: refetchTop,
      fetchMore: fetchMoreTop,
    },

    // echo back for parent components to re-invoke with new variables
    fetchArguments: {
      nearByRestaurants: {
        variables: queryArguments?.NearByRestaurants?.variables,
        skip: skipNearby,
      },
      recentOrderRestaurants: {
        variables: queryArguments?.RecentOrderRestaurants?.variables,
        skip: skipRecent,
      },
      mostOrderRestaurants: {
        variables: queryArguments?.MostOrderRestaurants?.variables,
        skip: skipMost,
      },
      topRatedVendors: {
        variables: queryArguments?.TopRatedVendors?.variables,
        skip: skipTop,
      },
    },
  };
};
