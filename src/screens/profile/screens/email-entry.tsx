import { View, ScrollView } from 'react-native';

// Components
import { EmailEntryHeaderComponent, EmailEntryMainComponent } from '../components';
// Hooks
import { useThemeColor } from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmailEntryScreen() {
  const { background: backgroundColor } = useThemeColor();
  const inset = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} alwaysBounceVertical={false}>
      <View className="flex-1 gap-y-8 p-6" style={{ backgroundColor, paddingTop: inset.top }}>
        <EmailEntryHeaderComponent />
        <EmailEntryMainComponent />
      </View>
    </ScrollView>
  );
}
