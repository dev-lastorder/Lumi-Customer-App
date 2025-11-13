// hooks/useScrollXTracker.ts
import { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';

export const useScrollXTracker = () => {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return { scrollX, onScroll };
};
