import { Message } from './message';

export interface Conversation {
  conversationId: number;
  profilePicUrl: string,
  messages: Message[];
  memberIds : number[]; 
}