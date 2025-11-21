// components/ImageCarousel.tsx
import React from 'react';
import { Dimensions, Image, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolation,
  withSpring,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

export interface CarouselImage {
  id: number;
  imageUri: string;
}
export interface ImageCarouselProps {
  images: CarouselImage[];
  onIndexChange?: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const MARGIN_HORIZONTAL = 16;
export const CARD_WIDTH = SCREEN_WIDTH - MARGIN_HORIZONTAL * 2;

/* ---------- item ---------- */
const CarouselImageItem = ({ image, index, scrollX }: { image: CarouselImage; index: number; scrollX: Animated.SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scrollX.value, [0, index], [0, -CARD_WIDTH], Extrapolation.CLAMP);
    return {
      transform: [{ translateX: translateX * index }],
    };
  });

  return (
    <Animated.View style={[{ width: CARD_WIDTH }, animatedStyle]}>
      <Image
        source={{ uri: image.imageUri }}
        style={{
          width: CARD_WIDTH,
          height: CARD_WIDTH * 0.5,
          resizeMode: 'cover',
        }}
      />
    </Animated.View>
  );
};

const Pagination = ({ count, activeIndex }: { count: number; activeIndex: Animated.SharedValue<number> }) => {
  return (
    <Animated.View className="absolute bottom-4 left-0 right-0 items-center">
      <View className="flex-row items-center justify-center bg-black/60 px-4 py-2 rounded-full">
        {Array.from({ length: count }).map((_, idx) => {
          const animatedDotStyle = useAnimatedStyle(() => {
            const opacity = interpolate(activeIndex.value, [idx - 1, idx, idx + 1], [0.3, 1, 0.3], Extrapolation.CLAMP);
            const scale = interpolate(activeIndex.value, [idx - 1, idx, idx + 1], [0.8, 1.2, 0.8], Extrapolation.CLAMP);
            return {
              opacity,
              transform: [{ scale }],
            };
          });

          return <Animated.View key={idx} className="w-2 h-2 rounded-full bg-white mx-1" style={animatedDotStyle} />;
        })}
      </View>
    </Animated.View>
  );
};

/* ---------- carousel ---------- */
export function ImageCarousel({ images, onIndexChange }: ImageCarouselProps) {
  const scrollX = useSharedValue(0);

  // const logScrollX = (value: number) => {
  //   
  // };

  // useDerivedValue(() => {
  //   runOnJS(logScrollX)(scrollX.value);
  // }, [scrollX]);

  useDerivedValue(() => {
    if (onIndexChange) {
      runOnJS(onIndexChange)(Math.round(scrollX.value));
    }
  }, [scrollX.value]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = scrollX.value;
    },
    onActive: (event, ctx) => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        const rawValue = ctx.startX - event.translationX / CARD_WIDTH;
        const min = 0;
        const max = images.length - 1;
        scrollX.value = Math.max(min, Math.min(rawValue, max));
      }
    },
    onEnd: () => {
      const snap = Math.round(scrollX.value);
      const min = 0;
      const max = images.length - 1;
      const target = Math.max(min, Math.min(max, snap));
      scrollX.value = withSpring(target, { damping: 18, stiffness: 200 });
    },
  });

  return (
    <View className="relative">
      <PanGestureHandler activeOffsetX={[-10, 10]} failOffsetY={[-10, 10]} onGestureEvent={gestureHandler}>
        <Animated.View style={{ flexDirection: 'row' }}>
          {images.map((img, idx) => (
            <CarouselImageItem key={img.id} image={img} index={idx} scrollX={scrollX} />
          ))}
        </Animated.View>
      </PanGestureHandler>
      <Pagination count={images.length} activeIndex={scrollX} />
    </View>
  );
}
