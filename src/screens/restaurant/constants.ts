// 🧾 Constants and Static Values
import { SectionList } from 'react-native';
import Animated from 'react-native-reanimated';

export const AnimatedSectionList = Animated.createAnimatedComponent(SectionList) as any;
export const CATEGORY_TABS_HEIGHT = 56;
export const DEFAULT_CURRENCY = 'USD';

export const SWIPE_THRESHOLD = 50;
