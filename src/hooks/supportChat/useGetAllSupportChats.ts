import { supportChatApi, SupportChatBox } from '@/src/services/api/supportChatApi';
import { useQuery } from '@tanstack/react-query';

export const supportChatQueryKeys = {
  all: ['supportChat'] as const,
  messages: (chatBoxId: string) => [...supportChatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string, submittedBy?: string[], statusFilter?: string[]) => 
    [...supportChatQueryKeys.all, 'userChats', userId, submittedBy, statusFilter] as const,
};

interface UseGetAllSupportChatsOptions {
  enabled?: boolean;
  submittedBy?: string[];
  statusFilter?: string[];
}

export const useGetAllSupportChats = (
  userId: string | null,
  options?: UseGetAllSupportChatsOptions
) => {
  return useQuery<SupportChatBox[], Error>({
    queryKey: supportChatQueryKeys.userChats(
      userId || '', 
      options?.submittedBy, 
      options?.statusFilter
    ),
    
    queryFn: async () => {
      console.log('📥 useGetAllSupportChats - Fetching support chats');
      console.log('   User ID:', userId);
      console.log('   Submitted By:', options?.submittedBy);
      console.log('   Status Filter:', options?.statusFilter);
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      const chats = await supportChatApi.getAllChats(
        userId,
        options?.submittedBy,
        options?.statusFilter
      );
      
      console.log('✅ useGetAllSupportChats - Fetched', chats.length, 'support chats');
      return chats;
    },
    
    enabled: options?.enabled !== false && !!userId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
