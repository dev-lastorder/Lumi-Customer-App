// Components
import { CustomPaddedView, CustomSearchHeader, CustomText, LoadingPlaceholder, ScreenHeader } from '@/components';

// Hooks & Interfaces
import { useThemeColor } from '@/hooks';
import { Product } from '@/utils/interfaces/product-detail';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

// GQL
import { SEARCH_STORE_ITEMS } from '@/api';

// React Native
import SearchSomethingIcon from '@/assets/svg/search-stomething';
import LazyImage from '@/components/common/LazyImage';
import { useLocalSearchParams } from 'expo-router';
import { SectionList, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { IParentCategory, ISubCategory, useDebounce } from '@/utils';

export default function SearchRestaurantItemsScreen() {
  const { shopType, restaurantId } = useLocalSearchParams();

  // Qureies
  const [searchProducts, { data: searchResults, loading: searchingProducts }] = useLazyQuery(SEARCH_STORE_ITEMS);
  // Hooks
  const appTheme = useThemeColor();

  // States
  const [search, setSearch] = useState('');

  const debouncedValue = useDebounce(search, 1000);
  // Handlers
  const onSearch = (value: string) => {
    setSearch(value);
  };

  // Memos
  const sectionsData = useMemo(() => {
    if (!searchResults?.searchFoodItemsWithParentAndSubCategory) {
      return [];
    }
    const apiData = searchResults.searchFoodItemsWithParentAndSubCategory as IParentCategory[];

    if (shopType === 'restaurant') {
      return apiData
        .map((parentCat) => ({
          title: parentCat.parentCategory,
          data: parentCat.foods || [],
        }))
        .filter((section) => section.data && section.data.length > 0);
    } else {
      return apiData
        .map((parentCat) => ({
          title: parentCat.parentCategory,
          data: parentCat.subCategories || [],
        }))
        .filter((section) => section.data && section.data.length > 0);
    }
  }, [searchResults]);

  // UseEffects
  useEffect(() => {
    searchProducts({
      variables: {
        input: {
          keyword: debouncedValue,
          restaurantId,
          shopType,
        },
      },
    });
  }, [debouncedValue]);

  const renderFoodItem = (food: Product, index: number) => (
    <View
      key={index}
      className={`flex-row ${shopType === 'restaurant' ? 'w-[95%]' : 'w-[95%] ml-1'} mx-auto items-center gap-4 p-2 my-2 bg-white  rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800`}
    >
      {/* Image Section */}
      <View className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700 items-center justify-center">
        {food.image ? (
          <LazyImage
            sourceUri={food.image}
            style={{ width: 64, height: 64, borderRadius: 12 }}
            placeholderComponent={
              <CustomText variant="caption" className="text-red-600">
                Replace with skeleton
              </CustomText>
            }
            isVisible={true}
            onErrorComponent={
              <View className="w-full h-full items-center justify-center px-2">
                <CustomText variant="caption" className="text-gray-500 dark:text-zinc-400">
                  No image found
                </CustomText>
              </View>
            }
            resizeMode="cover"
          />
        ) : (
          <CustomText variant="caption" className="text-gray-500 dark:text-zinc-400">
            No Image
          </CustomText>
        )}
      </View>
      <View className="flex-1">
        <View className="flex flex-row w-[95%] items-center justify-between my-1">
          <CustomText variant="heading3" className="text-zinc-900 dark:text-white font-semibold mb-1">
            {food.title}
          </CustomText>
          {food.isOutOfStock && (
            <View className="bg-red-100 dark:bg-red-800/30 px-3 py-1 rounded-full self-start">
              <CustomText fontSize="sxx" fontWeight="semibold" className="text-red-600 dark:text-red-300 text-xs font-medium">
                Out of Stock
              </CustomText>
            </View>
          )}
        </View>
        {food.description ? (
          <CustomText variant="caption" isDefaultColor={false} numberOfLines={2} className="text-zinc-400 mb-1">
            {food.description}
          </CustomText>
        ) : null}
      </View>
    </View>
  );

  const renderSubCategoryItem = ({ item: subCategory }: { item: ISubCategory }) => {
    return (
      <View className="pl-4 py-2 border-b border-gray-200 dark:border-zinc-700">
        {subCategory.title && subCategory.title !== '-' && (
          <CustomText variant="subheading" fontWeight="semibold">
            {subCategory.title}
          </CustomText>
        )}
        {subCategory.foods && subCategory.foods.length > 0 ? (
          // Updated call to renderFoodItem to match its new signature
          subCategory.foods.map((foodItem: Product, idx: number) => renderFoodItem(foodItem, idx))
        ) : (
          <CustomText className="text-sm text-zinc-500 dark:text-zinc-400 italic ml-1">No items in this sub-category.</CustomText>
        )}
      </View>
    );
  };

  const renderParentCategoryHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View className="bg-white w-full border border-b-[0.5px] border-gray-200 py-4">
      <ScreenHeader title={title} />
    </View>
  );

  return (
    <CustomPaddedView style={{ backgroundColor: appTheme.background, flex: 1 }} className="pt-0 bg-white">
      <CustomSearchHeader search={search} onSearch={onSearch} enableBack={true} key={'Search_Restaurant_AND_Store_Products_With_Ctg_&_Sub_Ctg'} />
      {!search ? (
        <View style={{ marginHorizontal: 'auto' }}>
          <SearchSomethingIcon />
          <CustomText variant="subheading" fontSize="md" isDefaultColor={false} className="text-zinc-500 dark:text-zinc-400 text-center mt-4">
            Search for similar dishes
          </CustomText>
        </View>
      ) : (
        <View style={{ backgroundColor: appTheme.background, flex: 1 }} className="pt-0">
          {searchingProducts ? (
            <LoadingPlaceholder />
          ) : (
            <SectionList
              sections={
                sectionsData as {
                  title: string;
                  data: unknown[];
                }[]
              }
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item, index }) => {
                if (shopType === 'restaurant') {
                  return renderFoodItem(item as Product, index);
                } else {
                  return renderSubCategoryItem({ item: item as ISubCategory });
                }
              }}
              renderSectionHeader={renderParentCategoryHeader}
              stickySectionHeadersEnabled
              contentContainerClassName="bg-white"
              ListEmptyComponent={() => {
                if (debouncedValue && !searchingProducts) {
                  return (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 0,
                      }}
                      className={` w-[80%] h-[60vh] mx-auto items-center justify-center`}
                    >
                      <Animated.Image
                        source={require('@/assets/GIFs/nothing_found_on_search.gif')}
                        entering={FadeIn}
                        exiting={FadeOut}

                        className={` w-[80%] h-[60%] mx-auto block `}
                      />
                      <CustomText variant='label' className='w-[80%] h-[20%] mx-auto block text-center'>
                      Nothing came up. Please try searching for something elase.
                      </CustomText>
                    </View>
                  );
                }
                return null; // Or a generic "start typing to search" message if debouncedValue is empty
              }}
            />
          )}
        </View>
      )}
    </CustomPaddedView>
  );
}
