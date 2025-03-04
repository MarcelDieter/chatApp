import { HostListener, inject, Injectable } from '@angular/core';
import { Message } from '../models/message';
import { UserService } from './user.service';
import { ConversationService } from './conversation.service';
import { UserDataService } from './user-data.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  ws: WebSocket | null = null;
  userService = inject(UserService);
  conversationService = inject(ConversationService);
  userDataService = inject(UserDataService);

  wsId = uuidv4();

  constructor() { }



  connect() {
    this.ws = new WebSocket(`ws://localhost:8181?wsId=${this.wsId}`);
    this.ws.onmessage = (message) => {
      const obj = JSON.parse(message.data);
      switch (obj.Type) {
        case 'chatMessage': {
          this.conversationService.updateMessages(obj);
          break;
        }
        case 'newUser': {
          this.userService.updateUserList(obj);
          console.log(obj);
          break;
        }
        case 'userActivity': {
          this.userService.updateUserActivity(obj);
          console.log(obj);
          break;
        }
        default: console.log('error');
      }
    };
  }

  sendMessage(message: Message) {
    if (!this.ws) {
      return;
    }
    let jsonObject = JSON.stringify(message);
    this.ws.send(jsonObject);
  }

  // sendMessage(message: Message) {
  //   let obj = { type: 'chatMessage', ...message };
  //   this.sendJsonObject(obj);
  // }

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
  }
}





