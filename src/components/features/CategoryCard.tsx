import { cardShadow, SCREEN_WIDTH } from '@/utils';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { CustomText } from '../common';

interface Category {
  _id: string;
  shopType: string;
  name: string;
  image: any;
}

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  isSelected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, isSelected }) => {
  const [scale] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      className={'rounded-lg items-center overflow-hidden bg-card dark:bg-dark-card'}
      style={cardShadow}
      onPress={onPress}
    >
      <View className="w-full  bg-gray-100 dark:bg-dark-border" style={{ height: SCREEN_WIDTH / 4, width: SCREEN_WIDTH / 3.5 }}>
        <Image source={{ uri: category.image }} className="w-full h-full" resizeMode="cover" />
      </View>
      <View className="w-full px-3 pt-1 pb-8 overflow-hidden">
        <CustomText fontSize="xs" fontWeight="medium" className="text-start">
          {category.name.length > 12 ? `${category.name.slice(0, 12)}...` : category.name}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;
