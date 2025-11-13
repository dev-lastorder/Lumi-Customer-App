import { CustomIcon, CustomText } from "@/components"
import { useThemeColor } from "@/hooks";
import { useAppSelector } from "@/redux";
import { useState } from "react";
import { LayoutChangeEvent, TouchableOpacity, View } from "react-native"
import Animated, { Extrapolate, interpolate, interpolateColor, runOnJS, SharedValue, useAnimatedStyle, useDerivedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ScreenAnimatedTitleHeader = ({ title, onBack, scrollY }: { title: string, onBack: () => void, scrollY: SharedValue<number> }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets()
  const { bgLight, background } = useThemeColor()


  const handleLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height
    setHeaderHeight(height);
  }

  const animatedTextStyle = useAnimatedStyle(() => {
    if (headerHeight === 0) return { opacity: 0 };
    const opacity = interpolate(scrollY.value, [10, headerHeight], [0, 1]);
    const translateY = interpolate(scrollY.value, [10, headerHeight], [20, 0], Extrapolate.CLAMP);
    return {
      transform: [{ translateY }],
      opacity: opacity,

    }
  })
  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 80], [0, 1]);
    return {
      opacity,
    };
  });



  return (
    <View className='relative justify-center '>
      <Animated.View className='absolute flex-1 inset-0 bg-light-grey dark:bg-dark-bgLight' style={overlayStyle} />
      <Animated.View className="flex-row items-end px-4 pb-6" onLayout={handleLayout} style={[{ paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={onBack}
          className="w-12 h-12 rounded-full bg-icon-background dark:bg-dark-icon-background items-center justify-center mr-6"
        >
          <CustomIcon
            className="text-text dark:text-dark-text"
            icon={{ name: "chevron-back", type: "Ionicons", size: 20, }}
            isDefaultColor={false} />
        </TouchableOpacity>
        <Animated.View style={animatedTextStyle} >
          <CustomText
            fontWeight="bold"
            variant='heading2'
            fontSize='xl'>
            {title}
          </CustomText>
        </Animated.View>
      </Animated.View>
    </View>
  )
}
