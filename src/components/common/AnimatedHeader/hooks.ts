import { usePathname } from 'expo-router';
import { Extrapolate, SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';

export const useAnimatedHeaderStyles = (scrollY: SharedValue<number>) => {

  const beforeLocationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0])
    const translateY = interpolate(scrollY.value, [0, 100], [0, -30], Extrapolate.CLAMP)

    return {
      opacity: opacity,
      transform: [{ translateY }]
    }
  })

  const afterLocationStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [60, 160], [0, 1])
    const translateY = interpolate(scrollY.value, [60, 160], [-30, 0], Extrapolate.CLAMP)

    return {
      opacity: opacity,
      transform: [{ translateY }]
    }
  })

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 80], [0, 1])

    return {
      opacity: opacity
    }
  })

  return { beforeLocationStyle, afterLocationStyle, overlayStyle };
};


export const useGoBackIcon = () => {
  const pathname = usePathname();
  return pathname.includes('help') ? 'arrow-down' : 'arrow-back';
};
