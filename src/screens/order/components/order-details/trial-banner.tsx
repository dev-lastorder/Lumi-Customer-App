import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomText } from '@/components';
import { CustomIcon } from '@/components/common/Icon';

export default function TrialBanner({ text }: { text: string }) {
  return (
    <View className="absolute bottom-16 left-4 right-4 bg-primary/10 rounded-lg flex-row items-center px-4 py-2 shadow-lg">
      <CustomIcon icon={{ type: 'MaterialCommunityIcons', name: 'rocket-launch', size: 20, color: '#3B82F6' }} />
      <CustomText variant="body" fontWeight="semibold" className="mx-2 flex-1">
        {text}
      </CustomText>
      <TouchableOpacity>
        <CustomIcon icon={{ type: 'Feather', name: 'chevron-right', size: 20 }} />
      </TouchableOpacity>
    </View>
  );
}
