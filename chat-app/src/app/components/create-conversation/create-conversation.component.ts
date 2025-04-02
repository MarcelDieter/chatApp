import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ConversationService } from '../../services/conversation.service';
import { MaterialModule } from '../../modules/material.module';
import { UserListService } from '../../services/user-list.service';
import { UserDTO } from '../../models/user';
import { NgClass } from '@angular/common';
import { FormsModule } from '../../modules/forms.module';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';


@Component({
  selector: 'app-create-conversation',
  imports: [MaterialModule, NgClass, CdkDrag, CdkDropList, FormsModule],
  templateUrl: './create-conversation.component.html',
  styleUrl: './create-conversation.component.scss',
})
export class CreateConversationComponent implements OnInit {
  createGroupToggle = false;
  expandToggle = false;
  groupMembers: UserDTO[] = [];
  imageDisplayed?: string;
  timeStamp = this.getTimeStamp();

  private conversationService = inject(ConversationService);
  private userListService = inject(UserListService);
  private settingsService = inject(SettingsService);
  private fb = inject(FormBuilder);

  users = this.userListService.users;

  createForm: FormGroup = this.fb.group({
    groupName: '',
    groupPic: null,
  });

  ngOnInit(): void {
    this.settingsService.getDefaultGroupPic().subscribe({
      next: (res) => {
        this.imageDisplayed = res.url;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getProfilePic(profilePicUrl: string) {
    return profilePicUrl + '?ver=' + this.timeStamp;
  }
  startConversationWith(user: UserDTO) {
    this.conversationService.startConversationWith(user);
  }

  conversationWithUserExists(userId: number) {
    return this.conversationService.conversationWithUserExsits(userId);
  }

  toggleGroupConversationCreation() {
    if (!this.createGroupToggle) {
      this.openGroupConversationCreation();
    } else {
      this.closeGroupConversationCreation();
    }
  }

  openGroupConversationCreation() {
    this.expandToggle = true;
    setTimeout(() => {
      this.createGroupToggle = true;
    }, 600);
  }

  closeGroupConversationCreation() {
    this.createGroupToggle = false;
    this.expandToggle = false;
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

  onFileSelected(event: Event) {
    if (!event || !event.target) {
      return;
    }
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      let selectedFile = input.files[0];
      this.previewImage(selectedFile);
      if (this.createForm) {
        this.createForm.patchValue({ groupPic: selectedFile });
      }
    }
  }

  previewImage(selectedFile: File | undefined) {
    const reader = new FileReader();

    reader.onload = () => {
      this.imageDisplayed = <string>reader.result;
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  }

  createGroup() {
    if (!this.createForm.valid) {
      return;
    }
    let formValues = this.createForm.value;
    const formData = new FormData();
    let membersIds = this.groupMembers.map((member) => member.userId);

    formData.append('conversationName', formValues.groupName);
    if (formValues.groupPic) {
      formData.append(
        'conversationPicture',
        formValues.groupPic,
        formValues.groupPic.name
      );
    }
    membersIds.forEach((id) => formData.append('memberIds[]', id.toString()));

    this.conversationService
      .createGroup(formData)
      .subscribe({ next: (res) => {} });
  }

  getTimeStamp() {
    return new Date().getTime();
  }
}
