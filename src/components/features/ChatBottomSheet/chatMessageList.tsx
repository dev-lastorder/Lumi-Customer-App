import React from 'react';
import { FlatList } from 'react-native';
import { ChatMessage } from '@/utils/interfaces/chat';
import MessageBubble from './MessageBubble';

interface ChatMessagesListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  flatListRef: React.RefObject<FlatList<any> | null>; // Fixed: Allow null in the ref type
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({ 
  messages, 
  currentUserId, 
  flatListRef 
}) => {
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.user.id === currentUserId;
    return <MessageBubble message={item} isMyMessage={isMyMessage} />;
  };

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={(item) => item.id}
      className="flex-1 px-4"
      contentContainerStyle={{ paddingVertical: 16 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ChatMessagesList