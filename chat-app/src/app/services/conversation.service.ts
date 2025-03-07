import { inject, Injectable, signal } from '@angular/core';
import { Conversation } from '../models/conversation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { CurrentUserService } from './current-user.service';
import { UserListService } from './user-list.service';
import { WebsocketChatMessage } from '../models/websocket-messages';
import { UserData } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  baseUrl = 'https://localhost:7062/api/conversation';
  conversationList = signal<Conversation[]>([]);
  openConversationId = signal<number | null>(null);

  private http = inject(HttpClient);
  private userListService = inject(UserListService);
  private currentUserService = inject(CurrentUserService);

  startConversation(userId: number): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/start-conversation/${userId}`,null);
  }

  displayConversation(conversationId: number) {
    this.openConversationId.set(conversationId);
  }

  updateMessages(wsMessage: WebsocketChatMessage) {
    let messageObject = wsMessage.message;
    let newMessage: Message = {
      id: messageObject.id,
      conversationId: messageObject.conversationId,
      senderId: messageObject.senderId,
      content: messageObject.content,
      date: new Date(messageObject.date),
    };
    if (!this.conversationFromMessageExists(newMessage.conversationId)) {
      this.createConversation(newMessage);
    }
    this.conversationList.update((conversations) => {
      return conversations.map((conversation) => {
        if (conversation.conversationId == newMessage.conversationId) {
          conversation = {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          };
        }
        return conversation;
      });
    });
  }

  createConversation(message: Message) {
    let user = this.userListService.getUserById(message.senderId);
    let ownUserId = this.currentUserService.user()?.userId;
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

  startConversationWith(user: UserData) {
    let ownUserId = this.currentUserService.user()?.userId;
    if (!ownUserId) {
      return;
    }
    this.startConversation(user.userId).subscribe({
      next: conversationId => {
        if (conversationId) {
          let newConversation: Conversation = {
            conversationId: conversationId, 
            messages: [],
            profilePicUrl: user.profilePicUrl,
            memberIds: [ownUserId, user.userId]
            };
            this.addConversation(newConversation);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  addConversation(newConversation: Conversation) {
    this.conversationList.update((conversations) => [
      ...conversations,
      newConversation,
    ]);
  }

  conversationFromMessageExists(conversationId: number) {
    return this.conversationList().some(
      (conversation) => conversation.conversationId == conversationId
    );
  }

  conversationWithUserExsits(userId: number) {
    return this.conversationList().some((conversation) => {
      let isIncluded = conversation.memberIds.includes(userId);
      let lenght = conversation.memberIds.length;
      return isIncluded && lenght == 2;
    });
  }
}
