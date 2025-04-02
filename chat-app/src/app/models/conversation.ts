import { Message } from './message';

export interface Conversation {
  id: number,
  conversationName?: string,
  conversationPictureUrl?: string,
  groupConversation: boolean,
  messages: Message[],
  memberIds : number[], 
  unreadMessages: number
}