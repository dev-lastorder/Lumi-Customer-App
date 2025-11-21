// src/components/checkout/TipOption.tsx

import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';

interface TipOptionProps {
  amount: number;
  isSelected: boolean;
  onPress: () => void;
}

export const TipOption: React.FC<TipOptionProps> = ({ amount, isSelected, onPress }) => {
  // horizontal offsets for each heart
  const xOffsets = [-16, 0, 16] as const;

  // create shared values for each of the 3 hearts
  const heartYs = xOffsets.map(() => useSharedValue(0));
  const heartOpacities = xOffsets.map(() => useSharedValue(0));

  // build animated styles array
  const heartStyles = xOffsets.map((_, i) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: heartYs[i].value }],
      opacity: heartOpacities[i].value,
    }))
  );

  // when this pill becomes selected, trigger three staggered heart animations
  useEffect(() => {
    if (!isSelected) return;

    xOffsets.forEach((_, i) => {
      // reset
      heartYs[i].value = 0;
      heartOpacities[i].value = 1;

      // stagger start
      const delay = i * 100;
      setTimeout(() => {
        heartYs[i].value = withTiming(-24, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        });
        heartOpacities[i].value = withTiming(0, {
          duration: 800,
          easing: Easing.in(Easing.quad),
        });
      }, delay);
    });
  }, [isSelected]);

  return (
    <View className="mr-3 items-center relative">
      {/* render 3 hearts absolutely positioned */}
      {xOffsets.map((dx, i) => (
        <Animated.View
          key={i}
          style={[
            {
              position: 'absolute',
              bottom: 16,
              left: '50%',
              marginLeft: dx,
            },
            heartStyles[i],
          ]}
        >
          <CustomIcon icon={{ type: 'FontAwesome', name: 'heart', size: 10, color: '#FF3B30' }} />
        </Animated.View>
      ))}

      <TouchableOpacity
        onPress={onPress}
        className={`px-5 py-2 border rounded-full ${isSelected ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-700'}`}
      >
        <CustomText
          variant="body"
          fontWeight={isSelected ? 'semibold' : 'normal'}
          className={`${isSelected ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
        >
          {amount} €
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};
