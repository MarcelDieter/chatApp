import { Signal } from '@angular/core';
import { Message } from './message';
import { UserData } from './userdata';

export interface Conversation {
  conversationId: number;
  profilePicUrl: string,
  messages: Message[];
  membersId : number[]; 
}