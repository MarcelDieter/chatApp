import { Component, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { Conversation } from '../../models/conversation';
import { ConversationService } from '../../services/conversation.service';
import { CurrentUserService } from '../../services/current-user.service';
import { UserListService } from '../../services/user-list.service';
import { NgClass } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule, NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  private userListService = inject(UserListService);
  private currentUserService = inject(CurrentUserService);
  private conversationService = inject(ConversationService);
  private settingsService = inject(SettingsService);
  private dialog = inject(MatDialog);

  conversationList = this.conversationService.conversationList;
  openConversationId= this.conversationService.openConversationId;
  notificationsOn = this.settingsService.notificationsOn;
  
  ngOnInit(): void {
    this.userListService.getAllUsers();
  }

  openUserList() {
    this.dialog.open(UserListComponent, {maxWidth: '1000px'});
  }

  displayChat(conversationId: number) {
    this.conversationService.displayConversation(conversationId);
  }

  getUserById(conversation: Conversation) {
    let userId = conversation.memberIds.find(id => id != this.currentUserService.user()?.userId);
    if (!userId) {
      userId = this.currentUserService.user()?.userId;
      if (!userId) {
        console.log(conversation);
        return;
      }
    }
    let user = this.userListService.getUserById(userId);
    return user;
  }
}
