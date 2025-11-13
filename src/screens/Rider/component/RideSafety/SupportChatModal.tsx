import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { CustomText } from "@/components";
import { 
  supportChatApi, 
  SupportChatMessage, 
  convertWebSocketToSupportMessage,
  IReceivedMessage 
} from "@/services/api/supportChatApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";

interface SupportChatModalProps {
  visible: boolean;
  onClose: () => void;
}

const SUPPORT_ID = "fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea";

const SupportChatModal: React.FC<SupportChatModalProps> = ({ visible, onClose }) => {
  const currentUserId = useSelector((state: RootState) => state.authSuperApp.user?.id);
  
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatBoxId, setChatBoxId] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  // Initialize support chat when modal opens
  useEffect(() => {
    if (visible && currentUserId) {
      initializeChat();
    }
  }, [visible, currentUserId]);

  const initializeChat = async () => {
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
      const unsubscribe = supportChatApi.onMessageReceived((wsMessage: IReceivedMessage) => {
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

      // Cleanup function
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Failed to initialize support chat:", error);
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim().length === 0 || !currentUserId) return;

    const messageText = inputText.trim();
    setInputText("");

    try {
      // Send message via API (HTTP + WebSocket)
      const sentMessage = await supportChatApi.sendMessage({
        senderId: currentUserId,
        receiverId: SUPPORT_ID,
        text: messageText,
      });

      // Add to local state immediately for better UX
      setMessages((prev) => [...prev, sentMessage]);

    } catch (error) {
      console.error("Failed to send support message:", error);
      // Optionally show error to user
    }
  };

  const renderMessage = ({ item }: { item: SupportChatMessage }) => {
    const isCurrentUser = item.senderId === currentUserId;
    
    return (
      <View
        className={`mb-3 ${isCurrentUser ? "items-end" : "items-start"}`}
      >
        <View
          className={`max-w-[75%] rounded-2xl px-4 py-3 ${
            isCurrentUser ? "bg-[#7C3AED]" : "bg-[#F3F4F6]"
          }`}
        >
          <CustomText
            fontSize="sm"
            lightColor={isCurrentUser ? "#FFFFFF" : "#000000"}
          >
            {item.text}
          </CustomText>
          <CustomText
            fontSize="xs"
            lightColor={isCurrentUser ? "#E9D5FF" : "#71717A"}
            className="mt-1"
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </CustomText>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-white rounded-t-3xl h-[100%] overflow-hidden">
          <LinearGradient
            colors={["#DBD6FB", "#FEFEFF"]}
            locations={[0, 0.5]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
              keyboardVerticalOffset={0}
            >
              {/* Header */}
              <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
                <TouchableOpacity
                  onPress={onClose}
                  className="w-9 h-9 rounded-full bg-white shadow-sm justify-center items-center"
                >
                  <Ionicons name="close" size={20} color="black" />
                </TouchableOpacity>

                <View className="flex-1 items-center">
                  <CustomText fontWeight="semibold" fontSize="lg">
                    Support
                  </CustomText>
                  <CustomText fontSize="xs" lightColor="#71717A" className="mt-1">
                    We're here to help
                  </CustomText>
                </View>

                <TouchableOpacity className="w-9 h-9 rounded-full bg-white shadow-sm justify-center items-center">
                  <Feather name="phone" size={18} color="black" />
                </TouchableOpacity>
              </View>

              {/* Messages List */}
              {loading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" color="#7C3AED" />
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 10,
                    paddingBottom: 20,
                  }}
                  showsVerticalScrollIndicator={false}
                  onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                  }
                  ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-10">
                      <CustomText fontSize="sm" lightColor="#71717A">
                        Start a conversation with our support team
                      </CustomText>
                    </View>
                  }
                />
              )}

              {/* Input Area */}
              <View className="px-5 pb-5 bg-white border-t border-gray-100">
                <View className="flex-row items-center bg-[#F3F4F6] rounded-full px-4 py-2 mt-3">
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor="#71717A"
                    className="flex-1 text-base py-2"
                    multiline
                    maxLength={500}
                    onSubmitEditing={handleSend}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleSend}
                    disabled={inputText.trim().length === 0 || loading}
                    className={`ml-2 w-8 h-8 rounded-full items-center justify-center ${
                      inputText.trim().length > 0 && !loading
                        ? "bg-[#7C3AED]"
                        : "bg-gray-300"
                    }`}
                  >
                    <Ionicons
                      name="send"
                      size={16}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default SupportChatModal;