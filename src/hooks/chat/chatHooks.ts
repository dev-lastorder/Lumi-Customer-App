// hooks/chatHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi, SendMessageDto, ChatMessage, ChatBox } from "@/services/api/chatApi"

// Query Keys (like your auth flow)
export const chatQueryKeys = {
  all: ['chat'] as const,
  messages: (chatBoxId: string) => [...chatQueryKeys.all, 'messages', chatBoxId] as const,
  userChats: (userId: string) => [...chatQueryKeys.all, 'userChats', userId] as const,
  rideChat: (riderId: string, driverId: string) => [...chatQueryKeys.all, 'rideChat', riderId, driverId] as const,
};

// 1. Hook to get messages for a specific chatBox
export const useGetMessages = (chatBoxId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatQueryKeys.messages(chatBoxId || ''),
    queryFn: () => chatApi.getMessages(chatBoxId!),
    enabled: enabled && !!chatBoxId && !chatBoxId.startsWith('temp-'), // Don't fetch for temp chatBoxes
    staleTime: 30 * 1000, // 30 seconds
    // Removed refetchInterval since we use WebSocket for real-time
  });
};

// 2. Hook to get all user chats
export const useGetUserChats = (userId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatQueryKeys.userChats(userId || ''),
    queryFn: () => chatApi.getAllChats(userId!),
    enabled: enabled && !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
};

// 3. Hook to initialize ride chat
export const useInitializeRideChat = (riderId: string | null, driverId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: chatQueryKeys.rideChat(riderId || '', driverId || ''),
    queryFn: () => chatApi.initializeRideChat(riderId!, driverId!),
    enabled: enabled && !!riderId && !!driverId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// 4. Mutation hook to send message (like your auth mutations)
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendMessageDto>({
    mutationFn: (messageData: SendMessageDto) => chatApi.sendMessage(messageData),
    
    onMutate: async (messageData: SendMessageDto) => {
      // Optimistic update
      const chatBoxId = `temp-${messageData.senderId}-${messageData.receiverId}`; // Temporary for new chats
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: chatQueryKeys.messages(chatBoxId) });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(chatQueryKeys.messages(chatBoxId));

      // Optimistically update to the new value
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        text: messageData.text,
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatBoxId: chatBoxId,
      };

      queryClient.setQueryData(
        chatQueryKeys.messages(chatBoxId),
        (old: ChatMessage[] | undefined) => [...(old || []), optimisticMessage]
      );

      // Return a context object with the snapshotted value
      return { previousMessages, optimisticMessage };
    },

    onSuccess: (data: ChatMessage, variables: SendMessageDto, context: any) => {
      // Replace optimistic message with real message
      const realChatBoxId = data.chatBoxId;
      
      queryClient.setQueryData(
        chatQueryKeys.messages(realChatBoxId),
        (old: ChatMessage[] | undefined) => {
          if (!old || !context) return [data];
          
          // Replace optimistic message with real one
          return old.map(msg => 
            msg.id === context.optimisticMessage.id ? data : msg
          );
        }
      );

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.userChats(variables.senderId) });
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(realChatBoxId) });
    },

    onError: (err: Error, variables: SendMessageDto, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        const chatBoxId = `temp-${variables.senderId}-${variables.receiverId}`;
        queryClient.setQueryData(chatQueryKeys.messages(chatBoxId), context.previousMessages);
      }
    },

    onSettled: (data: ChatMessage | undefined, error: Error | null, variables: SendMessageDto) => {
      // Always refetch after error or success
      const chatBoxId = data?.chatBoxId || `temp-${variables.senderId}-${variables.receiverId}`;
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(chatBoxId) });
    },
  });
};

// 5. Hook to manually refetch messages (for real-time updates)
export const useRefetchMessages = (chatBoxId: string | null) => {
  const queryClient = useQueryClient();

  const refetchMessages = () => {
    if (chatBoxId && !chatBoxId.startsWith('temp-')) {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(chatBoxId) });
    }
  };

  return refetchMessages;
};

// 6. Hook to clear chat cache (when leaving chat)
export const useClearChatCache = () => {
  const queryClient = useQueryClient();

  const clearChatCache = (chatBoxId?: string) => {
    if (chatBoxId) {
      queryClient.removeQueries({ queryKey: chatQueryKeys.messages(chatBoxId) });
    } else {
      // Clear all chat related cache
      queryClient.removeQueries({ queryKey: chatQueryKeys.all });
    }
  };

  return clearChatCache;
};