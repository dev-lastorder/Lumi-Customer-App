import { TouchableOpacity, View } from 'react-native';
import React from 'react';

// Components
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmailEntryHeaderComponent() {
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
        <CustomText fontSize="lg" fontWeight='semibold'>Continue with email</CustomText>
        <CustomText fontSize="sm">{"We'll get you going with Enatega in no time"}</CustomText>
      </View>
    </View>
  );
}
