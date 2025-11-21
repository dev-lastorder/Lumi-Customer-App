import React from 'react';
import { ScrollView, View } from 'react-native';

// Components
import { LoginHeaderComponent, LoginMainComponent } from '../components';

// Hooks
import { useThemeColor } from '@/hooks';

const AddProfileDetailsSetup = () => {
  const { background: backgroundColor } = useThemeColor();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
      <View className="flex-1 items-center gap-y-8" style={{ backgroundColor }}>
        <LoginHeaderComponent />
        <LoginMainComponent />
      </View>
    </ScrollView>
  );
};

export default AddProfileDetailsSetup;
