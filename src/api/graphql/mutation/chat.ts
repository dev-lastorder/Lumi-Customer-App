import { gql } from '@apollo/client';

export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($message: ChatMessageInput!, $orderId: ID!,  $isStoreChat: Boolean) {
    sendChatMessage(message: $message, orderId: $orderId, isStoreChat: $isStoreChat) {
      success
      message
      data {
        id
        message
        user {
          id
          name
        }
        createdAt
      }
    }
  }
`;