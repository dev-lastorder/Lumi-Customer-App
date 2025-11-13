// screens/profileSuperApp/screens/supportchat.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

// Components
import GradientBackground from "@/components/common/GradientBackground/GradientBackground";

// API & Types
import { 
  supportChatApi, 
  SupportChatMessage, 
  convertWebSocketToSupportMessage,
  IReceivedMessage 
} from "@/services/api/supportChatApi";

// Redux
import { RootState } from "@/redux";

// Hooks
import { useTwilioVoice } from "@/hooks/chat/useTwilioVoice";

const SUPPORT_ID = "fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea";

export default function SupportChatProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentUserId = useSelector((state: RootState) => state.authSuperApp.user?.id);
  
  // Twilio Voice Hook
  const { makeCall, endCall, isCallActive, isConnecting } = useTwilioVoice(currentUserId);

  // State
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatBoxId, setChatBoxId] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  // Initialize chat on mount
  useEffect(() => {
    if (currentUserId) {
      initializeChat();
    }

    // Cleanup on unmount
    return () => {
      if (supportChatApi.isSocketConnected()) {
        console.log("Cleaning up WebSocket connection");
      }
    };
  }, [currentUserId]);

  // Initialize support chat
  const initializeChat = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!currentUserId) {
        console.error("No user ID found");
        setLoading(false);
        return;
      }

      // Connect to WebSocket if not already connected
      const isConnected = supportChatApi.isSocketConnected();
      if (!isConnected) {
        await supportChatApi.connectToSocket(currentUserId);
      }

      // Initialize support chat
      const { chatBox, messages: chatMessages } = await supportChatApi.initializeSupportChat(
        currentUserId,
        SUPPORT_ID
      );

      setChatBoxId(chatBox.id);
      setMessages(chatMessages);

      // Subscribe to incoming WebSocket messages
      supportChatApi.onMessageReceived((wsMessage: IReceivedMessage) => {
        // Only process messages for this support chat
        if (
          (wsMessage.sender === SUPPORT_ID && wsMessage.receiver === currentUserId) ||
          (wsMessage.sender === currentUserId && wsMessage.receiver === SUPPORT_ID)
        ) {
          const newMessage = convertWebSocketToSupportMessage(wsMessage, chatBox.id);
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to initialize support chat:", error);
      setLoading(false);
      Alert.alert("Error", "Failed to connect to support. Please try again.");
    }
  }, [currentUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Send message
  const handleSend = useCallback(async () => {
    if (inputText.trim().length === 0 || !currentUserId) return;

    const messageText = inputText.trim();
    setInputText("");

    try {
      const sentMessage = await supportChatApi.sendMessage({
        senderId: currentUserId,
        receiverId: SUPPORT_ID,
        text: messageText,
      });

      // Add to local state immediately for better UX
      setMessages((prev) => [...prev, sentMessage]);
    } catch (error) {
      console.error("Failed to send support message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
      // Restore the input text on error
      setInputText(messageText);
    }
  }, [inputText, currentUserId]);

  // Handle call button press
  const handleCallPress = useCallback(() => {
    if (isCallActive) {
      Alert.alert(
        'End Call',
        'Do you want to end the current call with support?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'End Call', onPress: endCall, style: 'destructive' }
        ]
      );
    } else {
      makeCall();
    }
  }, [isCallActive, makeCall, endCall]);

  // Render individual message
  const renderMessage = useCallback(({ item }: { item: SupportChatMessage }) => {
    const isCurrentUser = item.senderId === currentUserId;
    
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.messageRight : styles.messageLeft]}>
        <View style={[styles.messageBubble, isCurrentUser ? styles.messageBubbleUser : styles.messageBubbleSupport]}>
          <Text style={[styles.messageText, isCurrentUser ? styles.messageTextUser : styles.messageTextSupport]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isCurrentUser ? styles.messageTimeUser : styles.messageTimeSupport]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  }, [currentUserId]);

  // Loading state
  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3853A4" />
          <Text style={styles.loadingText}>Connecting to support...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <KeyboardAvoidingView 
        style={[styles.container, { paddingTop: insets.top }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Support</Text>
            <Text style={styles.headerSubtitle}>We're here to help</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.callButton,
              isCallActive && styles.callButtonActive
            ]}
            onPress={handleCallPress}
            disabled={isConnecting}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color="#3853A4" />
            ) : (
              <Feather 
                name="phone" 
                size={20} 
                color={isCallActive ? "#EF4444" : "#3853A4"} 
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Start a conversation</Text>
              <Text style={styles.emptySubtitle}>
                Our support team is ready to assist you
              </Text>
            </View>
          }
        />

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={inputText.trim().length === 0}
              style={[
                styles.sendButton,
                inputText.trim().length === 0 && styles.sendButtonDisabled
              ]}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButtonActive: {
    backgroundColor: '#FEE2E2',
  },

  // Messages
  messagesList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  messageLeft: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  messageRight: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageBubbleUser: {
    backgroundColor: '#3853A4',
  },
  messageBubbleSupport: {
    backgroundColor: '#FFFFFF',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextSupport: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  messageTimeUser: {
    color: '#E0E7FF',
  },
  messageTimeSupport: {
    color: '#9CA3AF',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  // Input
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3853A4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
});