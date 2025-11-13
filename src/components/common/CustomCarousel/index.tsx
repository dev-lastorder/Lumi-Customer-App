import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  AccessibilityInfo,
  ViewStyle,
} from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue, SharedValue } from 'react-native-reanimated';

import { CustomText } from '../CustomText';
import { ICustomCarousel } from './interface';
import { useThemeColor } from '@/hooks';
import { shadowStyle } from '@/utils';
import adjust, { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/helpers/adjust';
import CustomPaginationDots from './CustomPaginationDots';
import CustomPaginationThumbnails from './CustomPaginationThumbnails';

const globalWidth = Dimensions.get('window').width;

interface EnhancedCustomCarousel<T> extends ICustomCarousel<T> {
  showPager?: boolean;
  width?: number;
  carouselStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  paginationAccessibilityLabel?: string;
  carouselAccessibilityLabel?: string;
  testID?: string;
}

// --- Hooks ---
const useCarouselLogic = <T,>(
  data: T[],
  progress: SharedValue<number>,
  ref: React.RefObject<ICarouselInstance>
) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
 const onProgressChange = React.useCallback(
    (absoluteProgress: number, relativeProgress: number) => {
      // Update the shared value with the absolute progress
      progress.value = absoluteProgress;
      
      // Update current index
      const itemWidth = SCREEN_WIDTH - adjust(32);
      const newIndex = Math.floor(Math.abs(absoluteProgress) / itemWidth);
      setCurrentIndex(newIndex);
    },
    [progress]
  );

  const onPressPagination = React.useCallback(
    (index: number) => {
      ref.current?.scrollTo({
        count: index - progress.value,
        animated: true,
      });

      AccessibilityInfo.announceForAccessibility(`Moved to slide ${index + 1} of ${data.length}`);
    },
    [progress, data.length, ref]
  );

  return { currentIndex, onProgressChange, onPressPagination };
};

// --- Main Component ---
export default function CustomCarousel<T>(props: EnhancedCustomCarousel<T>) {
  const {
    showPager = false,
    carouselStyle = {},
    containerStyle = {},
    paginationAccessibilityLabel = 'Carousel pagination',
    carouselAccessibilityLabel = 'Image carousel',
    testID = 'custom-carousel',
    ...otherProps
  } = props;

  const ref = React.useRef<ICarouselInstance>(null) as React.RefObject<ICarouselInstance>;
  const progress = useSharedValue<number>(0);
  const { currentIndex, onProgressChange, onPressPagination } = useCarouselLogic(
    otherProps.data,
    progress,
    ref
  );

  return (
    <>   
     <View style={[styles.container, containerStyle]} testID={testID}>
      {/* Carousel */}
        <Carousel
          ref={ref}
          width={SCREEN_WIDTH-adjust(32)}
          height={SCREEN_WIDTH/3}
          style={[styles.carousel, carouselStyle]}
          onProgressChange={onProgressChange}
          onConfigurePanGesture={gestureChain => (
            gestureChain.activeOffsetX([-10, 10])
          )}
          {...otherProps}
        />
      {/* {showPager && (
        <CustomPaginationDots
          currentIndex={currentIndex}
          totalItems={otherProps.data.length}
          onPressDot={onPressPagination}
        />
      )} */}
       {showPager && (
        <CustomPaginationThumbnails
          currentIndex={currentIndex}
          totalItems={otherProps.data.length}
          onPressDot={onPressPagination}
        />
      )}
    </View>
    </>

  );
}

CustomCarousel.displayName = 'CustomCarousel';

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  carousel: {
    justifyContent:"center",
    alignItems:"center",
    borderRadius: 8,
    overflow: 'hidden',
  },
  paginationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  srOnlyText: {
    position: 'absolute',
    left: -10000,
    top: 'auto',
    width: 1,
    height: 1,
    overflow: 'hidden',
    fontSize: 0,
    opacity: 0,
  },
});
