// CollapsibleImageHeaderWithControls.tsx
import React from 'react';
import { Image, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@/redux';
import { AnimatedIconButton } from './Buttons';
import { CustomIcon } from './Icon';
import { CustomText } from './CustomText';
import { CollapsibleImageHeaderProps } from './interfaces';
import adjust from '@/utils/helpers/adjust';

// --- Constants ---

const LOGO_SIZE = 80;
const LOGO_OFFSET = LOGO_SIZE / 2;

// --- Logic Hooks (SRP) ---

/**
 * 🧠 State Management Hook: Determines if a restaurant is favorited by the user.
 */
const useFavoriteStatus = (restaurantId: string): boolean => {
  const favoriteIds = useAppSelector((state) => state.auth.user?.favourite) || [];
  return favoriteIds.includes(restaurantId);
};

/**
 * 🔄 Animation Logic Hook: Manages all animation styles for the header.
 */
const useHeaderAnimations = (scrollY: SharedValue<number>, imageAreaHeight: number, stickyHeaderHeight: number) => {
  const headerScrollDistance = imageAreaHeight - stickyHeaderHeight;

  const imageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, headerScrollDistance * 0.75, headerScrollDistance], [1, 0.3, 0], Extrapolate.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, imageAreaHeight], [0, imageAreaHeight * 0.3], Extrapolate.CLAMP),
      },
      { scale: 1.2 },
    ],
  }));

  const floatingHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, headerScrollDistance * 0.5, headerScrollDistance * 0.75], [1, 0.5, 0], Extrapolate.CLAMP),
  }));

  const stickyHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [headerScrollDistance * 0.75, headerScrollDistance], [0, 1], Extrapolate.CLAMP),
  }));

  const stickyHeaderTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [headerScrollDistance * 0.9, headerScrollDistance], [0, 1], Extrapolate.CLAMP),
  }));

  const logoStyle = useAnimatedStyle(() => {
    const fadeOutThreshold = headerScrollDistance * 0.8;
    return {
      opacity: interpolate(scrollY.value, [fadeOutThreshold * 0.6, fadeOutThreshold], [1, 0], Extrapolate.CLAMP),
      transform: [
        {
          scale: interpolate(scrollY.value, [0, fadeOutThreshold], [1, 0.6], Extrapolate.CLAMP),
        },
        {
          translateY: interpolate(scrollY.value, [0, headerScrollDistance], [0, -imageAreaHeight * 0.9], Extrapolate.CLAMP),
        },
      ],
    };
  });

  return {
    imageStyle,
    floatingHeaderStyle,
    stickyHeaderStyle,
    stickyHeaderTextStyle,
    logoStyle,
  };
};

// --- UI Components (SRP) ---

interface BackgroundImageProps {
  source: string;
  height: number;
  style: StyleProp<ViewStyle>;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({ source, height, style }) => (
  <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, height }, style]}>
    <Animated.Image source={{ uri: source }} className="w-full h-full" resizeMode="cover" />
    <View className="absolute inset-0 bg-black/60" />
  </Animated.View>
);

interface RestaurantLogoProps {
  source: string;
  topPosition: number;
  style: StyleProp<ViewStyle>;
}

const RestaurantLogo: React.FC<RestaurantLogoProps> = ({ source, topPosition, style }) => (
  <Animated.View
    className="absolute z-10 rounded-2xl border bg-background dark:bg-dark-background p-1 border-border dark:border-dark-border/30 left-1/2"
    style={[{ top: topPosition, width: LOGO_SIZE, height: LOGO_SIZE, marginLeft: -LOGO_OFFSET }, style]}
  >
    <Image source={{ uri: source }} className="w-full h-full rounded-xl" resizeMode="cover" />
  </Animated.View>
);

interface HeaderProps {
  style: StyleProp<ViewStyle>;
  insets: EdgeInsets;
  onBackPress?: () => void;
}

interface StickyHeaderProps extends HeaderProps {
  title: string;
  height: number;
  textStyle: StyleProp<TextStyle>;
  onMorePress?: () => void;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ title, onBackPress, onMorePress, style, textStyle, insets, height }) => (
  <Animated.View
    className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 z-20 bg-white dark:bg-dark-background"
    style={[{ height: height + insets.top, paddingTop: insets.top }, style]}
  >
    <AnimatedIconButton onPress={onBackPress}>
      <CustomIcon icon={{ type: 'Ionicons', name: 'arrow-back', size: adjust(24) }} className="text-text dark:text-dark-text" />
    </AnimatedIconButton>
    <Animated.Text style={[{ fontSize: adjust(16) }, textStyle]} className="font-bold text-text dark:text-dark-text">
      {title}
    </Animated.Text>
    <AnimatedIconButton onPress={onMorePress}>
      <CustomIcon icon={{ type: 'Ionicons', name: 'ellipsis-horizontal', size: adjust(24) }} className="text-text dark:text-dark-text" />
    </AnimatedIconButton>
  </Animated.View>
);

interface FloatingHeaderProps extends HeaderProps {
  title: string;
  isFav: boolean;
  onSearchPress?: () => void;
  onHeartPress?: () => void;
}

const FloatingHeader: React.FC<FloatingHeaderProps> = ({ title, isFav, onBackPress, onSearchPress, onHeartPress, style, insets }) => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <Animated.View
      className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 gap-4 z-20"
      style={[{ paddingTop: insets.top }, style]}
    >
      <AnimatedIconButton onPress={onBackPress}>
        <CustomIcon icon={{ type: 'Ionicons', name: 'arrow-back', size: adjust(24) }} className="text-white" />
      </AnimatedIconButton>
      <AnimatedIconButton
        onPress={onSearchPress}
        containerStyle={{ flex: 1 }}
        className="bg-white/80 dark:bg-black/80 rounded-full flex-row items-center px-4 py-2 h-10 justify-start gap-2"
      >
        <CustomIcon icon={{ type: 'Ionicons', name: 'search', size: adjust(20) }} className="text-text/70 dark:text-white/60" />
        <CustomText variant='caption' className="text-text/70 dark:text-white/60">{title}</CustomText>
      </AnimatedIconButton>
      {
        user.id && (
          <AnimatedIconButton onPress={onHeartPress}>
            <CustomIcon icon={{ type: 'Ionicons', name: isFav ? 'heart' : 'heart-outline', size: adjust(24) }} className="text-white" />
          </AnimatedIconButton>
        )

      }
    </Animated.View>
  )
};

// --- Main Exported Component ---

export const CollapsibleImageHeaderWithControls: React.FC<CollapsibleImageHeaderProps> = ({
  restaurantInfo,
  scrollY,
  onBackPress,
  onSearchPress,
  onHeartPress,
  onMorePress,
}) => {
  const { bannerImageSource, imageAreaHeight, logoImageSource, restaurantId, stickyHeaderHeight, title } = restaurantInfo;

  const isFav = useFavoriteStatus(restaurantId);
  const insets = useSafeAreaInsets();
  const animations = useHeaderAnimations(scrollY, imageAreaHeight, stickyHeaderHeight);

  return (
    <>
      <BackgroundImage source={bannerImageSource} height={imageAreaHeight} style={animations.imageStyle} />
      <RestaurantLogo source={logoImageSource} topPosition={imageAreaHeight - LOGO_OFFSET} style={animations.logoStyle} />
      <StickyHeader
        title={title}
        onBackPress={onBackPress}
        onMorePress={onMorePress}
        style={animations.stickyHeaderStyle}
        textStyle={animations.stickyHeaderTextStyle}
        insets={insets}
        height={stickyHeaderHeight}
      />
      <FloatingHeader
        title={title}
        isFav={isFav}
        onBackPress={onBackPress}
        onSearchPress={onSearchPress}
        onHeartPress={onHeartPress}
        style={animations.floatingHeaderStyle}
        insets={insets}
      />
    </>
  );
};

export default CollapsibleImageHeaderWithControls;
