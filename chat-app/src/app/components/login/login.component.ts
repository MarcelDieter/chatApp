import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '../../modules/forms.module';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { WebsocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInput,
    MatIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm?: FormGroup;

  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private userService = inject(UserService);
  private websocketService = inject(WebsocketService);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      wsId: [null],
    });
  }

  login() {
    if (this.loginForm?.valid) {
      this.loginForm.patchValue({ wsId: this.websocketService.wsId});
      this.authService.login(this.loginForm.value).subscribe({
        next: (loginResponse) => {
          localStorage.setItem('authToken', loginResponse.tokens.accessToken);
          localStorage.setItem('refreshToken', loginResponse.tokens.refreshToken);
          this.dialogRef.close();
          this.userDataService.user.set(loginResponse.userData);
          this.userService.getAllUsers();
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

}