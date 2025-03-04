import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { Conversation } from '../../models/conversation';
import { ConversationService } from '../../services/conversation.service';
import { UserDataService } from '../../services/user-data.service';
@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  private userService = inject(UserService);
  private userDataService = inject(UserDataService);
  private chatService = inject(ConversationService);
  private dialog = inject(MatDialog);

  conversationList = this.chatService.conversationList;
  ngOnInit(): void {
    this.userService.getAllUsers();
  }

  openUserList() {
    this.dialog.open(UserListComponent);
  }

  displayChat(conversationId: number) {
    this.chatService.displayConversation(conversationId);
  }

  getUserById(conversation: Conversation) {
    let userId = conversation.memberIds.find(id => id != this.userDataService.user()?.userId);
    if (!userId) {
      return;
    }
    let user = this.userService.getUserById(userId);
    return user;
  }
}
