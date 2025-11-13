import { TouchableOpacity, View } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

// Components
import { CustomText, CustomIcon } from '@/components';

export default function VerifyOTPHeaderComponent() {
  // Params
  const { data } = useLocalSearchParams();
  const { email } = data ? JSON.parse(data as string) : { email: '' };
  // Hooks
  const router = useRouter();

  // Handlers
  const onBackPressHandler = () => {
    router.back();
  };

  return (
    <View className="w-full gap-y-4">
      <View className="w-fit">
        <TouchableOpacity onPress={onBackPressHandler}>
          <View className="w-10 bg-gray-200 dark:bg-white/10 bg-dark p-2 rounded-full">
            <CustomIcon icon={{ size: 22, type: 'Ionicons', name: 'arrow-back-outline' }} />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <CustomText fontSize="lg" fontWeight='semibold'>Verify your {!!email ? 'email' : 'phone'}</CustomText>
        <CustomText fontSize="sm">{`Enter the 6 Digit code sent to you over the ${!!email ? 'email' : 'phone'}`}</CustomText>
      </View>
    </View>
  );
}
