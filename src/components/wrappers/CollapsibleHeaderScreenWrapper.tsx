// src/components/wrappers/CollapsibleHeaderScreenWrapper.tsx
import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated'; // useAnimatedScrollHandler might not be needed here if passed from parent
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { CollapsibleHeaderScreenWrapperProps } from './interfaces';
import { DEFAULT_IMAGE_AREA_HEIGHT, DEFAULT_STICKY_HEADER_HEIGHT } from '../common/constants';
import CollapsibleImageHeaderWithControls from '../common/CollapsibleImageHeaderWithControls';

const CollapsibleHeaderScreenWrapper: React.FC<CollapsibleHeaderScreenWrapperProps> = ({
  headerBannerImageSource,
  logoImageSource,
  headerTitle,
  onHeaderSearchPress,
  onHeaderHeartPress,
  onHeaderMorePress,
  headerImageAreaHeight = DEFAULT_IMAGE_AREA_HEIGHT,
  headerStickyHeight = DEFAULT_STICKY_HEADER_HEIGHT,
  children,
  contentContainerStyle,
  scrollViewBottomPadding = 20,
  scrollY, // This is updated by the scrollHandlerObject passed from parent
  scrollViewRef,
  scrollHandlerObject, // Receives the scroll handler from parent
  onScrollViewLayout,
  onScrollViewContentSizeChange,
  stickyHeaderContent,
  stickyHeaderContentHeight = 0,
  showStickyHeaderContentThreshold,
  data,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // No local useAnimatedScrollHandler needed here, as it's passed via scrollHandlerObject
  const animatedStickyContentStyle = useAnimatedStyle(() => {
    const isValidThreshold = typeof showStickyHeaderContentThreshold === 'number';
    // Use scrollY (which is updated by the parent's scrollHandlerObject)
    const isVisible = isValidThreshold && scrollY.value >= showStickyHeaderContentThreshold;

    return {
      position: 'absolute',
      top: headerStickyHeight + insets.top,
      left: 0,
      right: 0,
      height: stickyHeaderContentHeight,
      zIndex: 5,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'auto' : 'none',
    };
  });

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <CollapsibleImageHeaderWithControls
        restaurantInfo={{
          bannerImageSource: headerBannerImageSource,
          logoImageSource: logoImageSource,
          title: headerTitle,
          restaurantId: data.restaurantId,
          imageAreaHeight: headerImageAreaHeight,
          stickyHeaderHeight: headerStickyHeight,
        }}
        scrollY={scrollY} // Use the shared scrollY value
        onBackPress={() => router.back()}
        onSearchPress={onHeaderSearchPress}
        onHeartPress={onHeaderHeartPress}
        onMorePress={onHeaderMorePress}
      />

      {stickyHeaderContent && <Animated.View style={animatedStickyContentStyle}>{stickyHeaderContent}</Animated.View>}

      <Animated.ScrollView
        ref={scrollViewRef} // Ref for useTabScrollSync
        onScroll={scrollHandlerObject} // Use the scroll handler passed from parent
        scrollEventThrottle={16} // Important for onScroll events to fire frequently enough
        showsVerticalScrollIndicator={false}
        onLayout={onScrollViewLayout} // For useTabScrollSync (content ScrollView layout)
        onContentSizeChange={onScrollViewContentSizeChange} // For useTabScrollSync (content ScrollView content size change)
        style={{ flex: 1 }}
        contentContainerStyle={[
          {
            paddingTop: headerImageAreaHeight, // Initial padding for the image
            paddingBottom: insets.bottom + scrollViewBottomPadding,
          },
          contentContainerStyle,
        ]}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

export default CollapsibleHeaderScreenWrapper;
