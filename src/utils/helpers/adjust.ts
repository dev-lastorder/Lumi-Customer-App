import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 6's scale
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// 👇 This is the one you export and use
const adjust = (size: number, factor = 0.5): number => {
  return moderateScale(size, factor);
};

export { scale, verticalScale, moderateScale };
export default adjust;
