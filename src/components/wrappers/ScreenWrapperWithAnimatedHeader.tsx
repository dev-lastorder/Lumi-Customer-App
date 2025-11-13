import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Animated, { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedHeader } from '../common';
import { ScreenWrapperWithAnimatedHeaderProps } from './interfaces';

const ScreenWrapperWithAnimatedHeader: React.FC<ScreenWrapperWithAnimatedHeaderProps> = ({
  children,
  headerBaseHeight = 50,
  scrollEventThrottle = 16,
  style,
  title,
  location,
  showLocationDropdown,
  showSettings,
  showMap,
  showGoBack = false,
  showCart = false,
  onLocationPress,
  onSettingsPress,
  onMapPress,
  onCartPress,
  contentContainerStyle,
  stikcyComponents = <></>,
  onEndReachedThreshold = 0.5,
  settingsBadge = null,
  onEndReached,
  transparentBG= false,
  ...restScrollViewProps
}) => {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const headerMaxHeight = headerBaseHeight + insets.top;

  const handleScroll = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        if (onEndReached) {
          const { layoutMeasurement, contentOffset, contentSize } = event;
          if (contentSize.height === 0) return
          const thresholdDistanceFromBottom = layoutMeasurement.height * onEndReachedThreshold;
          const scrolledBottomPosition = layoutMeasurement.height + contentOffset.y;
          const scrollTriggerPoint = contentSize.height - thresholdDistanceFromBottom;

          const isScrolledToBottom = scrolledBottomPosition >= scrollTriggerPoint;
          if (isScrolledToBottom) {
            runOnJS(onEndReached)();
          }
        }
      },
    },
    [onEndReached, onEndReachedThreshold] 
  );

  console.log("location",location)

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <AnimatedHeader
        scrollY={scrollY}
        title={title}
        location={location}
        showLocationDropdown={showLocationDropdown}
        showSettings={showSettings}
        showMap={showMap}
        showCart={showCart}
        showGoBack={showGoBack}
        onGoBackPress={() => router.back()}
        onLocationPress={onLocationPress}
        onSettingsPress={onSettingsPress}
        settingsBadge={settingsBadge}
        onMapPress={onMapPress}
        onCartPress={onCartPress}
        transparentBG={transparentBG}
      />

      <Animated.ScrollView
        style={[{}, style]}
        contentContainerStyle={[
          {
            position: 'relative',
            flexGrow: 1,
          },
          contentContainerStyle,
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={false}
        {...restScrollViewProps}
      >
        {children}
      </Animated.ScrollView>
      {stikcyComponents}
    </View>
  );
};

export default ScreenWrapperWithAnimatedHeader;
