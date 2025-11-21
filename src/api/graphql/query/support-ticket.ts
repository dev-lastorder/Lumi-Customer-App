import { gql } from '@apollo/client';

export const GET_ALL_TICKETS = gql`
  query getSingleUserSupportTickets($input: SingleUserSupportTicketsInput) {
    getSingleUserSupportTickets(input: $input) {
      tickets {
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
      docsCount
      totalPages
      currentPage
    }
  }
`;

export const GET_TICKET_MESSAGES = gql`
  query getTicketMessages($input: TicketMessagesInput!) {
    getTicketMessages(input: $input) {
      messages {
        _id
        senderType
        content
        isRead
        ticket
        createdAt
        updatedAt
      }
      ticket {
        _id
      }
      page
      totalPages
      docsCount
    }
  }
`;

export const UPDATE_TICKET_STATUS = gql`
  mutation updateSupportTicketStatus($input: UpdateSupportTicketInput!) {
    updateSupportTicketStatus(input: $input) {
      title
      status
    }
  }
`;
