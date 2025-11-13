import { useQuery } from '@apollo/client';
import { FlatList, View } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { CollapsibleHeaderScreenWrapper, LoadingPlaceholder, NoInternetConnection, SeeAllButton, SomethingWentWrong } from '@/components';
import { CategoryCard, ProductCard, SectionHeader } from '../components';
import RestaurantInfoSection from '@/screens/restaurant/components/restaurant-details/RestaurantInfoSection';
import { FETCH_CATEGORY_DETAILS_QUERY, GET_RESTAURANT_DETAILS, MOST_ORDERED_FOODS, useRestaurantFavourite } from '@/api';
import { FetchCategoryDetailsResponse } from '../interfaces/product-detail';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNetworkStatus } from '@/hooks';
import { Product } from '@/utils/interfaces/product-detail';

const StoreDetailsScreen = () => {
  const router = useRouter();
  const mainScrollY = useSharedValue(0);
  const { id } = useLocalSearchParams();
  const storeId = typeof id === 'string' ? id : undefined;
  const isConnected = useNetworkStatus();

  const { loading, error, data, refetch } = useQuery(GET_RESTAURANT_DETAILS, {
    variables: { id: storeId },
    skip: !storeId,
  });

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesApiData,
  } = useQuery<FetchCategoryDetailsResponse>(FETCH_CATEGORY_DETAILS_QUERY, {
    variables: { storeId: storeId || '' },
    skip: !storeId,
  });

  const {
    loading: mostOrderedLoading,
    error: mostOrderedError,
    data: mostOrderedData,
    refetch: refetchMostOrdered,
  } = useQuery<{ mostOrderedFoods: Product[] }>(MOST_ORDERED_FOODS, {
    variables: { restaurantId: storeId },
    skip: !storeId,
  });

  // Removed state and functions related to the commented-out ProductDetailModal
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  // const [modalCurrentQuantity, setModalCurrentQuantity] = useState(1);

  const { onToggleFavourite, isFavourting } = useRestaurantFavourite();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      mainScrollY.value = event.contentOffset.y;
    },
  });

  // Removed handleQuantityChange and handleAddToCartFromModal as they are unused
  // if the ProductDetailModal is commented out and no other cart logic is implemented here.
  // const handleQuantityChange = (id: string, newQuantity: number) => {
  //   
  // };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    

    if (storeId) {
      router.push({
        pathname: '/categories-detail',
        params: {
          id: storeId,
          categoryId: categoryId,
          categoryName: categoryName,
        },
      });
    } else {
      
    }
  };

  // Removed handleCloseModal and handleAddToCartFromModal as they are unused
  // const handleCloseModal = () => {
  //   setIsModalVisible(false);
  //   setSelectedProductForModal(null);
  // };

  // const handleAddToCartFromModal = (product: Product, quantity: number) => {
  //   handleQuantityChange(product.id, quantity);
  //   handleCloseModal();
  // };

  const handleSeeAllPress = () => {
    
    // router.push('/(food-delivery)/(store)/see-all-items');
  };

  const isLoading = loading || categoriesLoading || mostOrderedLoading;
  const isError = error || categoriesError || mostOrderedError;

  if (!isConnected && data?.restaurant) {
    return <NoInternetConnection title="No Internet Connection" description="Please check your network settings and try again." />;
  }

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (isError) {
    
    return <SomethingWentWrong title="Something went wrong" description="Failed to load store details or categories. Please try again later." />;
  }

  // Update condition to check categories directly from API data
  if (!data?.restaurant || !categoriesApiData?.fetchCategoryDetailsByStoreIdForMobile?.length) {
    return <SomethingWentWrong title="No Data Found" description="The store or its categories could not be loaded or are not available." />;
  }
  if (!storeId) {
    return <SomethingWentWrong title="Restaurant id not found" description="Restaurant id not found." />;
  }

  const mostOrderedFoods = mostOrderedData?.mostOrderedFoods || [];

  return (
    <CollapsibleHeaderScreenWrapper
      logoImageSource={data?.restaurant?.logo}
      headerBannerImageSource={data?.restaurant?.image}
      headerTitle={data?.restaurant?.name || 'Fluctus Store'}
      scrollY={mainScrollY}
      scrollHandlerObject={scrollHandler}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      onHeaderMorePress={() => {
        router.push({
          pathname: '/restaurant-reviews',
          params: { info: JSON.stringify(data?.restaurant) },
        });
      }}
      onHeaderSearchPress={() =>
        router.push({
          pathname: '/items-search',
          params: { restaurantId: storeId, shopType: 'grocery' },
        })
      }
      onHeaderHeartPress={() => onToggleFavourite(data?.restaurant?._id)}
      data={{ restaurantId: data?.restaurant?._id }}
    >
      <RestaurantInfoSection restaurantData={data?.restaurant} />

      {mostOrderedFoods.length > 0 && (
        <View className="mt-4 gap-1">
          <SectionHeader title="Most ordered" rightComponent={<SeeAllButton onPress={handleSeeAllPress} />} />
          <FlatList
            data={mostOrderedFoods}
            renderItem={({ item }) => <ProductCard product={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          />
        </View>
      )}

      <View className="mt-4 gap-1 mb-16">
        <SectionHeader title="Find what you want" />
        <FlatList
          // Directly map the category data here
          data={
            categoriesApiData?.fetchCategoryDetailsByStoreIdForMobile?.map((apiCategory) => ({
              id: apiCategory.id,
              name: apiCategory.category_name,
              imageUri: apiCategory.url,
            })) || []
          }
          renderItem={({ item }) => <CategoryCard item={item} onPress={handleCategoryPress} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </View>

      {/* Removed the commented-out ProductDetailModal JSX entirely */}
    </CollapsibleHeaderScreenWrapper>
  );
};

export default StoreDetailsScreen;
