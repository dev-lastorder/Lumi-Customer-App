import { View, Text, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { CustomText } from '../common';
import { SCREEN_WIDTH } from '@/utils';

type RestaurantStoreMiniCardProps = {
  name: string;
  image: string;
};

const RestaurantStoreMiniCard = ({
  item,
  onPress,
  style,
}: {
  item: RestaurantStoreMiniCardProps;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-white dark:bg-dark-bgLight rounded-lg shadow-sm overflow-hidden"
      style={style}
    >
      {/* Image */}
      <View className="w-full aspect-[4/5] bg-gray-100 dark:bg-dark-border" style={{ height: SCREEN_WIDTH / 2.5, width: SCREEN_WIDTH * 0.4 }}>
        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
      </View>

      {/* Content */}
      <View className="px-3 pt-2 pb-8" style={{ maxWidth: SCREEN_WIDTH * 0.32 }}>
        <CustomText numberOfLines={1} fontSize="xs" fontWeight="semibold">
          {item?.name}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantStoreMiniCard;
