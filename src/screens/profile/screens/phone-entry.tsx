import { View, ScrollView } from 'react-native';
import React from 'react';

// Hooks
import { useThemeColor } from '@/hooks';

// Components
import { PhoneEntryHeaderComponent, PhoneEntryMainComponent } from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PhoneEntryScreen() {
  const { background: backgroundColor } = useThemeColor();
  const inset = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
      <View className="flex-1 gap-y-8 p-6" style={{ backgroundColor, paddingTop: inset.top }}>
        <PhoneEntryHeaderComponent />
        <PhoneEntryMainComponent />
      </View>
    </ScrollView>
  );
}
