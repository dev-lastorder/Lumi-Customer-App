// src/utils/interfaces/chat.ts
export interface ChatMessage {
  id: string;
  message: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
  images?: string[]; // For future image support
  isActive?: boolean;
}

interface ChatBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
}
export interface CourierChatBottomSheetProps extends ChatBottomSheetProps {
  riderId?: string;
  riderName?: string;
}

export interface StoreChatBottomSheetProps extends ChatBottomSheetProps {
  storeId?: string;
  storeName?: string;
}

// Enhanced chat user interface
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
}

// Chat status enum
export enum ChatStatus {
  TYPING = 'typing',
  ONLINE = 'online',
  OFFLINE = 'offline',
}
