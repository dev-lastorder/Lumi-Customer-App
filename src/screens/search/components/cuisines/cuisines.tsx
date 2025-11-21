// Cores
import React, { useEffect, useRef } from 'react';
import { Animated, View, TouchableOpacity } from 'react-native';
// Components
import { CustomText, LoadingPlaceholder, NoData, SomethingWentWrong } from '@/components';
// Interfaces
import { ICuisinesSectionProps } from './interface';
// Hooks
import { useThemeColor } from '@/hooks';
import adjust from '@/utils/helpers/adjust';

const Cuisines: React.FC<ICuisinesSectionProps> = ({ data, loading, error, setSearch, refetch }) => {
  if (loading) {
    return (
      <View>
        <LoadingPlaceholder />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <SomethingWentWrong
          title="Something went wrong"
          description={'An error has interrupted your experience. Please refresh or try again. We appreciate your patience'}
          imageSource={require('@/assets/GIFs/no-data-at-this-location.gif')}
          imageStyles={{ height: 300, width: 300 }}
        />
      </View>
    );
  }

  if (data.length < 1) {
    return (
      <View>
        <NoData
          title="Sorry! There aren't any restaurants or stores on Enatega near you - yet! 😕"
          description="We are workiing hard to expand and hope to come to your area soon 😌"
          imageSource={require('@/assets/GIFs/no-data-at-this-location.gif')}
          imageStyles={{ height: 300, width: 300 }}
        />
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap justify-start items-center gap-3 px-4">
      {data.map((item, index) => (
        <AnimatedCuisineCard key={index} item={item} index={index} onPress={() => setSearch(item.name)} />
      ))}
    </View>
  );
};

const AnimatedCuisineCard = ({ item, index, onPress }: { item: any; index: number; onPress: () => void }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const { background: color } = useThemeColor();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 50, // stagger
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ scale }],
      }}
      className="bg-dark-primary rounded-full"
    >
      <TouchableOpacity className="py-2 px-5" onPress={onPress}>
        <CustomText variant='button' fontSize='xs' fontWeight='medium' isDefaultColor={false} className='text-dark-button-text' style={{lineHeight:adjust(22)}} >
          {item.name}
        </CustomText>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Cuisines;
