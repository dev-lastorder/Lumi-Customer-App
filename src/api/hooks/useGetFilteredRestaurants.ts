// Cores
import { useQuery } from '@apollo/client';

// Api and Interfaces
import { GET_FILTERED_RESTAURANTS, Idata, IdataResponce, IQueryProps } from '@/api/';

const useGetFilteredRestaurants = ({ keyword, page = 1, latitude, longitude, shopType, status, sortBy }: IQueryProps) => {
  const shouldSkipQuery = !keyword?.trim(); // Skip if keyword is empty or whitespace

  const { data, error, loading, fetchMore } = useQuery<IdataResponce>(GET_FILTERED_RESTAURANTS, {
    variables: {
      input: {
        keyword: keyword, // search keyword
        limit: 15, // total records returned per page, default 10
        sortBy, // possible values => 'distance', 'rating', 'deliveryTime'
        userLocation: {
          // in case of sortBy "distance" userLocation will be required otherwise distance filter won't work
          longitude: Number(longitude),
          latitude: Number(latitude),
        },
        page: page, // current page for pagination if page = 2 it will return next 10 records
        shopType, // can be => "restaurant" , "grocery" , if null then it will return all
        status, // can be => "open" , "closed" , "all" , default value "all"
      },
    },
    notifyOnNetworkStatusChange: true,
    skip: shouldSkipQuery,
  });

  // console.log(JSON.stringify(data));

  return {
    data: data?.getFilteredRestaurants,
    error,
    loading,
    fetchMore,
  };
};

export default useGetFilteredRestaurants;
