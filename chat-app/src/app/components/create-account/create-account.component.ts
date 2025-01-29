import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '../../modules/forms.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-create-account',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInput, FormsModule, MatIcon],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnInit{
  createForm?: FormGroup
  
  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.createForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  
  createAccount() {

  }

  cancel() {
    this.dialogRef.close();
  }
}
