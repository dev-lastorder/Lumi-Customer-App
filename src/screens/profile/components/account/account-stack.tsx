// Components
import { CustomText } from '@/components';

// Hooks
import { useThemeColor } from '@/hooks';
import { RelativePathString, useRouter } from 'expo-router';

// Interfaces
import { AccountStackProps } from '@/utils/interfaces';

// Icons
import { Ionicons } from '@expo/vector-icons';

// React Native
import { useAppSelector } from '@/redux';
import { Linking, TouchableOpacity, View } from 'react-native';

export default function AccountStack({ title, content, route, isExternal }: AccountStackProps) {
  // Hooks
  const appTheme = useThemeColor();
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user.userId);

  // Icons
  const renderRightIcon = () => {
    if (isExternal) {
      return <Ionicons name="open-outline" size={24} color="#6B7280" />;
    } else {
      return <Ionicons name="chevron-forward" size={24} color="#6B7280" />;
    }
  };
  return (
    <View className='px-[18px]'>
      <View className="w-full border-b  border-gray-100 dark:border-dark-border/30">
        <TouchableOpacity
          className="py-3.5 "
          activeOpacity={0.6}
          onPress={() => {
            if (!isExternal) {
              router.push({
                pathname: route as RelativePathString,
                params: { userId, title, content },
              });
            } else {
              Linking.openURL(route as string);
            }
          }}
        >
          <View className="flex-row items-center justify-between ">
            <View className="flex-shrink">
              <CustomText variant="label" fontWeight="semibold" fontSize="md" style={{ color: appTheme.text }}>
                {title === 'Email Address' ? 'Email' : title}
              </CustomText>
            </View>

            <View className="flex-row items-center gap-1">
              {content && (
                <CustomText variant="caption" style={{ color: appTheme.text }} fontSize="sm">
                  {content}
                </CustomText>
              )}
              {renderRightIcon()}
            </View>
          </View>
        </TouchableOpacity>

        {/* <View className="h-[1px] w-full bg-gray-200 dark:border-dark-border/30 opacity-25" /> */}
      </View>
    </View>
  );
}
