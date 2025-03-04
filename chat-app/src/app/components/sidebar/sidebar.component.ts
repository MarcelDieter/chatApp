import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { Conversation } from '../../models/conversation';
import { ConversationService } from '../../services/conversation.service';
@Component({
  selector: 'app-sidebar',
  imports: [MaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  private userService = inject(UserService);
  private chatService = inject(ConversationService)
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

  getUserById(userId: number) {
    return this.userService.getUserById(userId);
  }
}
