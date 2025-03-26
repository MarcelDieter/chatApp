import { inject, Injectable, signal } from '@angular/core';
import { Conversation } from '../models/conversation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message';
import { CurrentUserService } from './current-user.service';
import { UserListService } from './user-list.service';
import { InformationMessage } from '../models/websocket-messages';
import { UserDTO } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  baseUrl = 'https://localhost:7062/api/conversation';
  conversationList = signal<Conversation[]>([]);                  //here goes a computed signals that holds the conversation based on the current user Signal
  openConversationId = signal<number | null>(null);

  private http = inject(HttpClient);
  private userListService = inject(UserListService);
  private currentUserService = inject(CurrentUserService);

  startConversation(userId: number): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.baseUrl}/start-conversation/${userId}`,null);
  }

  createGroup(data: FormData) {
    return this.http.post(`${this.baseUrl}/create-group`, data);
  }

  retrieveConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/retrieve-conversations`);
  }

  resetUnreadMessages(conversationId: number) {
    return this.http.post(`${this.baseUrl}/reset-unread-messages/${conversationId}`, null);
  }

  getConversations() {
    this.retrieveConversations().subscribe({
      next: conversations => {
        conversations.map(conversation => {
          conversation.messages.map(message => {
            message.date = new Date(message.date)
          })
        })
        this.conversationList.set(conversations);
        
      },
      error: err => {
        console.log(err);
      }
    });
  }

  displayConversation(conversationId: number) {
    this.openConversationId.set(conversationId);
  }

  updateMessages(wsMessage: InformationMessage) {
    let messageObject = wsMessage.data as Message;
    let newMessage: Message = {
      id: messageObject.id,
      conversationId: messageObject.conversationId ,
      senderId: messageObject.senderId,
      content: messageObject.content,
      date: new Date(messageObject.date),
    };
    if (!this.conversationFromMessageExists(newMessage.conversationId)) {
      this.createConversation(newMessage);
    }
    this.conversationList.update((conversations) => {
      return conversations.map((conversation) => {
        if (conversation.id == newMessage.conversationId) {
          conversation = {
            ...conversation,
            messages: [...conversation.messages, newMessage],
          };
          if (newMessage.conversationId != this.openConversationId()) {
            conversation = {
              ...conversation,
              unreadMessages: ++conversation.unreadMessages
            }
          }
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
        id: message.conversationId,
        conversationPictureUrl: user.profilePicUrl,
        messages: [],
        memberIds: [ownUserId, user.userId],
        unreadMessages: 0
      };
      this.addConversation(newConversation);
    }
  }

  startConversationWith(user: UserDTO) {
    let ownUserId = this.currentUserService.user()?.userId;
    if (!ownUserId) {
      return;
    }
    this.startConversation(user.userId).subscribe({
      next: conversation => {
        this.addConversation(conversation);
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
      (conversation) => conversation.id == conversationId
    );
  }

  conversationWithUserExsits(userId: number) {
    let ownUserId = this. currentUserService.user()?.userId;
    if (!ownUserId) {
      return;
    }
    let list = this.conversationList();
    return this.conversationList().some((conversation) => {
      if (ownUserId == userId) {
        return conversation.memberIds.includes(ownUserId) && conversation.memberIds.length == 1;
      }
        return conversation.memberIds.includes(userId) && conversation.memberIds.includes(ownUserId);
    });
  }

  logout() {
    this.openConversationId.set(null);
    this.conversationList.set([]);
  }
}
