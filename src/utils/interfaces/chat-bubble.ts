export interface IChatBubble {
  id:string;
  createdAt: string;
  userType: 'admin' | 'user';
  message: string;
}

export interface ITicketMessage {
  __typename: string;
  _id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderType: 'admin' | 'user';
  ticket: string;
  updatedAt: string;
}
