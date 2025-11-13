// services/api/chatApi.ts
import { apiInstance } from "./ApiInstance";
import { webSocketService, IsentMessage, IReceivedMessage } from "@/services/websocketService";

// TypeScript interfaces matching your backend
 interface SendMessageDto {
  senderId: string;
  receiverId: string;
  text: string;
}

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  chatBoxId: string;
}

interface ChatBox {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

interface ChatApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Chat API Functions (HTTP + WebSocket combined)
export const chatApi = {
  
  // 1. Send message (HTTP for persistence + WebSocket for real-time)
  sendMessage: async (messageData: SendMessageDto): Promise<ChatMessage> => {
    try {
      // First send via HTTP to persist in database
      const response = await apiInstance.post('/api/v1/chat/send', messageData);
      
      // Handle backend response format: {"chatBoxId": "...", "message": "..."}
      const responseData = response.data;
      console.log('📦 Backend send message response:', responseData);
      
      // Create ChatMessage object from response (backend doesn't return full message object)
      const savedMessage: ChatMessage = {
        id: `msg-${Date.now()}`, // Temporary ID since backend doesn't return full message
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId: responseData.chatBoxId || `temp-${messageData.senderId}-${messageData.receiverId}`,
      };
      
      // Then send via WebSocket for real-time delivery (matching backend interface)
      if (webSocketService.isSocketConnected()) {
        const socketMessage: IsentMessage = {
          sender: messageData.senderId,
          receiver: messageData.receiverId,
          text: messageData.text,
        };
        webSocketService.sendMessage(socketMessage);
        console.log('✅ Message sent via both HTTP and WebSocket');
      } else {
        console.log('⚠️ WebSocket not connected, sent via HTTP only');
      }
      
      return savedMessage;
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  },

  // 2. Get all messages in a specific chatBox (HTTP only - for chat history)
  getMessages: async (chatBoxId: string): Promise<ChatMessage[]> => {
    try {
      const response = await apiInstance.get(`/api/v1/chat/messages/${chatBoxId}`);
      
      // Handle backend response format
      const messageData = response.data;
      
      if (Array.isArray(messageData)) {
        console.log('✅ Found', messageData.length, 'messages in chat');
        return messageData;
      } else if (messageData && messageData.messages && Array.isArray(messageData.messages)) {
        console.log('✅ Found', messageData.messages.length, 'messages in chat');
        return messageData.messages;
      } else {
        console.log('✅ No messages found in chat');
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to get messages:', error);
      return []; // Return empty array on error instead of throwing
    }
  },

  // 3. Get all chat boxes for a user (HTTP only - for chat list)
  getAllChats: async (userId: string): Promise<ChatBox[]> => {
    try {
      const response = await apiInstance.get(`/api/v1/chat/${userId}`);
      
      // Handle backend response format: {"data": {"chatList": [...]}}
      const chatData = response.data;
      
      if (chatData && chatData.chatList && Array.isArray(chatData.chatList)) {
        console.log('✅ Found', chatData.chatList.length, 'existing chats');
        return chatData.chatList;
      } else {
        console.log('✅ No existing chats found');
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to get user chats:', error);
      return []; // Return empty array on error instead of throwing
    }
  },

  // 4. Initialize ride chat (helper function)
  initializeRideChat: async (riderId: string, driverId: string): Promise<{
    chatBox: ChatBox;
    messages: ChatMessage[];
  }> => {
    try {
      console.log(`🚀 Initializing ride chat between rider: ${riderId} and driver: ${driverId}`);
      
      // Connect rider to WebSocket if not already connected
      if (!webSocketService.isSocketConnected() || webSocketService.getCurrentUserId() !== riderId) {
        await webSocketService.connect(riderId);
      }
      
      // Get all chats for the rider
      const allChats = await chatApi.getAllChats(riderId);
      console.log('📦 All chats response:', JSON.stringify(allChats, null, 2));
      
      // Look for existing chat between rider and driver
      // Handle different possible backend data structures
      const existingChat = allChats.find((chatBox: any) => {
        // Check if participants array exists and has the users
        if (chatBox.participants && Array.isArray(chatBox.participants)) {
          return chatBox.participants.includes(riderId) && chatBox.participants.includes(driverId);
        }
        
        // Alternative: Check if the chat has sender/receiver fields
        if (chatBox.sender_id && chatBox.receiver_id) {
          return (chatBox.sender_id === riderId && chatBox.receiver_id === driverId) ||
                 (chatBox.sender_id === driverId && chatBox.receiver_id === riderId);
        }
        
        // Alternative: Check if the chat has user IDs in different format
        if (chatBox.user1_id && chatBox.user2_id) {
          return (chatBox.user1_id === riderId && chatBox.user2_id === driverId) ||
                 (chatBox.user1_id === driverId && chatBox.user2_id === riderId);
        }
        
        return false;
      });

      let chatBox: ChatBox;
      let messages: ChatMessage[] = [];

      if (existingChat) {
        // Use existing chat - normalize the structure
        chatBox = {
          id: existingChat.id,
          participants: existingChat.participants || [riderId, driverId],
          lastMessage: existingChat.lastMessage,
          createdAt: existingChat.createdAt || new Date().toISOString(),
          updatedAt: existingChat.updatedAt || new Date().toISOString(),
        };
        
        console.log('✅ Found existing chat:', chatBox.id);
        
        // Try to get messages for existing chat
        try {
          messages = await chatApi.getMessages(chatBox.id);
        } catch (error) {
          console.log('⚠️ Could not load chat history, starting fresh');
          messages = [];
        }
        
      } else {
        // Create temporary chatBox (will be created when first message is sent)
        chatBox = {
          id: `temp-${riderId}-${driverId}`,
          participants: [riderId, driverId],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        messages = [];
        console.log('✅ Created temporary chat box');
      }

      return { chatBox, messages };
      
    } catch (error) {
      console.error('❌ Failed to initialize ride chat:', error);
      
      // Fallback: Always return a temporary chat box so UI doesn't crash
      const fallbackChatBox: ChatBox = {
        id: `temp-${riderId}-${driverId}`,
        participants: [riderId, driverId],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { chatBox: fallbackChatBox, messages: [] };
    }
  },

  // 5. Connect to WebSocket (helper function)
  connectToSocket: async (userId: string): Promise<boolean> => {
    try {
      return await webSocketService.connect(userId);
    } catch (error) {
      console.error('❌ Failed to connect to WebSocket:', error);
      throw error;
    }
  },

  // 6. Disconnect from WebSocket (helper function)  
  disconnectFromSocket: (): void => {
    webSocketService.disconnect();
  },

  // 7. Listen for real-time messages (WebSocket only)
  onMessageReceived: (callback: (message: IReceivedMessage) => void): (() => void) => {
    return webSocketService.onMessage(callback);
  },

  // 8. Listen for connection status changes (WebSocket only)
  onConnectionChange: (callback: (connected: boolean) => void): (() => void) => {
    return webSocketService.onConnectionChange(callback);
  },

  // 9. Check WebSocket connection status
  isSocketConnected: (): boolean => {
    return webSocketService.isSocketConnected();
  },

  // 10. Get current WebSocket user ID
  getCurrentSocketUserId: (): string | null => {
    return webSocketService.getCurrentUserId();
  },

  // 11. Reconnect WebSocket if disconnected
  reconnectSocket: (): void => {
    webSocketService.reconnect();
  },
};

// Helper function to convert WebSocket message to ChatMessage format
export const convertWebSocketMessage = (wsMessage: IReceivedMessage, chatBoxId?: string): ChatMessage => {
  return {
    id: `ws-${Date.now()}`, // Temporary ID for WebSocket messages
    text: wsMessage.text,
    senderId: wsMessage.sender,
    receiverId: wsMessage.receiver,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chatBoxId: chatBoxId || `temp-${wsMessage.sender}-${wsMessage.receiver}`,
  };
};

// Export types for use in other files
export type { 
  SendMessageDto, 
  ChatMessage, 
  ChatBox, 
  ChatApiResponse,
  IsentMessage,
  IReceivedMessage 
};