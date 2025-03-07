import { Component, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { Conversation } from '../../models/conversation';
import { ConversationService } from '../../services/conversation.service';
import { CurrentUserService } from '../../services/current-user.service';
import { UserListService } from '../../services/user-list.service';

@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  private userListService = inject(UserListService);
  private currentUserService = inject(CurrentUserService);
  private chatService = inject(ConversationService);
  private dialog = inject(MatDialog);

  conversationList = this.chatService.conversationList;
  
  ngOnInit(): void {
    this.userListService.getAllUsers();
  }

  openUserList() {
    this.dialog.open(UserListComponent);
  }

  displayChat(conversationId: number) {
    this.chatService.displayConversation(conversationId);
  }

  getUserById(conversation: Conversation) {
    let userId = conversation.memberIds.find(id => id != this.currentUserService.user()?.userId);
    if (conversation.memberIds[0] == conversation.memberIds[1]) {
      userId = conversation.memberIds[0];
    }
    if (!userId) {
      return;
    }
    let user = this.userListService.getUserById(userId);
    return user;
  }
}
