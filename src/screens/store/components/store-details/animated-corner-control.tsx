import { CustomIcon, CustomText } from '@/components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const BUTTON_SIZE = 42;
const STEPPER_WIDTH = 108;
const ANIMATION_DURATION = 300;
const HIDE_DELAY = 3000;

export interface AnimatedCornerControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const useAnimatedCornerControl = ({ quantity, onIncrement, onDecrement }: AnimatedCornerControlProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  const width = useSharedValue(BUTTON_SIZE);
  const scale = useSharedValue(1);

  const animateWidth = useCallback(
    (targetWidth: number) => {
      const timingConfig = {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      };
      width.value = withTiming(targetWidth, timingConfig, (finished) => {
        if (finished) {
          runOnJS(setIsExpanded)(targetWidth === STEPPER_WIDTH);
        }
      });
    },
    [width]
  );

  const animateScale = useCallback(() => {
    scale.value = withSequence(withTiming(1.2, { duration: 100 }), withTiming(1, { duration: 100 }));
  }, [scale]);

  const startHideTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      animateWidth(BUTTON_SIZE);
    }, HIDE_DELAY);
  }, [animateWidth]);

  useEffect(() => {
    if (isExpanded) {
      startHideTimer();
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isExpanded, startHideTimer]);

  useEffect(() => {
    if (quantity === 0 && isExpanded) {
      animateWidth(BUTTON_SIZE);
    }
  }, [quantity, isExpanded, animateWidth]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleAddPress = () => {
    onIncrement();
    animateScale();
    if (!isExpanded) {
      animateWidth(STEPPER_WIDTH);
    } else {
      startHideTimer();
    }
  };

  const handleDecrementPress = () => {
    onDecrement();
    animateScale();
    if (quantity - 1 === 0) {
      animateWidth(BUTTON_SIZE);
    } else {
      startHideTimer();
    }
  };

  const animatedContainerStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const animatedQuantityStyle = useAnimatedStyle((): ViewStyle => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return {
    isExpanded,
    animatedContainerStyle,
    animatedQuantityStyle,
    handleAddPress,
    handleDecrementPress,
  };
};

const CollapsedView = ({ quantity, onPress }: { quantity: number; onPress: () => void }) => (
  <TouchableOpacity className="absolute inset-0 items-center justify-center rounded-bl-full" onPress={onPress} activeOpacity={0.7}>
    {quantity > 0 ? (
      <CustomText variant="body" fontWeight="semibold" className="text-dark-primary" isDefaultColor={false}>
        {quantity}
      </CustomText>
    ) : (
      <CustomIcon icon={{ name: 'add', type: 'MaterialIcons', size: 22 }} className="text-dark-primary" />
    )}
  </TouchableOpacity>
);

const ExpandedView = ({
  quantity,
  onIncrement,
  onDecrement,
  animatedQuantityStyle,
}: {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  animatedQuantityStyle: any;
}) => (
  <View className="absolute inset-0 flex-row items-center justify-between">
    <TouchableOpacity className="h-full flex-1 items-center justify-center" onPress={onDecrement} activeOpacity={0.7}>
      <CustomIcon icon={{ name: 'remove', type: 'MaterialIcons', size: 22 }} className="text-dark-primary" />
    </TouchableOpacity>

    <Animated.View className="h-full min-w-[28px] items-center justify-center px-1" style={animatedQuantityStyle}>
      <CustomText variant="body" fontWeight="semibold" className="text-dark-primary" isDefaultColor={false}>
        {quantity}
      </CustomText>
    </Animated.View>

    <TouchableOpacity className="h-full flex-1 items-center justify-center" onPress={onIncrement} activeOpacity={0.7}>
      <CustomIcon icon={{ name: 'add', type: 'MaterialIcons', size: 22 }} className="text-dark-primary" />
    </TouchableOpacity>
  </View>
);

const AnimatedCornerControl: React.FC<AnimatedCornerControlProps> = (props) => {
  const { quantity } = props;
  const { isExpanded, animatedContainerStyle, animatedQuantityStyle, handleAddPress, handleDecrementPress } = useAnimatedCornerControl(props);

  return (
    <Animated.View
      className="absolute -top-px -right-px h-12 flex-row items-center justify-center overflow-hidden rounded-bl-full rounded-tl-3xl rounded-tr-lg bg-background/80 shadow-md dark:bg-dark-background/80"
      style={animatedContainerStyle}
    >
      {isExpanded ? (
        <ExpandedView
          quantity={quantity}
          onIncrement={handleAddPress}
          onDecrement={handleDecrementPress}
          animatedQuantityStyle={animatedQuantityStyle}
        />
      ) : (
        <CollapsedView quantity={quantity} onPress={handleAddPress} />
      )}
    </Animated.View>
  );
};

export default AnimatedCornerControl;
