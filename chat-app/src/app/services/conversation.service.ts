import { inject, Injectable, signal } from '@angular/core';
import { Conversation } from '../models/conversation';
import { TimeAndDate } from '../models/time-and-date';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Message } from '../models/message';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  conversationList = signal<Conversation[]>([]);
  openConversationId = signal<number | null>(null);
  private baseUrl = 'https://localhost:7062/api/conversation';
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private userDataService = inject(UserDataService);
  constructor() {}

  createConversationWith(userId: number): Observable<number>{
    return this.http.post<number>(`${this.baseUrl}/start-conversation/${userId}`, null);
  }

  
  displayConversation(conversationId: number) {
    this.openConversationId.set(conversationId);
  }
  
  updateMessages(message: Message) {
    if (!this.conversationExists(message.conversationId)) {
      this.startConversation(message);
    }

    this.conversationList.update(conversations => {
      return conversations.map(conversation => conversation.conversationId == message.conversationId ? {...conversation, messages: [...conversation.messages, message]}: conversation);
    });
  }

  startConversation(message: Message) {
    let user = this.userService.getUserById(message.senderId);
    let ownUserId = this.userDataService.user()?.userId;
    if (user && ownUserId) {
      let newConversation: Conversation = {
        conversationId: message.conversationId,
        profilePicUrl: user.profilePicUrl,
        messages: [],
        memberIds: [ownUserId, user.userId],
      };
      this.addConversation(newConversation);
    }
  }
  
  addConversation(newConversation: Conversation) {
    this.conversationList.update((conversations) => [
      ...conversations,
      newConversation,
    ]);
  }

  conversationExists(conversationId: number) {
    return this.conversationList().some((conversation) => conversation.conversationId == conversationId);
  }
}
