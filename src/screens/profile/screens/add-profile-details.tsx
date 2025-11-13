import { ScrollView, View } from 'react-native';

// Components
import { AddProfileDetailsSetupHeaderComponent, AddProfileDetailsSetupMainComponent } from '../components';

// Hooks
import { useThemeColor } from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifyOTPScreen() {
  const { background: backgroundColor } = useThemeColor();
  const inset = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
      <View className="flex-1 gap-y-8 p-6" style={{ backgroundColor, paddingTop: inset.top }}>
        <AddProfileDetailsSetupHeaderComponent />
        <AddProfileDetailsSetupMainComponent />
      </View>
    </ScrollView>
  );
}
