import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { MaterialModule } from '../../modules/material.module';
import { UserListService } from '../../services/user-list.service';
import { UserDTO } from '../../models/user';
import { NgClass } from '@angular/common';
import { FormsModule } from '../../modules/forms.module';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-list',
  imports: [MaterialModule, NgClass, CdkDrag, CdkDropList, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  createGroupToggle = false;
  expandToggle = false;
  group: UserDTO[] = [];
  imageDisplayed = 'https://localhost:7062/DefaultGroupPic/';

  private conversationService = inject(ConversationService);
  private userListService = inject(UserListService);
  private fb = inject(FormBuilder);

  users = this.userListService.users();


  createForm: FormGroup = this.fb.group({
      groupName: ['', Validators.required],
      groupProfilePic: ['', Validators.required],
      groupMember: [[], Validators.required]
    });


  startConversationWith(user: UserDTO) {
    this.conversationService.startConversationWith(user);
  }

  conversationWithUserExists(userId: number) {
    return this.conversationService.conversationWithUserExsits(userId);
  }


  createGroupConversation() {
    this.expandToggle = true;
    setTimeout(() => {
      this.createGroupToggle = true;
      1;
    }, 600);
  }

  drop(event: CdkDragDrop<UserDTO[]>) {
    if (event.previousContainer == event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  createGroup() {
    // if (!this.createForm.valid) {
    //   return;
    // }
    const formData = new FormData();
    formData.append('groupName', );
    formData.append('profilePic', this.selectedFile, this.selectedFile.name);
    formData.append('memberIds', this.group);

    this.conversationService.createGroup(formData).subscribe({next: res => {
      
    }})
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
