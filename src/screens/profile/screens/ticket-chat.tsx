// Components
import { CustomHeader, ScreenAnimatedTitleHeader, ScreenWrapperWithAnimatedHeader } from '@/components';
import { TicketChatHeader, TicketChatMain } from '../components/ticket-chat';

// React Native
import { View } from 'react-native';

// Hooks
import { useKeyboardState } from '@/hooks';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';
import { Custom } from 'react-native-reanimated-carousel/lib/typescript/components/Pagination/Custom';
import { useSharedValue } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function TicketChatScreen() {
  // Hooks
  const isKeyboardVisible = useKeyboardState();
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {/* header */}
      <CustomHeader title={'Chat'} showGoBack={true} onGoBack={() => router.back()} rightIcons={[]} />

      {/* <ScreenWrapperWithAnimatedHeader
      title="Chat"
      showSettings={false}
      showGoBack={true}
      showLocationDropdown={false}
      showMap={false}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollEnabled={false}
    > */}
      {/* <View className={isKeyboardVisible ? "h-[65%]" : "h-[100%]"}> */}
      <TicketChatHeader />
      <TicketChatMain />
      {/* </View> */}
      {/* </ScreenWrapperWithAnimatedHeader> */}
    </View>
  );
} 
