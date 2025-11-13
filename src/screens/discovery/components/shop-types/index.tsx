import { View, Image, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';

import { GET_SHOP_TYPES } from '@/api';
import { CustomText } from '@/components';
import { IShopType } from './interface';
import { shadowStyle } from '@/utils';
import adjust, { SCREEN_WIDTH } from '@/utils/helpers/adjust';

const useShopTypes = () => {
  const { data } = useQuery(GET_SHOP_TYPES);
  return data?.fetchShopTypes?.data || [];
};

const useShopTypeNavigation = () => {
  const router = useRouter();
  return (shopType: IShopType) => {
    router.push({
      pathname: '/home',
      params: { shopType: JSON.stringify(shopType) },
    });
  };
};

const ShopTypeCard = ({ item, onPress }: { item: IShopType; onPress: (item: IShopType) => void }) => (
  <View className=''>
    <TouchableOpacity
      className="flex-col items-center gap-1"
      style={[shadowStyle.card]}
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Shop type: ${item.title}`}
      accessibilityHint="Tap to browse this shop category"
      activeOpacity={0.8}
    >
      <View className="overflow-hidden rounded-xl bg-gray-50 " style={{ width: SCREEN_WIDTH / 6, height: SCREEN_WIDTH / 6 }}>
        {item?.image && <Image
          source={{ uri: item?.image ?? '' }}
          className="w-full h-full"
          resizeMode="cover"
          accessible
          accessibilityLabel={`${item.title} category image`}
        />}
      </View>

      <CustomText
        className="text-center leading-4"
        fontSize="xs"
        fontWeight='medium'
        numberOfLines={1}
        ellipsizeMode="tail"
        accessible
        accessibilityRole="text"
      >
        {item.title}
      </CustomText>
    </TouchableOpacity>
  </View>
);

const DiscoveryShopTypes = ({title, queryArguments}:any) => {
  const shopTypes = useShopTypes();
  const router = useRouter()
  const handlePress = useShopTypeNavigation();

  const renderItem = ({ item }: ListRenderItemInfo<IShopType>) => (
    <ShopTypeCard item={item} onPress={handlePress} />
  );

  const onSeeAll = () => {
    router.push({
      pathname: '/see-all',
      params: {
        title,
        queryArguments: JSON.stringify(queryArguments),
      },
    });
  };

  return (
    <View style={{ paddingHorizontal: adjust(16), gap: adjust(16) }}>
      <FlatList
        data={shopTypes}
        horizontal
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingEnd: 16, gap: adjust(16) }}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: 96,
          offset: 96 * index,
          index,
        })}
        removeClippedSubviews
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        accessible={false}
      />
    </View>
  );
};

export default DiscoveryShopTypes;
