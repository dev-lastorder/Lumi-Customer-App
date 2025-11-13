// React Native

// Components
import { useThemeColor } from '@/hooks';
import { AccountHeader, AccountMain } from '../components/account';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';

export default function AccountScreen() {
  // Hooks
  const appTheme = useThemeColor();
  return (
    <ScreenWrapperWithAnimatedTitleHeader
      title="Account"
    >
      <AccountHeader />
      <AccountMain />
    </ScreenWrapperWithAnimatedTitleHeader>
  );
}
