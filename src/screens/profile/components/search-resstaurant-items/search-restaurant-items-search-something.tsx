import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function SearchSomeThing() {
  return (
    <Animated.View style={{ gap: 1 }}>
      <Animated.Image
        source={require('@/assets/GIFs/search-something.gif')}
        entering={FadeIn}
        exiting={FadeOut}
        width={40}
        height={40}
        className={` w-[100%] h-[60%] mx-auto block `}
      />
    </Animated.View>
  );
}
