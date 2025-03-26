import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { WebsocketService } from '../../services/websocket.service';
import { MaterialModule } from '../../modules/material.module';
import { CurrentUserService } from '../../services/current-user.service';
import { UserListService } from '../../services/user-list.service';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-login',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm?: FormGroup;
  loginSend = false;

  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private currentUserService = inject(CurrentUserService);
  private userListService = inject(UserListService);
  private websocketService = inject(WebsocketService);
  private conversationService = inject(ConversationService);

  user = this.currentUserService.user;
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      wsId: [null],
    });
    // this.developmentLogin();
  }

  login() {
    this.loginSend = true;
    if (this.loginForm?.valid) {
      this.loginForm.patchValue({ wsId: this.websocketService.wsId});
      this.authService.login(this.loginForm.value).subscribe({
        next: (loginResponse) => {
          localStorage.setItem('authToken', loginResponse.tokens.accessToken);
          localStorage.setItem('refreshToken', loginResponse.tokens.refreshToken);
          this.dialogRef.close();
          this.currentUserService.user.set(loginResponse.userDTO);
          this.userListService.getAllUsers();
          this.conversationService.getConversations();
          this.loginSend = false;
        },
        error: (err) => {
          alert(err.message);
        },
      });
    }
  }

  openCreateAccount() {
    this.dialogRef.close();
    this.dialog.open(CreateAccountComponent);
  }

  developmentLogin() {
    this.loginForm?.patchValue({
      username: '1',
      password: '1'
    });

    this.login();
  }
}