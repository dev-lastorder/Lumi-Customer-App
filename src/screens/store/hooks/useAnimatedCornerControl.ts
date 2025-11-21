// src/hooks/useAnimatedCornerControl.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { Easing, runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const DEFAULT_BUTTON_SIZE = 36;
const DEFAULT_STEPPER_WIDTH = 100;
const DEFAULT_ANIMATION_DURATION = 300;
const DEFAULT_HIDE_DELAY = 1500;

export interface UseAnimatedCornerControlProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  buttonSize?: number;
  stepperWidthValue?: number;
  animationDuration?: number;
  hideDelay?: number;
}

export const useAnimatedCornerControl = ({
  quantity,
  onIncrement,
  onDecrement,
  buttonSize = DEFAULT_BUTTON_SIZE,
  stepperWidthValue = DEFAULT_STEPPER_WIDTH,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  hideDelay = DEFAULT_HIDE_DELAY,
}: UseAnimatedCornerControlProps) => {
  const [isExpanded, setIsExpanded] = useState(quantity > 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const width = useSharedValue(quantity > 0 ? stepperWidthValue : buttonSize);
  const scale = useSharedValue(1);

  const timingConfig = {
    duration: animationDuration,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  const onAnimateWidthFinish = useCallback(
    (finished: boolean | undefined, toValue: number) => {
      if (finished) {
        runOnJS(setIsExpanded)(toValue === stepperWidthValue);
      }
    },
    [stepperWidthValue]
  );

  const animateWidth = useCallback(
    (toValue: number) => {
      width.value = withTiming(toValue, timingConfig, (finished) => onAnimateWidthFinish(finished, toValue));
    },
    [width, timingConfig, onAnimateWidthFinish]
  );

  const animateScale = useCallback(() => {
    scale.value = 1; // Reset before starting
    scale.value = withSequence(
      withTiming(1.2, { duration: 100, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 100, easing: Easing.in(Easing.ease) })
    );
  }, [scale]);

  const startHideTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      animateWidth(buttonSize);
    }, hideDelay);
  }, [animateWidth, buttonSize, hideDelay]);

  const resetTimerAndExpand = useCallback(() => {
    // If not fully expanded (i.e., width is at buttonSize), expand it.
    // isExpanded might not have updated yet if an animation is in progress.
    // So checking width.value is more reliable here for initiating expansion.
    if (width.value === buttonSize) {
      animateWidth(stepperWidthValue);
    }
    startHideTimer(); // Always reset the timer
  }, [animateWidth, startHideTimer, stepperWidthValue, buttonSize, width]);

  const controlHandleAddPress = useCallback(() => {
    // For the initial '+' button when collapsed
    onIncrement();
    runOnJS(animateScale)();
    resetTimerAndExpand();
  }, [onIncrement, animateScale, resetTimerAndExpand]);

  const controlHandleDecrement = useCallback(() => {
    // For '-' in expanded stepper
    onDecrement();
    runOnJS(animateScale)();
    resetTimerAndExpand(); // Keeps it expanded (if quantity > 0) and resets timer
  }, [onDecrement, animateScale, resetTimerAndExpand]);

  const controlHandleIncrement = useCallback(() => {
    // For '+' in expanded stepper
    onIncrement();
    runOnJS(animateScale)();
    resetTimerAndExpand(); // Keeps it expanded and resets timer
  }, [onIncrement, animateScale, resetTimerAndExpand]);

  // Effect to react to quantity changes (external or from interactions)
  useEffect(() => {
    if (quantity === 0) {
      // If quantity becomes 0, collapse the control.
      if (width.value !== buttonSize) {
        // Check current animated width
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        animateWidth(buttonSize);
      }
    } else {
      // quantity > 0
      // If quantity is positive
      if (width.value === buttonSize) {
        // And the control is currently collapsed, expand it.
        // This handles initial mount with quantity > 0, external changes, or recovery after timer collapse.
        animateWidth(stepperWidthValue);
      }
      // Whether it was already expanded or just expanded, (re)start the hide timer.
      startHideTimer();
    }
  }, [quantity, buttonSize, stepperWidthValue, animateWidth, startHideTimer, width]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: buttonSize, // Control height is fixed
    };
  });

  const animatedQuantityStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return {
    isExpanded, // React state for conditional rendering of UI parts
    animatedContainerStyle,
    animatedQuantityStyle,
    controlHandleAddPress,
    controlHandleIncrement,
    controlHandleDecrement,
  };
};
