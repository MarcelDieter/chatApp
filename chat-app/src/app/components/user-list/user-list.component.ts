import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConversationService } from '../../services/conversation.service';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';
import { v4 as uuidv4 } from 'uuid';
import { UserData } from '../../models/userdata';


@Component({
  selector: 'app-user-list',
  imports: [MatListModule, MatButtonModule, MatIconModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private userService = inject(UserService);
  private conversationService = inject(ConversationService);
  users = this.userService.userList;

  private dialogRef = inject(MatDialogRef<SidebarComponent>);

  startConversation(user: UserData) {
    this.conversationService.createConversationWith(user.userId).subscribe({
      next: conversationId => {
        if (conversationId) {
          let newConversation: Conversation = {
            conversationId: conversationId, 
            messages: [],
            profilePicUrl: user.profilePicUrl,
            membersId: [user.userId]
            };
            this.conversationService.addConversation(newConversation);
        }
      },
      error: err => {
        console.log(err);
      }
    });


  }

  conversationWithUserExists(userId: number) {
    return this.conversationService.conversationList().some(conversation => conversation.membersId.includes(userId) && conversation.membersId.length == 1);
  }

  createGroupConversation() {

  }
}
