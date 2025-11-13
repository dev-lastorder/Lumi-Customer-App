import { TicketUserType } from '@/types';
import { TICKET_STATUS } from '../enums';

export interface ISuportTicket {
  _id: string;
  title: string;
  description: string;
  status: TICKET_STATUS;
  category: string;
  orderId: string;
  otherDetails: string;
  createdAt: string;
  updatedAt: string;
  user: ITicketUser;
  userType: TicketUserType;
}

export interface ITicketUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  userType: TicketUserType;
}

export interface ITicketProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  userType: string;
  status: string;
}
