import { useThemeColor } from '@/hooks';
import { useAppSelector } from '@/redux';
import { AntDesign } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export interface IRestaurant {
  _id: string;
  name: string;
  image: string;
  card_images: string[];
  deliveryTime: number;
  totalOrders: number;
  reviewAverage: number;
  minimumOrder: number;
  status: string;
  subTitle: string;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_HORIZONTAL_MARGIN = 12 * 2;
const SLIDER_CONTAINER_WIDTH = screenWidth - CARD_HORIZONTAL_MARGIN;
const SLIDER_HEIGHT = 150;
const MAX_SCALE_ON_SWIPE_LEFT = 1.1;

const AnimatedRestaurantImageSlider = ({ item }: { item: IRestaurant }) => {
  const [isFav, setIsFav] = useState(false);
  const { primary: primaryColor, text: textColor } = useThemeColor();
  const currencySymbol  = useAppSelector((state) => state.configuration.configuration.currencySymbol);

  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const imagesToDisplay = useMemo(() => {
    if (item.card_images && item.card_images.length > 0) {
      return item.card_images;
    }
    return item.image ? [item.image] : [];
  }, [item.card_images, item.image]);

  const imageCount = imagesToDisplay.length;

  const updateCurrentIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = Number(ctx?.startX) + event.translationX;
    },
    onEnd: (event) => {
      let newCalculatedIndex = currentIndex;
      const DISTANCE_THRESHOLD = SLIDER_CONTAINER_WIDTH / 3.5;
      const VELOCITY_THRESHOLD = 400;

      const swipedFarLeft = event.translationX < -DISTANCE_THRESHOLD;
      const swipedFarRight = event.translationX > DISTANCE_THRESHOLD;
      const flickedLeft = event.velocityX < -VELOCITY_THRESHOLD;
      const flickedRight = event.velocityX > VELOCITY_THRESHOLD;

      if ((swipedFarLeft || flickedLeft) && currentIndex < imageCount - 1) {
        newCalculatedIndex = currentIndex + 1;
      } else if ((swipedFarRight || flickedRight) && currentIndex > 0) {
        newCalculatedIndex = currentIndex - 1;
      }

      if (newCalculatedIndex !== currentIndex) {
        runOnJS(updateCurrentIndex)(newCalculatedIndex);
      }

      translateX.value = withSpring(-newCalculatedIndex * SLIDER_CONTAINER_WIDTH, { damping: 20, stiffness: 150, mass: 1 });
    },
  });

  const animatedImageContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: SLIDER_CONTAINER_WIDTH * imageCount,
    };
  });

  const renderImageSlider = () => {
    if (imageCount === 0) {
      return (
        <View style={[styles.sliderViewport, styles.noImagePlaceholder]}>
          <MaterialIcons name="image-not-supported" size={40} color={textColor} />
          <Text style={{ color: textColor, marginTop: 5 }}>No image available</Text>
        </View>
      );
    }

    if (imageCount === 1) {
      return (
        <View style={styles.sliderViewport}>
          <Image source={{ uri: imagesToDisplay[0] }} style={styles.slideImage} />
          <TouchableOpacity activeOpacity={0.8} style={styles.favButton} onPress={() => setIsFav((prev) => !prev)}>
            <AntDesign name={isFav ? 'heart' : 'hearto'} size={18} color={primaryColor} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.sliderViewport}>
        <PanGestureHandler onGestureEvent={gestureHandler} activeOffsetX={[-10, 10]}>
          <Animated.View style={[styles.imageStrip, animatedImageContainerStyle]}>
            {imagesToDisplay.map((imgUri, index) => {
           const slideSpecificScaleStyle = useAnimatedStyle(() => {
            const centeredPosition = -index * SLIDER_CONTAINER_WIDTH;
            const halfwayOffLeftPosition = -(index + 0.5) * SLIDER_CONTAINER_WIDTH;
            const fullyOffLeftPosition = -(index + 1) * SLIDER_CONTAINER_WIDTH;
          
            const scale = interpolate(
              translateX.value,
              [fullyOffLeftPosition, halfwayOffLeftPosition, centeredPosition, centeredPosition + SLIDER_CONTAINER_WIDTH * 0.1],
              [1.0, MAX_SCALE_ON_SWIPE_LEFT, 1, 1.0],
              Extrapolate.CLAMP
            );

            const shadowOpacity = interpolate(
              translateX.value,
              [centeredPosition - SLIDER_CONTAINER_WIDTH * 2, centeredPosition - SLIDER_CONTAINER_WIDTH * 1, centeredPosition],
              [0, 1, 0],
              Extrapolate.CLAMP
            );
          
            const shadowRadius = interpolate(
              translateX.value,
              [centeredPosition - SLIDER_CONTAINER_WIDTH * 0.8, centeredPosition - SLIDER_CONTAINER_WIDTH * 0.2, centeredPosition],
              [0, 8, 0],
              Extrapolate.CLAMP
            );
          
            // Dynamic zIndex for overlapping effect
            let dynamicZIndex = imageCount - index; // Base z-index (later images have higher z-index)
            
            // Determine swipe direction and adjust z-index accordingly
            const swipeProgress = translateX.value / SLIDER_CONTAINER_WIDTH;
            const normalizedCurrentIndex = -swipeProgress;
            
            // When swiping right (revealing previous image), previous image should be on top
            if (translateX.value > 0 && index === currentIndex - 1) {
              dynamicZIndex = imageCount + 10; // Bring previous image to front
            }
            // When swiping left (revealing next image), next image should be on top
            else if (translateX.value < 0 && index === currentIndex + 1) {
              dynamicZIndex = imageCount + 10; // Bring next image to front
            }
            // Current image gets medium priority
            else if (index === currentIndex) {
              dynamicZIndex = imageCount + 5;
            }
          
            return {
              transform: [{ scale }],
              zIndex: dynamicZIndex,
              shadowColor: 'black',
              shadowOffset: { width: -3, height: 0 },
              shadowOpacity: shadowOpacity,
              shadowRadius: shadowRadius,
              elevation: shadowRadius,
            };
          });
              return (
                <Animated.View key={imgUri + index} style={[styles.slide, slideSpecificScaleStyle]}>
                  <Image source={{ uri: imgUri }} style={styles.slideImage} />
                </Animated.View>
              );
            })}
          </Animated.View>
        </PanGestureHandler>

        <TouchableOpacity activeOpacity={0.8} style={styles.favButton} onPress={() => setIsFav((prev) => !prev)}>
          <AntDesign name={isFav ? 'heart' : 'hearto'} size={18} color={primaryColor} />
        </TouchableOpacity>

        <View style={styles.paginationContainer}>
          {imagesToDisplay.map((_, index) => {
            const isActive = currentIndex === index;
            return (
              <Animated.View
                key={'dot-' + index}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                  isActive && { transform: [{ scale: 1.15 }], opacity: 1 },
                  !isActive && { opacity: 0.6, transform: [{ scale: 0.9 }] },
                ]}
              />
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View className="h-fit bg-white dark:bg-dark-bgLight rounded-lg mx-3 shadow my-2">
      {renderImageSlider()}
      {/* Rest of your card content remains the same */}
      <View className="flex-row items-center justify-between py-3 px-4 border-b dark:border-b-white/10 border-b-dark-border/10">
        <View>
          <Text className="text-text dark:text-dark-text font-semibold text-base">{item?.name}</Text>
          <Text className="text-text dark:text-dark-text/80 text-xs mt-0.5">{item?.subTitle}</Text>
        </View>
        <View className="bg-primary/10 rounded-lg py-2 px-3 flex-col items-center">
          <Text className="text-primary dark:text-dark-primary text-xs font-semibold ">{item?.deliveryTime}</Text>
          <Text className="text-primary dark:text-dark-primary text-[11px]">min</Text>
        </View>
      </View>
      <View className="py-3 px-4 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <AntDesign name="clockcircleo" size={14} color={primaryColor} />
          <Text className="text-xs text-primary dark:text-dark-primary">{item?.deliveryTime} min</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="store" size={18} color={textColor} />
          <Text className="text-xs text-text/80 dark:text-dark-text">
            {currencySymbol}
            {item?.minimumOrder}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <AntDesign name="staro" size={14} color={textColor} />
          <Text className="text-xs text-text/80 dark:text-dark-text">{item?.reviewAverage?.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderViewport: {
    width: SLIDER_CONTAINER_WIDTH,
    height: SLIDER_HEIGHT,
    overflow: 'hidden',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
  },
  noImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStrip: {
    height: '100%',
    flexDirection: 'row',
  },
  slide: {
    width: SLIDER_CONTAINER_WIDTH,
    height: '100%',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  favButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default AnimatedRestaurantImageSlider;
