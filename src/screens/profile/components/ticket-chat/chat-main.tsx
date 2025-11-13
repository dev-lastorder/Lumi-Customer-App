// GQL
import { CREATE_TICKET_MESSAGE, GET_TICKET_MESSAGES } from '@/api';

// Icons
import { Ionicons } from '@expo/vector-icons';

// Hooks
import { useThemeColor } from '@/hooks';
import { useAppSelector } from '@/redux';
import { ApolloError, useMutation, useQuery } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

// React Native
import { Alert, FlatList, TextInput, TouchableOpacity, View } from 'react-native';

// Components
import { ITicketMessage } from '@/utils/interfaces/chat-bubble';
import TicketClosedMessage from './chat-is-closed';
import ChatBubble from './chatBubble';

export default function TicketChatMain() {
  // Refs
  const scrollRef = useRef<FlatList>(null);

  // States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ITicketMessage[]>([]);

  // Hooks
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const { ticketId, status } = useLocalSearchParams();
  const { textMuted } = useThemeColor();
  const router = useRouter();

  // Constants
  const isDarkMode = currentTheme === 'dark';

  // Queries
  const { data: chatMessages, loading: chatIdLoading } = useQuery(GET_TICKET_MESSAGES, {
    variables: {
      input: {
        ticket: ticketId,
        page,
        limit,
      },
    },
    skip: !ticketId,
    pollInterval: 5000,
  });

  // Mutations
  const [sendMessage] = useMutation(CREATE_TICKET_MESSAGE);

  // Handlers
  const handleMessageSubmit = async () => {
    try {
      if (!message) {
        return;
      }
      if (!ticketId) {
        Alert.alert('Bad Input', 'There was a technical issue while sending the message, please try again.');
        router.back();
      }
      setMessage('');
      await sendMessage({
        variables: {
          messageInput: {
            content: message,
            ticket: ticketId,
          },
        },
      });
    } catch (err) {
      const error = err as ApolloError;

    }
  };

  // UseEffects
  useEffect(() => {
    if (chatMessages?.getTicketMessages?.messages?.length) {
      const sortedMessages = chatMessages?.getTicketMessages?.messages;
      setMessages(sortedMessages);
      setTimeout(() => {
        scrollRef.current?.scrollToIndex({ animated: true, index: 0 });
      }, 500);
    }
  }, [chatMessages?.getTicketMessages?.messages?.length]);
  return (
    <View className="flex-1  w-full">
      <FlatList
        ref={scrollRef}
        className="flex-1 px-3"
        data={messages}
        contentContainerClassName={`w-full py-5`}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        inverted
        renderItem={({ item }) => {
          return <ChatBubble message={item?.content} userType={item?.senderType} createdAt={item?.createdAt} id={item?._id} />;
        }}
      />
      {status !== 'closed' ? (
        <View
          className={`flex flex-row items-center justify-between w-full max-w-2xl mx-auto  fixed float-end bottom-0
      rounded-2xl p-2 `}
        >
          <View className="relative flex-1 mx-2">
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={textMuted}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleMessageSubmit}
              className={`w-full px-4 py-3
            ${isDarkMode ? 'bg-dark-bgLight text-dark-text' : 'bg-white text-text'}
            rounded-xl text-base font-normal
            focus:ring-2 ${isDarkMode ? 'focus:ring-dark-primary' : 'focus:ring-primary'}
            focus:outline-none transition-all duration-200`}
              multiline={false}
              returnKeyType="send"
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!message.trim()}
            onPress={() => handleMessageSubmit()}
            className={`flex items-center justify-center h-10 w-10 
          ${message.trim() ? (isDarkMode ? 'bg-dark-primary' : 'bg-primary') : isDarkMode ? 'bg-dark-disabled' : 'bg-primary'}
          rounded-full 
          transform transition-all duration-200 ${message.trim() ? 'scale-100' : 'scale-95'}`}
          >
            <Ionicons name="send" size={18} className={`-rotate-45 -mr-1`} color={'white'} />
          </TouchableOpacity>
        </View>
      ) : (
        <TicketClosedMessage />
      )}
    </View>
  );
}
