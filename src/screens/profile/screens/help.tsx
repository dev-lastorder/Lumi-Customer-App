// React Native
import { ScrollView } from 'react-native';

// Components
import { ScreenWrapperWithAnimatedHeader } from '@/components';
import { HelpHeader, HelpMain } from '../components/help';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';

export default function HelpScreen() {
  return (
    <ScreenWrapperWithAnimatedTitleHeader
      title="Help"

    >
      <ScrollView className='bg-background dark:bg-dark-background' contentContainerStyle={{ flexGrow: 1, }} showsVerticalScrollIndicator={false}>
        <HelpHeader />
        <HelpMain />
      </ScrollView>
    </ScreenWrapperWithAnimatedTitleHeader>
  );
}
