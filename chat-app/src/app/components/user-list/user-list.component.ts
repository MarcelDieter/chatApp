import { Component, inject, signal } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { MaterialModule } from '../../modules/material.module';
import { CurrentUserService } from '../../services/current-user.service';
import { UserListService } from '../../services/user-list.service';
import { UserData } from '../../models/user';

@Component({
  selector: 'app-user-list',
  imports: [MaterialModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  createGroupToggle = false;

  private conversationService = inject(ConversationService);
  private userListService = inject(UserListService);
  
  users = this.userListService.users;

  startConversationWith(user: UserData) {
    this.conversationService.startConversationWith(user);
  }

  conversationWithUserExists(userId: number) {
   return this.conversationService.conversationWithUserExsits(userId);
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
