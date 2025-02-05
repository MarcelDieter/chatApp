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
import { LoggedInService } from '../../services/logged-in.service';

@Component({
  selector: 'app-login',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInput, MatIcon, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm?: FormGroup;

  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  loggedInService = inject(LoggedInService);
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm?.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next:(res) => {
          alert(res.message)
          console.log("Test");
          this.loggedInService.loggedIn.set(true);
        },
        error:(err) => {
          alert(err.error.message);
        }
      });
    }
  }

  openCreateAccount() {
    this.dialogRef.close();
    this.dialog.open(CreateAccountComponent);
  }
}
