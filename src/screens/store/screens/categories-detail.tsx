import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { CustomText, LoadingPlaceholder, SomethingWentWrong } from '@/components';
import PagerView from 'react-native-pager-view';
import { useAppSelector } from '@/redux/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_RESTAURANT_MENU_QUERY } from '@/api/graphql/query/get-double-categories';
import { ProductCard } from '../components';
import { Product } from '@/utils/interfaces/product-detail';
import { GetRestaurantCategoriesAndSubCategoriesWithItemsPayload } from '../interfaces/double-categories';

// Assuming your interface definitions are correct and available

// --- Main Screen Component ---
const ProductListingScreen: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const theme = useAppSelector((state) => state.theme.currentTheme);

  // Get restaurantId from local search params
  const { id } = useLocalSearchParams();
  const restaurantId = typeof id === 'string' ? id : undefined;

  // Use the custom useQuery hook
  const {
    data: responseData,
    loading,
    error,
    refetch,
  } = useQuery<GetRestaurantCategoriesAndSubCategoriesWithItemsPayload>(GET_RESTAURANT_MENU_QUERY, {
    variables: { input: { restaurantId: restaurantId } },
    skip: !restaurantId,
  });

  const apiData = responseData?.getRestaurantCategoriesAndSubCategoriesWithItems?.data;

  // Direct access to categories, subCategories, and products from apiData (removed useMemo)
  const categories = apiData?.categories || [];
  const subCategories = apiData?.subCategories || [];
  const allProducts = apiData?.products || [];

  // State for PagerView: Stores the *index* of the active category
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [activeSubCategory, setActiveSubCategory] = useState<string>('');
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false); // For internal loading states (category/subcategory changes)

  // Refs for PagerView and category ScrollView
  const pagerRef = useRef<PagerView>(null);
  const categoryScrollRef = useRef<ScrollView>(null);

  // 

  // Effect to initialize activeSubCategory and activeCategoryIndex once data is loaded
  useEffect(() => {
    if (apiData && categories.length > 0 && subCategories.length > 0) {
      setActiveCategoryIndex(0);
      setActiveSubCategory(subCategories[0].id);
    }
  }, [apiData, categories, subCategories]); // Dependencies are fine here

  // --- Filtered products for each category/subCategory combination ---
  // This calculation will now run on every render.
  const filteredProductsForCategoryPages: Record<string, Product[]> = useMemo(() => {
    const productsMap: Record<string, Product[]> = {};
    // Only perform filtering if data is available
    if (categories.length > 0 && allProducts.length > 0) {
      categories.forEach((category) => {
        const categoryProducts = allProducts.filter((product) => {
          const matchesCategory = product.categoryId === category.id;
          // The first subCategory (e.g., "all-items-id") means show all products for this category.
          // Otherwise, filter by the specific subCategoryId.
          const isAllItemsSelected = subCategories.length > 0 && subCategories[0].id === activeSubCategory;
          const matchesSubCategory = isAllItemsSelected || product.subCategoryId === activeSubCategory;
          return matchesCategory && matchesSubCategory;
        });
        productsMap[category.id] = categoryProducts;
      });
    }
    return productsMap;
  }, [categories, allProducts, subCategories, activeSubCategory]);

  // --- Render Loading/Error/No Data States ---
  if (loading) {
    return <LoadingPlaceholder />;
  }

  if (error) {

    return <SomethingWentWrong title="Something went wrong" description={'Failed to load store details or categories. Please try again later.'} />;
  }

  if (!apiData || categories.length === 0) {
    return <SomethingWentWrong title="No Data Found" description="The store or its categories could not be loaded or are not available." />;
  }

  const handleCategoryTabPress = (index: number) => {
    setIsLoadingProducts(true);
    setActiveCategoryIndex(index);
    // Reset sub-category to "All items" if available, otherwise just to an empty string.
    setActiveSubCategory(subCategories.length > 0 ? subCategories[0].id : '');
    pagerRef.current?.setPage(index);

    if (categoryScrollRef.current) {
      const tabWidth = 80; // Approximate width of a tab (adjust based on your tab styling)
      const screenWidth = Dimensions.get('window').width;
      const scrollPosition = index * tabWidth - screenWidth / 2 + tabWidth / 2;
      categoryScrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
    setIsLoadingProducts(false);
  };

  const handlePagerPageSelected = (e: any) => {
    setIsLoadingProducts(true);
    const newIndex = e.nativeEvent.position;
    setActiveCategoryIndex(newIndex);
    // Reset sub-category when page changes via swipe
    setActiveSubCategory(subCategories.length > 0 ? subCategories[0].id : '');

    if (categoryScrollRef.current) {
      const tabWidth = 80;
      const screenWidth = Dimensions.get('window').width;
      const scrollPosition = newIndex * tabWidth - screenWidth / 2 + tabWidth / 2;
      categoryScrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
    setIsLoadingProducts(false);
  };

  if (!restaurantId) {
    return <SomethingWentWrong title="Restaurant id not found" description="Restaurant id not found." />;
  }
  return (
    <View className="flex-1 bg-background dark:bg-dark-background" style={{ paddingTop: top + 1 }}>
      {/* Header Section (Sticky) */}
      <View className="px-4 pb-3 border-b border-border dark:border-dark-border/30">
        {/* Category Tabs */}
        <ScrollView ref={categoryScrollRef} horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row items-center">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                className="mr-6 items-center py-1"
                activeOpacity={0.7}
                onPress={() => handleCategoryTabPress(index)}
              >
                <CustomText
                  variant="body"
                  fontWeight={activeCategoryIndex === index ? 'semibold' : 'normal'}
                  className={
                    activeCategoryIndex === index ? 'text-primary dark:text-dark-primary' : 'text-text-secondary dark:text-dark-text-secondary'
                  }
                  isDefaultColor={false}
                >
                  {category.title}
                </CustomText>
                {activeCategoryIndex === index && <View className="h-[2px] w-full bg-primary dark:bg-dark-primary mt-1" />}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Sub-category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row items-center">
            {subCategories.map((subCategory) => (
              <TouchableOpacity
                key={subCategory.id}
                className={`px-4 py-2 rounded-full mr-3 ${activeSubCategory === subCategory.id ? 'bg-primary dark:bg-dark-primary' : 'bg-card-secondary dark:bg-dark-card-secondary'}`}
                activeOpacity={0.7}
                onPress={() => setActiveSubCategory(subCategory.id)}
              >
                <CustomText
                  variant="label"
                  fontWeight={activeSubCategory === subCategory.id ? 'semibold' : 'normal'}
                  className={activeSubCategory === subCategory.id ? 'text-white dark:text-dark-white' : 'text-text-secondary dark:text-dark-text'}
                  isDefaultColor={false}
                >
                  {subCategory.title}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Product Grid using PagerView */}
      <PagerView ref={pagerRef} style={styles.pagerView} initialPage={activeCategoryIndex} onPageSelected={handlePagerPageSelected}>
        {categories.map((category) => (
          <View key={category.id} style={styles.page}>
            {isLoadingProducts ? (
              <View style={styles.centered} className="flex-1">
                <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#000'} />
              </View>
            ) : (
              <FlatList
                data={filteredProductsForCategoryPages[category.id] || []}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => <ProductCard product={item} />}
                ListEmptyComponent={() => (
                  <View className="flex-1 items-center justify-center mt-10 p-4">
                    <CustomText variant="body" className="text-text-muted dark:text-dark-text-muted text-center">
                      No products found for this category and filter.
                    </CustomText>
                  </View>
                )}
              />
            )}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductListingScreen;
