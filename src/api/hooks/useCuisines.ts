import { useQuery } from '@apollo/client';

import { ICuisinesQueryProps, ICuisinesResponse } from '@/api/hooks';
import { NEAR_BY_RESTAURANTS_CUISINES } from '../graphql';

const useCuisines = ({ latitude, longitude }: ICuisinesQueryProps) => {
  const { data, error, loading, refetch, networkStatus } = useQuery<ICuisinesResponse>(NEAR_BY_RESTAURANTS_CUISINES, {
    variables: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    data: data?.nearByRestaurantsCuisines,
    loading,
    error,
    refetch,
    networkStatus,
  };
};

export default useCuisines;
