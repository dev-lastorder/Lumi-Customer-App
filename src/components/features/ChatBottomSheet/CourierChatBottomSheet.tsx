// Enhanced CourierChatBottomSheet with better error handling and validation
import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, Animated, KeyboardAvoidingView, Platform, Alert, View, TouchableOpacity, Text } from 'react-native';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { ChatMessage, CourierChatBottomSheetProps } from '@/utils/interfaces/chat';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { GET_CHAT_MESSAGES } from '@/api/graphql/query/chat';
import { SEND_CHAT_MESSAGE } from '@/api/graphql/mutation/chat';
import { CHAT_MESSAGE_SUBSCRIPTION } from '@/api';

import ChatHeader from './chatHeader';
import EmptyState from './EmptyState';
import MessageInput from './MessageInput';
import ChatMessagesList from './chatMessageList';
import QuickReplies from './quickReplies';

const { width, height } = Dimensions.get('window');

const CourierChatBottomSheet: React.FC<CourierChatBottomSheetProps> = ({
  visible,
  onClose,
  orderId,
  riderId,
  riderName = 'Courier Partner',
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  
  const [messageText, setMessageText] = useState('');
  const [imageError, setImageError] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => state.auth?.user);

  // Validation: Don't render if essential data is missing
  if (!orderId) {
    
    return null;
  }

  if (!currentUser?.id) {
    
    return null;
  }

  const quickReplies = [
    "Let me know when you arrive",
    "Don't ring the doorbell", 
    "I'm running late, please wait",
    "Please call me when you're here",
    "Leave it at the door",
    "I'll come down to meet you",
    "Please knock instead of ringing",
    "Can you wait 5 minutes?",
  ];

  // GraphQL operations with enhanced error handling
  const { data: chatData, loading: chatLoading, refetch, error: chatError } = useQuery(GET_CHAT_MESSAGES, {
    variables: { order: orderId },
    skip: !orderId || !visible,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.chat) {
        // Sort messages by creation time to ensure proper order
        const sortedMessages = [...data.chat].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setMessages(sortedMessages);
      }
    },
    onError: (error) => {
      
    }
  });

  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_CHAT_MESSAGE, {
    onCompleted: (data) => {
      if (data?.sendChatMessage?.success && data?.sendChatMessage?.data) {
        const newMessage = data.sendChatMessage.data;
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
        setMessageText('');
        
        // Scroll to bottom with delay
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    },
    onError: (error) => {
      
      Alert.alert(
        'Error', 
        'Failed to send message. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    },
  });

  // Subscribe to new messages with deduplication
  const { data: newMessageData } = useSubscription(CHAT_MESSAGE_SUBSCRIPTION, {
    variables: { order: orderId },
    skip: !orderId || !visible,
    onData: ({ data }) => {
      if (data?.data?.subscriptionNewMessage) {
        const newMessage = data.data.subscriptionNewMessage;
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          
          // Insert message in correct chronological order
          const updatedMessages = [...prev, newMessage].sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          return updatedMessages;
        });
        
        // Auto-scroll for new messages
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    },
    onError: (error) => {
      
    }
  });

  // Animation effects
  useEffect(() => {
    if (visible) {
      isAnimating.current = true;
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
        // Scroll to bottom when chat opens
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
      });
    } else {
      isAnimating.current = true;
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height * 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    }
  }, [visible, slideAnim, backdropAnim]);

  // Refetch messages when chat becomes visible
  useEffect(() => {
    if (visible && orderId) {
      refetch().catch(error => {
        
      });
    }
  }, [visible, orderId, refetch]);

  const handleClose = () => {
    onClose();
  };

  const handleQuickReply = (text: string) => {
    setMessageText(text);
  };

  const handleSendMessage = () => {
    const trimmedMessage = messageText.trim();
    
    if (!trimmedMessage) {
      Alert.alert('Empty Message', 'Please enter a message before sending.');
      return;
    }

    if (trimmedMessage.length > 500) {
      Alert.alert('Message Too Long', 'Please keep your message under 500 characters.');
      return;
    }

    if (!currentUser?.id || !currentUser?.name) {
      Alert.alert('Error', 'User information is missing. Please try logging in again.');
      return;
    }

    sendMessage({
      variables: {
        message: {
          message: trimmedMessage,
          user: {
            id: currentUser.id,
            name: currentUser.name,
          },
        },
        orderId: orderId,
      },
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Show error state if chat query failed
  if (chatError && visible) {
    return (
      <View className="absolute top-0 left-0 right-0 bottom-0 z-50 justify-center items-center bg-black/50">
        <View className="bg-white p-6 rounded-lg mx-4">
          <Text className="text-lg font-semibold mb-2">Chat Unavailable</Text>
          <Text className="text-gray-600 mb-4">Unable to load chat messages. Please try again.</Text>
          <TouchableOpacity 
            onPress={onClose}
            className="bg-blue-500 p-3 rounded-lg"
          >
            <Text className="text-white text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View 
      className="absolute top-0 left-0 right-0 bottom-0 z-50" 
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Animated.View
        className="absolute top-0 left-0 right-0 bottom-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          opacity: backdropAnim,
        }}
      >
        <TouchableOpacity
          className="flex-1"
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
        pointerEvents="box-none"
      >
        <Animated.View
          className="bg-white rounded-t-2xl"
          style={{
            height: height * 0.8,
            maxHeight: height * 0.8,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ChatHeader 
            riderName={riderName} 
            riderId={riderId} 
            onClose={handleClose} 
          />

          <View className="flex-1">
            {messages.length === 0 && !chatLoading ? (
              <>
                <EmptyState 
                  imageError={imageError} 
                  onImageError={handleImageError} 
                />
                <QuickReplies 
                  quickReplies={quickReplies} 
                  onQuickReply={handleQuickReply} 
                />
              </>
            ) : (
              <ChatMessagesList 
                messages={messages} 
                currentUserId={currentUser.id} 
                flatListRef={flatListRef} 
              />
            )}
          </View>

          <MessageInput
            messageText={messageText}
            onChangeText={setMessageText}
            onSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CourierChatBottomSheet;