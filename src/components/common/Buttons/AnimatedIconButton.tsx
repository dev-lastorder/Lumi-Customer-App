import React from 'react';
import { StyleProp, TouchableOpacity, ViewProps, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface AnimatedIconButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  containerStyle?: ViewProps['style'];
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_TOUCHABLE_CLASS = 'w-10 h-10 rounded-full justify-center items-center  bg-white/80 dark:bg-dark-black/80';

const AnimatedIconButton: React.FC<AnimatedIconButtonProps> = ({
  children,
  onPress = () => {},
  containerStyle,
  style,
  className = DEFAULT_TOUCHABLE_CLASS,
}) => {
  // Hooks
  const scaleValue = useSharedValue(1);

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.92, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View style={[animatedWrapperStyle, containerStyle]}>
      <TouchableOpacity
        className={className}
        style={style}
        onPressIn={handlePressIn}
        onPress={onPress}
        onPressOut={handlePressOut}
        activeOpacity={1}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedIconButton;
