// Hooks
import { useRef, useState } from 'react';

// React Native
import { ScrollView } from 'react-native';

// Components
import { ScreenWrapperWithAnimatedHeader } from '@/components';
import { TicketsHeader, TicketsMain } from '../components/tickets';
import ScreenWrapperWithAnimatedTitleHeader from '@/components/common/ScreenAnimatedTitleHeader/ScreenWrapperWithAnimatedTitleHeader';

export default function TicketsScreen() {

  // States
  const [hasScrolled, setHasScrolled] = useState(false);

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  // Handlers
  const handleContentSizeChange = () => {
    if (!hasScrolled) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      setHasScrolled(true); // Ensure it scrolls only once
    }
  };

  return (
    <ScreenWrapperWithAnimatedTitleHeader
      title="My Tickets"

    >
      <TicketsHeader />
      <TicketsMain />
    </ScreenWrapperWithAnimatedTitleHeader>
  );
}
