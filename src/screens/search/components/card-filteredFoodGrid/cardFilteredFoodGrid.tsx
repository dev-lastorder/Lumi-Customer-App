// Cores
import React from 'react';
import { View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
// Hooks
import { useThemeColor } from '@/hooks';
// Interface
import { IProps } from './interface';
// Components
import { CustomIcon, CustomText } from '@/components';
import { Product } from '@/utils/interfaces/product-detail';

const cardFilteredFoodGrid = ({ foodsData, saveSearch, onFoodPress }: IProps) => {

  const { text: color, primary, greyShade: darkGray, card, border: grey } = useThemeColor();
  
  if (!foodsData || foodsData?.length === 0) return;

  const handleOnPress = (item: Product) => {
    saveSearch();
    onFoodPress(item);
  };

  return (
    <ScrollView>
      <View className="gap-2" style={{paddingBottom: Platform.OS === 'ios' ? '45%' : '55%'}}>
        <View className="flex-row justify-between items-center px-4">
          <CustomText fontSize="lg" fontWeight="bold">
            Related items
          </CustomText>
        </View>

        <View className="flex-row flex-wrap px-4 justify-between">
          {!!foodsData.length && foodsData.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleOnPress(item)}
              className="h-60 flex-col rounded-lg mb-4"
              style={{
                boxShadow: '0px 3px 5px 0px rgba(0,0,0,0.2)',
                backgroundColor: card,
                width: '48%'
              }}
            >
              <View>
                <Image src={item.image} className="w-full h-28 rounded-t-lg object-cover" />
                <View className="bg-primary absolute top-2 left-2 rounded-full px-2">
                  <CustomText fontSize="xs" fontWeight="semibold" style={{ color }}>
                    {item.isActive ? 'Available' : 'Not available'}
                  </CustomText>
                </View>
              </View>

              <View className="p-2 h-32 justify-between">
                <View>
                  <CustomText fontSize="md" fontWeight="semibold" numberOfLines={2} style={{ color }}>
                    {item.title}
                  </CustomText>

                  <CustomText fontSize="xs" style={{ color: darkGray }} numberOfLines={1}>
                    {item.description}
                  </CustomText>
                </View>

                <View className="flex-row items-center gap-1 pt-1 border-t-[1px]" style={{ borderTopColor: grey }}>
                  <CustomIcon icon={{ size: 14, type: 'MaterialIcons', name: 'storefront', color: `${primary}` }} />
                  <CustomText fontSize="sm" fontWeight="semibold" numberOfLines={1} style={{ color: darkGray }}>
                    {item.restaurantName}
                  </CustomText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default React.memo(cardFilteredFoodGrid);
