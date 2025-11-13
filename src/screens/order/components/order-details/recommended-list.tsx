import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { CustomText } from '@/components';
import { ProductCard } from '@/screens/store/components';
import { FlatList } from 'react-native-gesture-handler';
import { useAppSelector } from '@/redux';
import { useQuery } from '@apollo/client';
import { GET_RECOMMENDED_FOOD_ITEMS, GET_RECOMMENDED_ITEMS_FOR_ORDER_DETAIL_SCREEN } from '@/api';
import { Product } from '@/utils/interfaces/product-detail';
import { useThemeColor } from '@/hooks';

export default function RecommendedList() {
  const { primary } = useThemeColor();
  const currentRestaurantId = useAppSelector((state) => state.cart.currentRestaurantId);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [items, setItems] = useState<Product[]>([]);
  const [originalItems, setOriginalItems] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const order_items = useAppSelector(state => state.cart.items)

  const cartProductIds = Array.from(new Set(Object.values(cartItems).map((item: any) => item.productId)));

  const { loading, error, fetchMore, } = useQuery(GET_RECOMMENDED_ITEMS_FOR_ORDER_DETAIL_SCREEN, {
    variables: {
      restaurantId: currentRestaurantId,
      page: 1,
      itemId: Object.values(order_items)?.[0]?.product?.id || '',
    },
    onCompleted: ({ recommendedItems }) => {

      const { items: fetchedItems, currentPage, totalPages } = recommendedItems;
      console.log('fetchedItems', fetchedItems);
      setOriginalItems(fetchedItems);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);

      const filtered = fetchedItems.filter((item: Product) => !cartProductIds.includes(item.id));
      setItems(filtered);
    },
    skip: !currentRestaurantId,
  });

  console.log(error, currentRestaurantId, 'errors in recommended list');

  useEffect(() => {
    const filtered = originalItems.filter((item) => !cartProductIds.includes(item.id));
    setItems(filtered);
  }, [cartItems, originalItems]);

  const handleLoadMore = async () => {
    if (loadingMore || loading) return;
    if (currentPage >= totalPages) return;

    setLoadingMore(true);
    try {
      const { data } = await fetchMore({
        variables: {
          input: {
            restaurantId: currentRestaurantId,
            page: currentPage + 1,
          },
        },
      });

      const { items: fetchedItems, currentPage: newCurrentPage, totalPages: newTotalPages } = data.getRecommendedFoodItems;

      setOriginalItems((prev) => [...prev, ...fetchedItems]);
      setCurrentPage(newCurrentPage);
      setTotalPages(newTotalPages);

      const filteredNewItems = fetchedItems.filter((item: Product) => !cartProductIds.includes(item.id));
      setItems((prev) => [...prev, ...filteredNewItems]);
    } catch (err) {

    } finally {
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={primary} />
      </View>
    );
  };

  return loading ? (
    <View className="w-full flex-1 justify-center items-center">
      <ActivityIndicator size={'small'} color={primary} />
    </View>
  ) : error ? (
    <View className="w-full flex-1 justify-center items-center">
      <CustomText variant="caption" lightColor="red" darkColor="red" fontSize="sm">
        {error?.message || 'Something went wrong in coupons.'}
      </CustomText>
    </View>
  ) : items?.length > 0 && currentRestaurantId ? (
    <FlatList
      data={items}
      keyExtractor={(item, index) => item.id?.toString() || index.toString()}
      numColumns={2}
      contentContainerStyle={{ paddingBottom: 10, gap: 4 }}
      columnWrapperStyle={{ justifyContent: 'space-between', gap: 16 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  ) : (
    <View className="w-full flex-1 justify-center items-center text-center">
      <CustomText variant="caption" fontSize="sm" className="text-center">
        {'No recommended item found.'}
      </CustomText>
    </View>
  );
}
