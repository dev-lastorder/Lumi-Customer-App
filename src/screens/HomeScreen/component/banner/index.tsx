import { View, Image, TouchableOpacity } from 'react-native';
import { useQuery } from '@apollo/client';
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';
import { useRouter } from 'expo-router';

// API
import { GET_BANNERS } from '@/api';

// Components
import { CustomCarousel, CustomText } from '@/components';
import { VideoItem } from './video-item';

// Types
import { IBannner } from './interface';

// Utils
import { onGetBannerNavigation } from '@/utils/methods';
import { shadowStyle } from '@/utils';
import adjust, { SCREEN_WIDTH } from '@/utils/helpers/adjust';

const useBannerData = () => {
  const { data } = useQuery(GET_BANNERS);
  return data?.banners || [];
};

const useBannerNavigation = () => {
  const router = useRouter();
  const navigate = (banner: IBannner) => {
    const route = onGetBannerNavigation(banner);
    router.push(route);
  };
  return navigate;
};

const BannerMedia = ({ item }: { item: IBannner }) => {
  const isVideo = item?.file?.includes('mp4');
  return (
    <View className="absolute inset-0 z-10">
      {isVideo && item.file ? (
        <VideoItem url={item.file} accessibilityLabel={`${item.title} promotional video`} accessible />
      ) : (
        <Image
          source={{ uri: item.file }}
          className="w-full h-full"
          resizeMode="cover"
          accessible
          accessibilityLabel={`${item.title} banner image`}
        />
      )}
    </View>
  );
};

const BannerOverlay = ({ title, description }: Pick<IBannner, 'title' | 'description'>) => (
  <View className="absolute bottom-0 left-0 right-0 z-30 px-4 py-3 bg-black/10 flex-col gap-1">
    <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-[-1]" />
    <CustomText className="text-white font-bold leading-6" fontSize="lg" fontWeight="bold" numberOfLines={2} isDefaultColor={false}>
      {title}
    </CustomText>
    <CustomText
      className="text-white/90 font-normal leading-5"
      style={{ lineHeight: adjust(20) }}
      fontSize="sm"
      numberOfLines={3}
      isDefaultColor={false}
    >
      {description}
    </CustomText>
  </View>
);

const BannerCard = ({ item, onPress }: { item: IBannner; onPress: (item: IBannner) => void }) => (
  // Wrapper View to handle spacing
  <View>
    <TouchableOpacity
      key={item._id}
      className="rounded-lg overflow-hidden relative h-full w-full"
      style={[shadowStyle.card]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <BannerMedia item={item} />
      <View className="absolute inset-0 bg-black/35 z-20" />
      <BannerOverlay title={item.title} description={item.description} />
    </TouchableOpacity>
  </View>
);

const HomeScreenBanner = () => {
  const banners = useBannerData();
  const handleBannerPress = useBannerNavigation();

  const renderItem = ({ item }: CarouselRenderItemInfo<IBannner>) => (
    // <View style={{width:"100%", height:200, borderWidth:2}}></View>
    <BannerCard item={item} onPress={handleBannerPress} />
  );

  return (
    <View style={{ paddingHorizontal: adjust(16) }}>
      <CustomCarousel
        data={banners}
        showPager
        autoPlay
        autoPlayInterval={3000}
        renderItem={renderItem}
        carouselStyle={{}}
        containerStyle={{}}
      />
    </View>
  );
};

export default HomeScreenBanner;
