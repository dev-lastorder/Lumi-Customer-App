// Core
import { View, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import React, { useRef } from 'react';
// Components
import { CustomIcon, CustomText, LoadingPlaceholder, NoData } from '@/components';
import { CardFilteredFood } from '../card-filteredFood';
// Hooks
import { useThemeColor } from '@/hooks';
// Apis & Interfaces
import { IProps } from '@/api';
import adjust from '@/utils/helpers/adjust';

const cardFilteredRestaurant = ({
  data,
  saveSearch,
  loading = false,
  canLoadMore = false,
  onLoadMore,
  isInitialLoading,
  foods,
  setSeeAllFoods,
  seeAllFoods,
  setIsFocus,
  onRestaurantPress,
}: IProps) => {
  // states
  const onEndReachedCalledDuringMomentum = useRef(false);

  const { text: color, greyShade: darkGray, border: grey } = useThemeColor();

  const handleOnPress = (id: string) => {
    saveSearch();
    onRestaurantPress(id);
  };

  const handleLoadMore = () => {
    if (canLoadMore && !onEndReachedCalledDuringMomentum.current) {
      onLoadMore?.();
      onEndReachedCalledDuringMomentum.current = true;
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <>
      <TouchableOpacity onPress={() => handleOnPress(item._id)} key={item?._id + index} className="w-full py-2 flex-row items-center gap-4 px-4">
        <Image src={item?.image} className="w-20 h-20 rounded-lg" />

        <View className="gap-1 w-full pb-4 border-b-[0.5px] py-4 border-border dark:border-dark-border/30 overflow-hidden ">
          <CustomText variant='body' fontFamily='Inter' fontWeight="semibold">
            {item?.name}
          </CustomText>

          <View className="flex-row gap-4 flex-wrap">
            <View className="flex-row items-center gap-1">
              <CustomIcon icon={{ size: adjust(20), type: 'Ionicons', name: 'bicycle-sharp' }} className='text-text-secondary' />
              <CustomText variant='caption' >
                {item?.deliveryTime} min
              </CustomText>
            </View>
            <CustomText fontWeight='bold'>.</CustomText>
            <View className="flex-row items-center gap-1">
              <CustomIcon icon={{ size: adjust(16), type: 'FontAwesome6', name: 'face-smile' }} className='text-text-secondary' />
              <CustomText variant='caption'>
                {item?.reviewAverage} ({item?.reviewCount})
              </CustomText>
            </View>
          </View>
          <View className="flex-row items-center gap-1">
            <CustomIcon icon={{ size: adjust(16), type: 'Entypo', name: 'location' }} className='text-text-secondary' />
            <CustomText variant='caption'>
              {item?.address.length > 16 ? item.address.slice(0, 16) + '...' : item.address}
            </CustomText>
          </View>
        </View>
      </TouchableOpacity>
      {/* Foods after 2 restaurant elements */}
      {index === 1 && foods?.length > 0 && (
        <CardFilteredFood
          foodsData={foods}
          saveSearch={saveSearch}
          setSeeAllFoods={setSeeAllFoods}
          seeAllFoods={seeAllFoods}
          setIsFocus={setIsFocus}
        />
      )}
    </>
  );

  const renderFooter = () => {
    if (loading && data?.length > 0) {
      return (
        <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingPlaceholder />
        </View>
      );
    }
    return null;
  };

  // Don't render anything if no data and not showing empty state
  if (!loading && !isInitialLoading && data?.length === 0) {
    return (
      <NoData
        title="Sorry! There aren't any restaurants or stores on Enatega near you - yet! 😕"
        description="We are working hard to expand and hope to come to your area soon 😌"
        imageSource={require('@/assets/GIFs/no-data-at-this-location.gif')}
        imageStyles={{ height: 300, width: 300 }}
      />
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item._id}_${index}`}
      contentContainerStyle={{ paddingVertical: 8, paddingBottom: Platform.OS === 'ios' ? '45%' : '55%' }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      onMomentumScrollBegin={() => {
        onEndReachedCalledDuringMomentum.current = false;
      }}
    />
  );
};

export default React.memo(cardFilteredRestaurant);
