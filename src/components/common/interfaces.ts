import { ImageSourcePropType, TextProps } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { IGlobalComponentProps, TextVariant, fontSizes, fontWeights } from '@/utils';
import { FontFamilyName } from './constants';

export interface AnimatedHeaderProps {
  title?: string;
  location?: string;
  showLocationDropdown?: boolean;
  showSettings?: boolean;
  showGoBack?: boolean;
  showMap?: boolean;
  showCart?: boolean;
  scrollY: SharedValue<number>;
  onEndReachedThreshold?: number;
  onLocationPress?: () => void;
  onSettingsPress?: () => void;
  settingsBadge?: string | number | null;
  onMapPress?: () => void;
  onCartPress?: () => void;
  onGoBackPress?: () => void;
  onEndReached?: () => void;
  transparentBG?: boolean;
}

export type FontWeightName = keyof typeof fontWeights;

export type CustomTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: TextVariant;
  fontWeight?: FontWeightName;
  fontSize?: keyof typeof fontSizes;
  responsive?: boolean;
  isDefaultColor?: boolean;
  className?: string;
  fontFamily?: FontFamilyName;
};

export interface CustomAnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  containerClassName?: string;
  animationType?: 'spring' | 'timing';
}

export interface CollapsibleImageHeaderProps {
  restaurantInfo: {
    bannerImageSource: string;
    logoImageSource: string;
    title: string;
    restaurantId: string;
    imageAreaHeight: number;
    stickyHeaderHeight: number;
    [key: string]: any; // for dynamic keys
  };
  scrollY: SharedValue<number>;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onHeartPress?: () => void;
  onMorePress?: () => void;
}

export interface ILoadingPlaceholderComponentProps extends IGlobalComponentProps {
  size?: 'small' | 'large';
  placeholder?: String;
}
