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
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loginForm?.value;
  }

  openCreateAccount() {
    this.dialogRef.close();
    this.dialog.open(CreateAccountComponent);
  }
}
