// services/api/supportChatApi.ts
import { apiInstance } from "./ApiInstance";
import { webSocketService, IsentMessage, IReceivedMessage } from "@/services/websocketService";

// TypeScript interfaces matching your backend support-chat module
interface SendSupportMessageDto {
  senderId: string;
  receiverId: string;
  text: string;
}

interface SupportChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  chatBoxId: string;
}

interface SupportChatBox {
  id: string;
  title?: string;
  sender_id: string;
  receiver_id: string;
  latestMessage?: string;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
  };
}

interface SupportChatApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Support Chat API Functions (HTTP + WebSocket combined)
export const supportChatApi = {
  
  // 1. Send support message (HTTP for persistence + WebSocket for real-time)
  sendMessage: async (messageData: SendSupportMessageDto): Promise<SupportChatMessage> => {
    try {
      // First send via HTTP to persist in database
      const response = await apiInstance.post('/api/v1/support-chat/send', messageData);
      
      const responseData = response.data;
      console.log('📦 Backend send support message response:', responseData);
      
      // Create SupportChatMessage object from response
      const savedMessage: SupportChatMessage = {
        id: `support-msg-${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId: responseData.chatBoxId || `temp-support-${messageData.senderId}-${messageData.receiverId}`,
      };
      
      // Then send via WebSocket for real-time delivery
      if (webSocketService.isSocketConnected()) {
        const socketMessage: IsentMessage = {
          sender: messageData.senderId,
          receiver: messageData.receiverId,
          text: messageData.text,
        };
        webSocketService.sendMessage(socketMessage);
        console.log('✅ Support message sent via both HTTP and WebSocket');
      } else {
        console.log('⚠️ WebSocket not connected, support message sent via HTTP only');
      }
      
      return savedMessage;
      
    } catch (error) {
      console.error('❌ Failed to send support message:', error);
      throw error;
    }
  },

  // 2. Get all support messages in a chat box
  getMessages: async (chatBoxId: string): Promise<SupportChatMessage[]> => {
    try {
      const response = await apiInstance.get(`/api/v1/support-chat/messages/${chatBoxId}`);
      const { messages } = response.data;
      
      // Transform backend response to match our interface
      const transformedMessages: SupportChatMessage[] = messages.map((msg: any) => ({
        id: msg.id,
        text: msg.text,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        chatBoxId: msg.chat_box_id,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
      }));
      
      return transformedMessages;
      
    } catch (error) {
      console.error('❌ Failed to get support messages:', error);
      throw error;
    }
  },

  // 3. Get all support chat boxes for a user
  getAllChats: async (userId: string): Promise<SupportChatBox[]> => {
    try {
      const response = await apiInstance.get(`/api/v1/support-chat/${userId}`);
      const { chatList } = response.data;
      
      return chatList || [];
      
    } catch (error) {
      console.error('❌ Failed to get support chats:', error);
      throw error;
    }
  },

  // 4. Initialize support chat with support team (hardcoded support ID)
  initializeSupportChat: async (
    userId: string,
    supportId: string = "fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea"
  ): Promise<{ chatBox: SupportChatBox; messages: SupportChatMessage[] }> => {
    try {
      // Get all support chats for the user
      const chats = await supportChatApi.getAllChats(userId);
      
      // Find existing chat with support team
      const existingChat = chats.find((chat) => {
        return (chat.sender_id === userId && chat.receiver_id === supportId) ||
               (chat.sender_id === supportId && chat.receiver_id === userId);
      });

      let chatBox: SupportChatBox;
      let messages: SupportChatMessage[] = [];

      if (existingChat) {
        // Use existing support chat
        chatBox = existingChat;
        console.log('✅ Found existing support chat:', chatBox.id);
        
        // Get messages for existing chat
        try {
          messages = await supportChatApi.getMessages(chatBox.id);
        } catch (error) {
          console.log('⚠️ Could not load support chat history, starting fresh');
          messages = [];
        }
        
      } else {
        // Create temporary chatBox (will be created when first message is sent)
        chatBox = {
          id: `temp-support-${userId}-${supportId}`,
          sender_id: userId,
          receiver_id: supportId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        messages = [];
        console.log('✅ Created temporary support chat box');
      }

      return { chatBox, messages };
      
    } catch (error) {
      console.error('❌ Failed to initialize support chat:', error);
      
      // Fallback: Always return a temporary chat box
      const fallbackChatBox: SupportChatBox = {
        id: `temp-support-${userId}-fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea`,
        sender_id: userId,
        receiver_id: "fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { chatBox: fallbackChatBox, messages: [] };
    }
  },

  // 5-11. WebSocket helper functions (reuse from existing chatApi)
  connectToSocket: async (userId: string): Promise<boolean> => {
    try {
      return await webSocketService.connect(userId);
    } catch (error) {
      console.error('❌ Failed to connect to WebSocket:', error);
      throw error;
    }
  },

  disconnectFromSocket: (): void => {
    webSocketService.disconnect();
  },

  onMessageReceived: (callback: (message: IReceivedMessage) => void): (() => void) => {
    return webSocketService.onMessage(callback);
  },

  onConnectionChange: (callback: (connected: boolean) => void): (() => void) => {
    return webSocketService.onConnectionChange(callback);
  },

  isSocketConnected: (): boolean => {
    return webSocketService.isSocketConnected();
  },

  getCurrentSocketUserId: (): string | null => {
    return webSocketService.getCurrentUserId();
  },

  reconnectSocket: (): void => {
    webSocketService.reconnect();
  },
};

// Helper function to convert WebSocket message to SupportChatMessage format
export const convertWebSocketToSupportMessage = (
  wsMessage: IReceivedMessage, 
  chatBoxId?: string
): SupportChatMessage => {
  return {
    id: `ws-support-${Date.now()}`,
    text: wsMessage.text,
    senderId: wsMessage.sender,
    receiverId: wsMessage.receiver,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chatBoxId: chatBoxId || `temp-support-${wsMessage.sender}-${wsMessage.receiver}`,
  };
};

// Export types for use in other files
export type { 
  SendSupportMessageDto, 
  SupportChatMessage, 
  SupportChatBox, 
  SupportChatApiResponse,
  IsentMessage,
  IReceivedMessage 
};