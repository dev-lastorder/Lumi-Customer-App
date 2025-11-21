import { SUPPORT_TEAM_ID, supportChatApi, SupportChatBox, SupportChatMessage } from '@/src/services/api/supportChatApi';
import { useQuery } from '@tanstack/react-query';

export const supportChatQueryKeys = {
  all: ['supportChat'] as const,
  messages: (chatBoxId: string) => [...supportChatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...supportChatQueryKeys.all, 'userChats', userId] as const,
  initChat: (userId: string, supportId: string) => 
    [...supportChatQueryKeys.all, 'initChat', userId, supportId] as const,
};

interface InitializeSupportChatResponse {
  chatBox: SupportChatBox | null;
  messages: SupportChatMessage[];
}

interface UseInitializeSupportChatOptions {
  enabled?: boolean;
  supportId?: string;
}

export const useInitializeSupportChat = (
  userId: string | undefined,
  options?: UseInitializeSupportChatOptions
) => {
  const supportId = options?.supportId || SUPPORT_TEAM_ID;

  return useQuery<InitializeSupportChatResponse, Error>({
    queryKey: supportChatQueryKeys.initChat(userId || '', supportId),
    
    queryFn: async () => {
      console.log('🚀 useInitializeSupportChat - Initializing support chat');
      console.log('   User ID:', userId);
      console.log('   Support ID:', supportId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const result = await supportChatApi.initializeSupportChat(userId, supportId);
      
      console.log('✅ useInitializeSupportChat - Chat initialized');
      console.log('   Chat Box:', result.chatBox ? result.chatBox.id : 'null');
      console.log('   Messages:', result.messages.length);
      console.log('   Status:', result.chatBox?.status);
      
      return result;
    },
    
    enabled: options?.enabled !== false && !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
