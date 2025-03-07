export interface Message {
  id: number| null;
  conversationId: number;
  senderId: number;
  content: string ;
  date: Date;
}