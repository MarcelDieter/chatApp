import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CreateAccountComponent } from '../create-account/create-account.component';

@Component({
  selector: 'app-login',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInput],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  
  login() {}
  openCreateAccount() {
    this.dialogRef.close();
    this.dialog.open(CreateAccountComponent);
  }
}
