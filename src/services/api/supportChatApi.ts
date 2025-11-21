// services/api/supportChatApi.ts
import { apiInstance } from "./ApiInstance";
import { webSocketService, IsentMessage, IReceivedMessage } from "@/services/websocketService";

export const SUPPORT_TEAM_ID = "fd6a3184-ac27-4eeb-a847-dda7f3b6b3ea";

export interface SendSupportMessageDto {
  senderId: string;
  receiverId: string;
  text: string;
}

export interface SupportChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  chatBoxId: string;
}

export interface SupportChatBox {
  id: string;
  title?: string;
  senderId: string;
  receiverId: string;
  latestMessage?: string;
  status?: "opened" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
  senderInfo?: {
    id: string;
    name: string;
    phone: string;
  };
  receiverInfo?: {
    id: string;
    name: string;
    phone: string;
  };
  submittedByType?: string;
}

export const normalizeSupportMessage = (message: any): SupportChatMessage => {
  return {
    id: message.id,
    text: message.text,
    senderId: message.senderId || message.sender_id,
    receiverId: message.receiverId || message.receiver_id,
    chatBoxId: message.chatBoxId || message.chat_box_id,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

// Support Chat API Functions (HTTP + WebSocket combined)
export const supportChatApi = {
  
  // 1️⃣ Send support message (HTTP + WebSocket)
  sendMessage: async (
    messageData: SendSupportMessageDto
  ): Promise<SupportChatMessage> => {
    try {
      console.log("📤 Sending support message:", messageData);

      // Send via HTTP to persist in database
      const response = await apiInstance.post(
        "/api/v1/support-chat/send",
        messageData
      );
      const responseData = response.data;

      console.log("📦 Backend response:", responseData);

      // Create message object from response
      const savedMessage: SupportChatMessage = {
        id: `support-msg-${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId:
          responseData.chatBoxId ||
          `temp-support-${messageData.senderId}-${messageData.receiverId}`,
      };

      // Send via WebSocket for real-time delivery
      if (webSocketService.isSocketConnected()) {
        const socketMessage: IsentMessage = {
          sender: messageData.senderId,
          receiver: messageData.receiverId,
          text: messageData.text,
        };
        webSocketService.sendMessage(socketMessage);
        console.log("✅ Support message sent via HTTP + WebSocket");
      } else {
        console.log("⚠️ WebSocket not connected, sent via HTTP only");
      }

      return savedMessage;
    } catch (error) {
      console.error("❌ Failed to send support message:", error);
      throw error;
    }
  },

  // 2️⃣ Get support messages in a chat box
  getMessages: async (chatBoxId: string): Promise<SupportChatMessage[]> => {
    try {
      console.log("📥 Fetching support messages for chatBoxId:", chatBoxId);

      const response = await apiInstance.get(
        `/api/v1/support-chat/messages/${chatBoxId}`
      );
      const messageData = response.data;

      // Handle different response formats
      let messages: any[] = [];
      if (Array.isArray(messageData)) {
        messages = messageData;
      } else if (messageData?.messages && Array.isArray(messageData.messages)) {
        messages = messageData.messages;
      }

      // Normalize all messages
      const normalizedMessages = messages.map(normalizeSupportMessage);

      console.log("✅ Fetched", normalizedMessages.length, "support messages");
      return normalizedMessages;
    } catch (error) {
      console.error("❌ Failed to get support messages:", error);
      return [];
    }
  },

  // 3️⃣ Get all support chat boxes for a user
  getAllChats: async (
    userId: string,
    submittedBy?: string[],
    statusFilter?: string[]
  ): Promise<SupportChatBox[]> => {
    try {
      console.log("📥 Fetching all support chats for userId:", userId);

      const response = await apiInstance.get(`/api/v1/support-chat/${userId}`);
      const chatData = response.data;

      console.log("📦 Raw response:", JSON.stringify(chatData));

      const chatList = chatData?.chatbox || [];

      console.log("✅ Fetched", chatList.length, "support chats");
      return chatList;
    } catch (error: any) {
      console.error("❌ Failed to get support chats:", error?.response?.data || error.message);
      return [];
    }
  },

  // 4️⃣ Initialize support chat (find latest opened chat)
  initializeSupportChat: async (
    userId: string,
    supportId: string = SUPPORT_TEAM_ID
  ): Promise<{ chatBox: SupportChatBox | null; messages: SupportChatMessage[] }> => {
    try {
      console.log("🚀 Initializing support chat");
      console.log("   User ID:", userId);
      console.log("   Support ID:", supportId);

      // Get all support chats for the user
      const allChats = await supportChatApi.getAllChats(userId);

      // Find latest OPENED chat with support team
      const openedChats = allChats.filter((chat) => {
        const chatSenderId = (chat as any).senderId || chat.senderId;
        const chatReceiverId = (chat as any).receiverId || chat.receiverId;
        const chatStatus = chat.status;

        return (
          ((chatSenderId === userId && chatReceiverId === supportId) ||
          (chatSenderId === supportId && chatReceiverId === userId)) &&
          chatStatus === "opened"
        );
      });

      // Sort by updatedAt to get the latest
      openedChats.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      const latestOpenedChat = openedChats[0];

      if (latestOpenedChat) {
        console.log("✅ Found latest opened support chat:", latestOpenedChat.id);

        // Load message history
        let messages: SupportChatMessage[] = [];
        try {
          messages = await supportChatApi.getMessages(latestOpenedChat.id);
        } catch (error) {
          console.log("⚠️ Could not load support chat history");
        }

        return { chatBox: latestOpenedChat, messages };
      } else {
        // No opened chat found - return null (don't create temp)
        console.log("ℹ️ No opened support chat found");
        return { chatBox: null, messages: [] };
      }
    } catch (error) {
      console.error("❌ Failed to initialize support chat:", error);
      return { chatBox: null, messages: [] };
    }
  },

  // 5️⃣ WebSocket helpers (reuse from chat)
  connectToSocket: async (userId: string): Promise<boolean> => {
    return await webSocketService.connect(userId);
  },

  disconnectFromSocket: (): void => {
    webSocketService.disconnect();
  },

  onMessageReceived: (
    callback: (message: IReceivedMessage) => void
  ): (() => void) => {
    return webSocketService.onMessage(callback);
  },

  onConnectionChange: (
    callback: (connected: boolean) => void
  ): (() => void) => {
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

// ============================================
// HELPER: Convert WebSocket message to SupportChatMessage
// ============================================
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
    chatBoxId:
      chatBoxId || `temp-support-${wsMessage.sender}-${wsMessage.receiver}`,
  };
};

// ============================================
// EXPORTS
// ============================================
export type { IReceivedMessage, IsentMessage };