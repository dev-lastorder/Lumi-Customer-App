import { CustomText } from '@/components';
import { shadowStyle } from '@/utils';
import React from 'react';
import { TouchableOpacity, Image, View, Dimensions } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoryCardProps {
  item: {
    id: string;
    name: string;
    imageUri: string;
  };
  onPress?: (categoryId: string, categoryName: string) => void;
}

const cardWidth = (SCREEN_WIDTH - 16 * 2 - 8 * (2 - 1)) / 2;

const CategoryCard: React.FC<CategoryCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-background dark:bg-dark-icon-background rounded-lg my-2"
      style={[
        shadowStyle.card,
        {
          width: cardWidth,
          minHeight: 140,
        },
      ]}
      onPress={() => {
        if (onPress) {
          onPress(item.id, item.name);
        }
      }}
      activeOpacity={0.7}
    >
      <View className="w-full h-[120px] mb-2.5 items-center justify-center ">
        <Image source={{ uri: item.imageUri }} className="w-full h-full rounded-t-md" />
      </View>
      <CustomText variant="body" fontWeight="semibold" className=" min-h-[32px] px-3" numberOfLines={2} ellipsizeMode="tail">
        {item.name.toUpperCase()}
      </CustomText>
    </TouchableOpacity>
  );
};

export default CategoryCard;
