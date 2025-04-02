import { HostListener, inject, Injectable } from '@angular/core';
import { Message } from '../models/message';
import { ConversationService } from './conversation.service';
import { UserListService } from './user-list.service';
import { v4 as uuidv4 } from 'uuid';
import { InformationMessage } from '../models/websocket-messages';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  ws?: WebSocket;
  wsId?: string;
  
  private conversationService = inject(ConversationService);
  private userListService = inject(UserListService);
  
  connect() {
    this.wsId = uuidv4();
    this.ws = new WebSocket(`ws://localhost:8181?wsId=${this.wsId}`);
    this.ws.onmessage = (message) => {
      const messageObj: InformationMessage = JSON.parse(message.data);
      switch (messageObj.type) {
        case 'chatMessage': {
          this.conversationService.updateMessages(messageObj);
          break;
        }
        case 'newUser': {
          this.userListService.addToList(messageObj);
          break;
        }
        case 'userActivity': {
          this.userListService.updateUserActivity(messageObj);
          break;
        }
        case 'newConversation': {
          this.conversationService.addNewGroup(messageObj);
          break;
        }
        default: 
        console.log(`Unknown websocket message received: ${messageObj}`)
      }
    };
  }

  sendMessage(message: Message) {
    if (!this.ws) {
      return;
    }
    let messageContainer = {
      type: 'chatMessage',
      data: message
    }
    let jsonObject = JSON.stringify(messageContainer);
    this.ws.send(jsonObject);
  }

  closeWebSocket() {
    if (!this.ws) {
      return;
    }
    this.ws.close();
  }

  @HostListener('window:beforeunload')
  reloadPage() {
    if (!this.ws) {
      return;
    }
    this.ws.close();
    this.connect();
  }
}





