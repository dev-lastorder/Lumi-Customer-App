import { ActivityIndicator, View } from 'react-native';
import { RelativePathString, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';

import { CustomText, LoadingPlaceholder, NoData, RestaurantStoreCard, ScreenWrapperWithAnimatedHeader } from '@/components';
import { DETAILS_ROUTE_BASED_ON_SHOP_TYPE, IDiscoveryPreview, IPagination, safeArray, TRestaurantQueries } from '@/utils';
import { getValueOrDefault } from '@/utils/methods';
import { useRestaurants } from '@/api';
import adjust from '@/utils/helpers/adjust';
import { deduplicateItems, getQueryKey, QueryArguments, transformRestaurantData } from '../utils';
import { useNavigation } from '../hooks';

const parseQueryArguments = (queryArguments: string | string[] | undefined): QueryArguments => {
  if (!queryArguments) return {};
  return JSON.parse(queryArguments as string);
};

const createInitialPagination = (): IPagination => ({ pageNo: 1, pageSize: 5 });

export default function SellAllScreen() {
  const { title, queryArguments } = useLocalSearchParams();
  const { handleStoreCardPress } = useNavigation();

  const [listData, setListData] = useState<IDiscoveryPreview[]>([]);
  const [pagination, setPagination] = useState<IPagination>(createInitialPagination());
  const [isLoading, setIsLoading] = useState(true);
  const [isPaginating, setIsPaginating] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const parsedQueryArguments = parseQueryArguments(queryArguments);
  const queryKey = getQueryKey(parsedQueryArguments);

  const restaurants = useRestaurants({ queryArguments: parsedQueryArguments, pagination });

  useEffect(() => {
    const transformed = transformRestaurantData(restaurants, parsedQueryArguments);
    if (transformed.length > 0) {
      setListData(transformed);
    }
    const isAnyQueryLoading = Object.values(restaurants).some((q: any) => q.loading);
    setIsLoading(isAnyQueryLoading && listData.length === 0);
  }, [restaurants, parsedQueryArguments]);


  // const handleEndReached = () => {
  //   if (isPaginating || isLoading) return;

  //   const camelCaseQueryKey = queryKey.charAt(0).toLowerCase() + queryKey.slice(1);
  //   const fetchMoreCallback = (restaurants[camelCaseQueryKey as keyof typeof restaurants] as any)?.data?.fetchMore;

  //   if (!fetchMoreCallback) return;

  //   setIsPaginating(true);
  //   const nextPagination = { ...pagination, pageNo: (pagination.pageNo ?? 1) + 1 };

  //   fetchMoreCallback({
  //     variables: {
  //       ...parsedQueryArguments[queryKey as TRestaurantQueries]?.variables,
  //       pagination: nextPagination,
  //     },
  //     updateQuery: (prev: any, { fetchMoreResult }: { fetchMoreResult: any }) => {
  //       if (!fetchMoreResult) {
  //         setIsPaginating(false);
  //         return prev;
  //       }

  //       const newItems = transformRestaurantData({ [queryKey]: fetchMoreResult }, parsedQueryArguments);

  //       setListData(oldData => deduplicateItems(oldData, newItems));
  //       setPagination(nextPagination);
  //       setIsPaginating(false);
  //       return fetchMoreResult;
  //     },
  //   });
  // };

  const handleEndReached = () => {
    if (isPaginating || isLoading || !hasMore) return;

    const camelCaseQueryKey = queryKey.charAt(0).toLowerCase() + queryKey.slice(1);
    const queryObj = restaurants[camelCaseQueryKey as keyof typeof restaurants] as any;
    const fetchMoreCallback = queryObj?.fetchMore;

    if (!fetchMoreCallback) return;

    setIsPaginating(true);
    const nextPagination = { ...pagination, pageNo: (pagination.pageNo ?? 1) + 1 };

    fetchMoreCallback({
      variables: {
        ...parsedQueryArguments[queryKey as TRestaurantQueries]?.variables,
        ...nextPagination,
      },
      updateQuery: (prev: any, { fetchMoreResult }: { fetchMoreResult: any }) => {
        if (!fetchMoreResult) {
          setIsPaginating(false);
          setHasMore(false);
          return prev;
        }

        const newItems = transformRestaurantData({ [queryKey]: fetchMoreResult }, parsedQueryArguments);

        // If returned less than pageSize, no more data
        if (newItems.length < (pagination.pageSize ?? 5)) {
          setHasMore(false);
        }

        setListData(oldData => deduplicateItems(oldData, newItems));
        setPagination(nextPagination);
        setIsPaginating(false);
        return fetchMoreResult;
      },
    });
  };

  if (isLoading && listData.length === 0) return <LoadingPlaceholder />;

  if (!isLoading && listData.length === 0) return <NoData title='No results found.' description='No results found.' />



  if (!queryKey) {
    return (
      <ScreenWrapperWithAnimatedHeader title={String(title)} showGoBack>
        <View className="flex-1 justify-center items-center">
          <CustomText>No valid query found</CustomText>
        </View>
      </ScreenWrapperWithAnimatedHeader>
    );
  }

  return (
    <ScreenWrapperWithAnimatedHeader
      title={String(title) || 'Discovery'}
      showGoBack
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{ paddingHorizontal: adjust(16), gap: adjust(12) }}
    >
      <CustomText variant='heading2' fontWeight='bold' style={{ paddingTop: adjust(8), }}>{title}</CustomText>

      {listData.map((item) => (
        <RestaurantStoreCard
          key={item._id}
          item={{
            _id: item._id,
            name: item.name,
            image: item.image,
            deliveryTime: item.deliveryTime || 0,
            minimumOrder: item.minimumOrder,
            totalOrders: 0,
            reviewAverage: item.rating || 0,
            status: '',
            subTitle: '',
          }}
          onPress={() => handleStoreCardPress(item._id?.toString(), item.shopType ?? '')}
        />
      ))}

      {isPaginating && (
        <View className="p-4">
          <ActivityIndicator />
        </View>
      )}

      {!isPaginating && !hasMore && (
        <View className="p-4 items-center">
          <CustomText variant='caption'>
            You have reached at the end.
          </CustomText>
        </View>
      )}
    </ScreenWrapperWithAnimatedHeader>
  );
}
