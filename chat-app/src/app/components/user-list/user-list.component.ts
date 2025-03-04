import { Component, inject, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../services/user.service';
import { ConversationService } from '../../services/conversation.service';
import { Conversation } from '../../models/conversation';
import { UserData } from '../../models/userdata';
import { MaterialModule } from '../../modules/material.module';
import { UserDataService } from '../../services/user-data.service';


@Component({
  selector: 'app-user-list',
  imports: [MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private userService = inject(UserService);
  private conversationService = inject(ConversationService);
  private userDataService = inject(UserDataService);
  users = this.userService.userList;
  createGroupToggle = false;

  private dialogRef = inject(MatDialogRef<SidebarComponent>);

  startConversation(user: UserData) {
    let ownUserId = this.userDataService.user()?.userId;
    if (!ownUserId) {
      return;
    }
    this.conversationService.createConversationWith(user.userId).subscribe({
      next: conversationId => {
        if (conversationId) {
          let newConversation: Conversation = {
            conversationId: conversationId, 
            messages: [],
            profilePicUrl: user.profilePicUrl,
            memberIds: [ownUserId, user.userId]
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
    return this.conversationService.conversationList().some(conversation => {
      let isIncluded = conversation.memberIds.includes(userId);
      let lenght = conversation.memberIds.length;
      return isIncluded && lenght == 2;
    });
  }

  createGroupConversation() {
    this.createGroupToggle = true;
  }

  // onFileSelected(event: Event) {
  //   if (!event || !event.target) {
  //     return;
  //   }
  //   const input = event.target as HTMLInputElement;

  //   if (input.files && input.files[0]) {
  //     this.selectedFile = input.files[0];
  //     this.previewImage();
  //     if (this.createForm) {
  //       this.createForm.pattchValue({ profilePicUrl})
  //     }
  //   }
  // }
}
