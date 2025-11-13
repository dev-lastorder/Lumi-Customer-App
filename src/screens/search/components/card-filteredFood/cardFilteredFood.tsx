// Cores
import React from 'react';
import { View, Text, Image, FlatList, Pressable, TouchableOpacity } from 'react-native';
// Hooks
import { useThemeColor } from '@/hooks';
// Interface
import { IProps } from './interface';
// Components
import { CustomIcon, CustomText } from '@/components';
// Apis
import { Product } from '@/utils/interfaces/product-detail';
import adjust, { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/helpers/adjust';
import { shadowStyle } from '@/utils';
import { openProductModal } from '@/utils/helpers/openProductModal';
// Add this import if you are using Redux
import { useDispatch } from 'react-redux';

const cardFilteredFood = ({ foodsData, saveSearch, setSeeAllFoods, setIsFocus }: IProps) => {
  const { text: color, primary, greyShade: darkGray, card, border: grey } = useThemeColor();
  const dispatch = useDispatch();

  if (!foodsData || foodsData?.length === 0) return;

  const handleOnPress = (item:Product) => {
    saveSearch();
    openProductModal(dispatch, item);
  };

  const handleSeeAllPress = () => {
    setSeeAllFoods(true);
    setIsFocus(true);
  };

  const renderItem = ({ item, index }: { item: Product; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === foodsData.length - 1;

    return (
      <TouchableOpacity
        onPress={() => handleOnPress(item)}
        className="flex-1 flex-col rounded-lg bg-card dark:bg-dark-card"
        style={[shadowStyle.card, { width: SCREEN_WIDTH / 2 }]}
      >
        <View className='relative' style={{height:SCREEN_HEIGHT/6}}>
          <Image src={item.image} className="w-full h-full rounded-t-lg object-cover" />
          <View className="bg-primary absolute top-2 left-2 rounded-full px-2">
            <CustomText fontSize="xs" fontWeight="medium" style={{ color }}>
              {item?.isActive ? 'Available' : 'Not available'}
            </CustomText>
          </View>
        </View>

        <View className='px-2 gap-1 py-2 rounded-b-lg'>
            <CustomText variant='body' fontWeight="semibold" numberOfLines={1} style={{lineHeight:adjust(28)}}>
              {item?.title}
            </CustomText>

            <CustomText variant='label' isDefaultColor={false} className='text-text-secondary dark:text-dark-text-secondary pb-4' numberOfLines={1}>
              {item?.description}
            </CustomText>

          <View className="flex-row items-center pt-1 border-t-[1px] gap-2" style={{ borderTopColor: grey }}>
            <CustomIcon icon={{ size: 14, type: 'MaterialIcons', name: 'storefront' }} className='text-text dark:text-dark-text' />
            <CustomText variant='label' fontWeight="medium" numberOfLines={1} className='text-text dark:text-dark-text' isDefaultColor={false}>
              {item?.restaurantName}
            </CustomText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => (
    <View
      className='flex-row justify-center items-center h-60 mr-4'
    >
      <TouchableOpacity
        onPress={handleSeeAllPress}
        className="w-14 h-14 rounded-full justify-center items-center"
        style={{ backgroundColor: `${primary}20` }}
      >
        <CustomIcon
          icon={{
            size: 28,
            type: 'MaterialIcons',
            name: 'arrow-forward',
            color: primary,
          }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center px-4">
        <CustomText variant='heading2' fontWeight='semibold' style={{ letterSpacing: adjust(-0.5) }}>
          Related items
        </CustomText>
        <TouchableOpacity className="px-3 py-2 rounded-xl bg-primary/10" onPress={handleSeeAllPress}>
          <CustomText fontSize="sm" fontWeight="semibold" style={{ color: primary }}>
            See all
          </CustomText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={foodsData}
        renderItem={renderItem}
        keyExtractor={(item: Product, index: number) => `${item.id}_${item.restaurantId || item.restaurantName}_${index}`}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          flexGrow: 1,
          gap: adjust(16),
          paddingVertical: adjust(16),
          paddingHorizontal: adjust(12),
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
      />
    </View>
  );
};

export default React.memo(cardFilteredFood);
