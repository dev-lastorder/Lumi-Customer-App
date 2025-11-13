import { gql } from '@apollo/client';

export const CREATE_SUPPORT_TICKET = gql`
  mutation CreateSupportTicket($ticketInput: SupportTicketInput!) {
    createSupportTicket(ticketInput: $ticketInput) {
      _id
      title
      description
      status
      category
      orderId
      otherDetails
      createdAt
      updatedAt
      user {
        _id
        name
      }
      userType
    }
  }
`;

export const CREATE_TICKET_MESSAGE = gql`
  mutation createMessage($messageInput: MessageInput!) {
    createMessage(messageInput: $messageInput) {
      _id
    }
  }
`;
