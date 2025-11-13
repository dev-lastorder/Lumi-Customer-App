import { useAppSelector } from '@/redux';
import { formatDate } from '@/utils';
import { IChatBubble } from '@/utils/interfaces/chat-bubble';

import { Text, View } from 'react-native';

export default function ChatBubble({ createdAt, userType, message, id }: IChatBubble) {
  // Hooks
  const theme = useAppSelector((state) => state.theme.currentTheme);
  // Constants
  const isAdmin = userType === 'admin';
  const isDark = theme === 'dark';
  return (
    <View 
    key={id}
    className={`max-w-[80%] my-2 px-4 py-3 rounded-2xl shadow-sm
      ${isAdmin 
        ? `self-start rounded-tl-none ${isDark ? 'bg-dark-card-secondary' : 'bg-card-secondary'}`
        : `self-end rounded-tr-none ${isDark 
            ? 'bg-dark-primary bg-opacity-80' 
            : 'bg-primary/70 bg-opacity-80'}`
      }`}
  >
    <Text 
      className={`text-base font-semibold
        ${isAdmin 
          ? (isDark ? 'text-dark-text' : 'text-text') 
          : (isDark ? 'text-dark-button-text' : 'text-button-text/70')
        }`}
    >
      {message}
    </Text>
    
    <Text 
      className={`text-xs mt-1
        ${isAdmin 
          ? (isDark ? 'text-dark-text-secondary' : 'text-text-secondary') 
          : (isDark ? 'text-dark-text-muted opacity-90' : 'text-white opacity-80')
        }`}
    >
      {formatDate(Number(createdAt))}
    </Text>
  </View>
  );
}
