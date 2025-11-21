// src/components/CategoryCard/CategoryCard.dummy.tsx
import React from 'react';
import { TouchableOpacity, Image, View, Dimensions, ActivityIndicator } from 'react-native';
import { CustomText } from '@/components';
import { shadowStyle } from '@/utils';
import { CategoryCardProps } from '../../interfaces/product-detail';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const ITEM_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - ITEM_GAP) / 2;

const CategoryCardDummy: React.FC<CategoryCardProps> = ({ item, onPress, isLoading = false }) => {
  const handlePress = () => {
    if (onPress && !isLoading) {
      onPress(item.id);
    }
  };

  if (isLoading) {
    return (
      <View
        className="bg-background dark:bg-dark-icon-background rounded-lg my-2 items-center justify-center"
        style={[shadowStyle.card, { width: CARD_WIDTH, minHeight: 140 }]}
      >
        <ActivityIndicator size="small" color="#666" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      className="bg-background dark:bg-dark-icon-background rounded-lg my-2"
      style={[
        shadowStyle.card,
        {
          width: CARD_WIDTH,
          minHeight: 140,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`category-card-${item.id}`}
      accessible={true}
      accessibilityLabel={`Category: ${item.name}`}
      accessibilityRole="button"
    >
      <View className="w-full h-[120px] mb-2.5 items-center justify-center overflow-hidden">
        <Image
          source={{ uri: item.imageUri }}
          className="w-full h-full rounded-t-md"
          resizeMode="cover"
          onError={() => 
          testID={`category-image-${item.id}`}
        />
      </View>

      <View className="px-3 pb-3">
        <CustomText
          variant="body"
          fontWeight="semibold"
          className="min-h-[32px]"
          numberOfLines={2}
          ellipsizeMode="tail"
          testID={`category-name-${item.id}`}
        >
          {item.name.toUpperCase()}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCardDummy;
