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
import { SettingsService } from '../../services/settings.service';
import { LoginUser } from '../../models/user';

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
  loginSend = false;

  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private currentUserService = inject(CurrentUserService);
  private userListService = inject(UserListService);
  private websocketService = inject(WebsocketService);
  private conversationService = inject(ConversationService);
  private settingsService = inject(SettingsService);

  user = this.currentUserService.user;
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    wsId: '',
  });
  
  ngOnInit(): void {
    // this.developmentLogin();
  }

  login() {
    this.loginSend = true;
    if (!this.loginForm.value.username || !this.loginForm.value.password || !this.websocketService.wsId) {
      return;
    }

    this.loginForm.patchValue({ wsId: this.websocketService.wsId});
    const loginObj: LoginUser = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? '',
      wsId: this.websocketService.wsId ?? ''
    }
    this.authService.verifyLogin(loginObj).subscribe({
      next: loginResponse => {
        this.authService.login(loginResponse);
        this.dialogRef.close();
        this.loginSend = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
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