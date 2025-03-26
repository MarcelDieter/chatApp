import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { FormsModule } from '@angular/forms';
import { TimeAndDate } from '../../models/time-and-date';
import { Message } from '../../models/message';
import { CurrentUserService} from '../../services/current-user.service';
import { WebsocketService } from '../../services/websocket.service';
import { ConversationService } from '../../services/conversation.service';
import { UserListService } from '../../services/user-list.service';
import { NgClass } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-content',
  imports: [MaterialModule, FormsModule, NgClass],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  inputMessage = '';
  selectedDate?: Date;
  invalidInput = false;
  shake = false;
  placeholder = '';
  @ViewChild('inputField') inputField: ElementRef | undefined;

  private websocketService = inject(WebsocketService);
  private conversationService = inject(ConversationService);
  private currentUserService = inject(CurrentUserService);
  private userListService = inject(UserListService);
  private settingsService = inject(SettingsService);

  notificationsOn = this.settingsService.notificationsOn;
  conversationList = this.conversationService.conversationList;
  openConversationId = this.conversationService.openConversationId;
  openConversation = computed(() =>
    this.conversationList().find(
      (conversation) => conversation.id == this.openConversationId()
    )
  );

  resetInvalidInput() {
    if (this.invalidInput)
    this.invalidInput = false;
    this.placeholder = '';
  }

  addMessage() {
    if (!this.inputMessage) {
      if (!this.invalidInput) {
        this.invalidInput = true;
        this.inputField?.nativeElement.focus();
        this.placeholder = "Empty input not allowed!"
      }
      this.shake = true;
      setTimeout(() => {
        this.shake = false
      }, 500);
      return;
    }
    const currentUser = this.currentUserService.user();
    if (!currentUser) {
      return;
    }
    let newMessage: Message = {
      id: null,
      content: this.inputMessage,
      date: new Date(this.selectedDate ?? new Date()),
      conversationId: this.openConversation()?.id ?? 0,
      senderId: currentUser.userId,
    };
    this.websocketService.sendMessage(newMessage);
    this.inputMessage = '';
    this.inputField?.nativeElement.focus();
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

  updateUnreadMessagesCount () {
    const openConversation = this.openConversation();
    if (!openConversation) {
      return;
    }
    if (!openConversation.unreadMessages) {
      return;
    }
    const conversationId = this.conversationService.openConversationId();
    if (!conversationId) {
      return;
    }
    this.conversationService.conversationList.update(conversations => {
      return conversations.map(conversation => {
        if (conversation.id == conversationId) {
          conversation = {
            ...conversation,
            unreadMessages: 0
          }
        }
        return conversation;
        })
    });
    this.conversationService.resetUnreadMessages(conversationId).subscribe();
  }
}