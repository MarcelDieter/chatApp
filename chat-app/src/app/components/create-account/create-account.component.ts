import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-create-account',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInput],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  
  createAccount() {

  }

  cancel() {
    this.dialogRef.close();
  }
}
