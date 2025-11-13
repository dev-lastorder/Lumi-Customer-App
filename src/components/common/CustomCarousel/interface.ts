import { IGlobalComponentProps } from '@/utils/interfaces';
import { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

export interface ICustomCarousel<T> extends IGlobalComponentProps, ViewProps {
  showPager?: boolean;
  data: T[];
  renderItem: (props: CarouselRenderItemInfo<T>) => React.ReactElement;
  width?: number;
  height?: number;

  autoPlay?: boolean;
  autoPlayInterval?: number;
  [key: string]: any;
  carouselStyle?: StyleProp<ViewStyle>;
}
