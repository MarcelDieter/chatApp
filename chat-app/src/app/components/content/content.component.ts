import { Component, computed, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { TimeAndDate } from '../../models/time-and-date';
import { Message } from '../../models/message';
import { UserDataService } from '../../services/user-data.service';
import { WebsocketService } from '../../services/websocket.service';
import { ConversationService } from '../../services/conversation.service';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-content',
  imports: [MaterialModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  inputMessage = '';
  private websocketService = inject(WebsocketService);
  private conversationService = inject(ConversationService);
  private userDataService = inject(UserDataService);
  private userService = inject(UserService);
  
  conversationList = this.conversationService.conversationList;
  openConversationId = this.conversationService.openConversationId;
  openConversation = computed(() => this.conversationList().find(conversation => conversation.conversationId == this.openConversationId()));



  addMessage() {
    const currentUser = this.userDataService.user();
    if (!currentUser) {
      return;
    }
  
    let newMessage: Message = {
      id: null,
      content: this.inputMessage,
      date: new Date(),
      conversationId: this.openConversation()?.conversationId ?? 0,
      senderId: currentUser.userId,
    };
     
    // this.conversationService.conversationList.update(conversations => {
    //   let openConversationId = this.openConversationId();
    //   if (openConversationId) {
    //     return conversations
    //   }
    //   return conversations.map(conversation => conversation.conversationId == openConversationId ? {...conversation, messages: [...conversation.messages, newMessage]}: conversation);
    // });
    this.inputMessage = '';
    this.websocketService.sendMessage(newMessage);
  }

  ngAfterViewChecked() {
    const element = document.getElementById('messageContainer');
    if (element) {
      element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
    }
  }

  getUserById(userId: number) {
    return this.userService.getUserById(userId);
  }

  convertDateToString(date: Date) {
    let newTimeAndDate = new TimeAndDate(date);
    return newTimeAndDate.getWholeDate();
  }

  getTime(date: Date) {
    let minutes = date.getMinutes().toString();
    let hours = date.getHours().toString();
    if (minutes.length == 1) {
      minutes = '0' + minutes;
    }
    return hours + ':' + minutes;
  }

  isSameDay(firstDate: Date, secondDate: Date) {
    return firstDate.getDay() == secondDate.getDay() && firstDate.getMonth() == secondDate.getMonth() && firstDate.getFullYear() == secondDate.getFullYear();
  }

}