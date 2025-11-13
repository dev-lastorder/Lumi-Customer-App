import { ImageSourcePropType, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleProp, ViewProps, ViewStyle } from 'react-native';
import Animated, { AnimateProps, SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { AnimatedHeaderProps } from '../common';

export interface ScrollViewPassthroughProps {
  style?: AnimateProps<ViewProps>['style'];
  scrollEventThrottle?: number;
  bounces?: boolean;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: AnimateProps<ViewProps>['style'];
  onScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEnabled?: boolean;
}

export interface ScreenWrapperWithAnimatedHeaderProps extends ScrollViewPassthroughProps, Omit<AnimatedHeaderProps, 'scrollY'> {
  children: React.ReactNode;
  stikcyComponents?: React.ReactNode;
  headerBaseHeight?: number;
}

export interface CollapsibleHeaderScreenWrapperProps {
  headerBannerImageSource: string;
  logoImageSource: string;
  headerTitle: string;
  onHeaderSearchPress?: () => void;
  onHeaderHeartPress?: () => void;
  onHeaderMorePress?: () => void;
  headerImageAreaHeight?: number;
  headerStickyHeight?: number;
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  scrollViewBottomPadding?: number;
  scrollY: SharedValue<number>; // For header animations, updated by parent's scrollHandlerObject

  // Props for useTabScrollSync integration
  scrollViewRef?: React.RefObject<Animated.ScrollView | null>;
  scrollHandlerObject?: ReturnType<typeof useAnimatedScrollHandler>; // The Reanimated scroll handler from parent
  onScrollViewLayout?: (event: LayoutChangeEvent) => void; // For hook's handleContentScrollViewLayout
  onScrollViewContentSizeChange?: (width: number, height: number) => void; // For hook's handleContentScrollViewContentSizeChange

  stickyHeaderContent?: React.ReactNode;
  stickyHeaderContentHeight?: number;
  showStickyHeaderContentThreshold?: number;

  // Extra
  data?: any;
}
