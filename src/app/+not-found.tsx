import { Link, Stack } from 'expo-router';
import { CustomText } from '@/components';
import { View } from 'react-native';
import { useTranslation } from '@/hooks';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5">
        <CustomText variant="heading1" fontWeight="bold" className="text-center">
          {t("This screen doesn't exist.")}{' '}
        </CustomText>

        <Link href="/" className="mt-4">
          <CustomText variant="heading1" className="text-blue-500 underline text-base text-center">
            {t('Go to home screen!')}
          </CustomText>
        </Link>
      </View>
    </>
  );
}
