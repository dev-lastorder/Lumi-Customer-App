// React Native
import { TouchableOpacity, View } from 'react-native';

// Interfaces
import { ScreenNavigatorProps } from '@/utils/interfaces';

// Icons
import { Ionicons } from '@expo/vector-icons';

// Expo
import { useRouter } from 'expo-router';

// Components
import { useThemeColor } from '@/hooks';
import { CustomText } from '../CustomText';

export default function ScreenNavigator({ title, link, isLast }: ScreenNavigatorProps) {
  // Hooks
  const appTheme = useThemeColor();
  const router = useRouter();
  console.log("mmy profile title ", title)
  return (
    <TouchableOpacity
      onPress={() => router.push(link)}
      className={`text-text-red dark:text-secondary flex flex-row py-2 justify-between items-center w-full ${!isLast ? 'border-b-[0.7px] border-gray-200 dark:border-dark-border/30' : ''}`}
    >
      <View className="flex flex-row gap-3 items-center">
        <View className="block">
          <CustomText variant="label" fontWeight="medium" fontSize="sm" style={{ color: appTheme.text }}>
            {title}
          </CustomText>
        </View>
      </View>
      <View className="block">
        <Ionicons name="chevron-forward" size={24} color={appTheme.text} />
      </View>
    </TouchableOpacity>
  );
}
