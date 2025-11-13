import { ImageSourcePropType } from 'react-native';
import Animated from 'react-native-reanimated';

export type CarouselImageItemProps = {
  image: string;
  index: number;
  scrollX: Animated.SharedValue<number>;
};
