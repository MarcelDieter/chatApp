import { TimeAndDate } from './time-and-date';

export interface Message {
  id: number| null;
  conversationId: number;
  senderId: number;
  content: string ;
  date: Date;
}