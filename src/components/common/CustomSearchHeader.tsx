// React Native Reanimated
import Animated, { SlideInDown } from 'react-native-reanimated';

// Components
import { AnimatedIconButton } from './Buttons';
import { CustomIcon } from './Icon';

// Hooks
import { useThemeColor } from '@/hooks';
import { useRouter } from 'expo-router';

// React Native
import { TextInput } from 'react-native';

// Utils
import { ISearchHeaderProps, shadowStyle } from '@/utils';

export default function CustomSearchHeader({ enableBack, search, onSearch }: ISearchHeaderProps) {
  // Hooks
  const router = useRouter();
  const appTheme = useThemeColor();
  return (
    <Animated.View
      entering={SlideInDown}
      style={[
        { backgroundColor: appTheme.white, paddingTop: 46, paddingBottom: 12, marginVertical:2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        shadowStyle.card,
      ]}
    >
      {enableBack && (
        <AnimatedIconButton onPress={() => router.back()}>
          <CustomIcon icon={{ size: 22, type: 'Ionicons', name: 'arrow-back', color: appTheme.white }} />
        </AnimatedIconButton>
      )}
      <TextInput
        value={search}
        onChangeText={(val) => onSearch(val)}
        style={{ backgroundColor: 'transparent', width: '80%', color: appTheme.text, paddingHorizontal: 12 }}
        placeholder="Search"
      />
      <AnimatedIconButton onPress={() => onSearch('')} className="p-2 rounded-full">
        <CustomIcon icon={{ size: 12, type: 'MaterialCommunityIcons', name: 'pencil-remove-outline', color: appTheme.white }} />
      </AnimatedIconButton>
    </Animated.View>
  );
}
