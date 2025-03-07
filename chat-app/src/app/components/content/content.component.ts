import { Component, computed, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { TimeAndDate } from '../../models/time-and-date';
import { Message } from '../../models/message';
import { CurrentUserService} from '../../services/current-user.service';
import { WebsocketService } from '../../services/websocket.service';
import { ConversationService } from '../../services/conversation.service';
import { UserListService } from '../../services/user-list.service';

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
  private currentUserService = inject(CurrentUserService);
  private userListService = inject(UserListService);

  conversationList = this.conversationService.conversationList;
  openConversationId = this.conversationService.openConversationId;
  openConversation = computed(() =>this.conversationList().find((conversation) => conversation.conversationId == this.openConversationId()));

  addMessage() {
    const currentUser = this.currentUserService.user();
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
    return this.userListService.getUserById(userId);
  }

  createNewDate(date: Date) {
    return new TimeAndDate(date);
  }
}