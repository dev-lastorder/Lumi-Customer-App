// Components
import { CustomHeader, ScreenWrapperWithAnimatedHeader } from '@/components';
import { useThemeColor } from '@/hooks';
import { useLocalSearchParams } from 'expo-router';
import { EditProfileContentHeader, EditProfileContentMain } from '../components/edit-profle-content';

export default function EditProfileContentScreen() {
  // Hooks
  const { title, userId, content } = useLocalSearchParams();
  const appTheme = useThemeColor();
  return (
    <ScreenWrapperWithAnimatedHeader
      title="Account"
      showSettings={false}
      showGoBack={true}
      showLocationDropdown={false}
      showMap={false}
      contentContainerStyle={{ flexGrow: 1, paddingVertical: 16, backgroundColor: appTheme.background }}
      scrollEnabled={true}
    >
      <EditProfileContentHeader title={title as string} userId={userId as string} />
      <EditProfileContentMain title={title as string} userId={userId as string} content={content as string} />
    </ScreenWrapperWithAnimatedHeader>
  );
}
