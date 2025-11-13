// React Native
import { View } from 'react-native';

// Components
import { CustomText, ScreenHeader } from '@/components';

// Hooks
import { useAppSelector } from '@/redux';

// Icons
import { useThemeColor } from '@/hooks';

export default function ProfileHeader() {
  // Hooks
  const user = useAppSelector((state) => state.auth.user);
  
  const appTheme = useThemeColor();
  return (
    <View className="flex h-auto flex-col justify-center items-center bg-background dark:bg-dark-background">
      <View className="rounded-sm my-auto flex h-12 w-full flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 overflow-hidden">
          <CustomText
            variant="heading3"
            fontWeight="bold"
            fontSize="2xl"
            className="mr-1"
          >
            Hi
          </CustomText>

          <CustomText
            variant="heading3"
            fontWeight="bold"
            fontSize="2xl"
            numberOfLines={1}
            ellipsizeMode="tail"
            className="flex-1"
          >
            {` ${user?.name}!`}
          </CustomText>
        </View>

        <View className="ml-2 bg-[rgb(181,252,186)] rounded-full w-12 h-12 overflow-hidden items-center justify-center">
          <CustomText
            variant="body"
            fontSize="xl"
            style={{ paddingTop: 4, color: "gray", margin: "auto" }}
          >
            {user?.name
              ?.split(" ")[0]?.[0]
              ?.concat(
                user?.name?.split(" ")[1]?.[0] ??
                user?.name?.split(" ")[0]?.[1] ?? ""
              )
              .toUpperCase()}
          </CustomText>
        </View>
      </View>
    </View>
  );
}
