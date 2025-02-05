import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { LoginComponent } from '../login/login.component';
import { FormsModule } from '../../modules/forms.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { RegisterForm, LoginForm } from '../../user';
import { LoggedInService } from '../../services/logged-in.service';

@Component({
  selector: 'app-create-account',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {
  createForm?: FormGroup;
  selectedFile?: File;

  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loggedInService = inject(LoggedInService);

  ngOnInit(): void {
    this.createForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      profilePic: [null],
    });
  }

  createAccount() {
    if (!this.createForm?.valid) {
      return;
    }
    

    const formData = new FormData();
    const formValues = this.createForm.value;

    formData.append('username', formValues.username);
    formData.append('password', formValues.password);
    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile, this.selectedFile.name);
    }

    // const data: RegisterForm = this.createForm.value;
    this.authService.signUp(formData).subscribe({
      next: (res) => {
        alert(res.message);
        this.loggedInService.loggedIn.set(true);
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event) {
    if (!event || !event.target) {
      return;
    }
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      if (this.createForm) {
        this.createForm.patchValue({ profilePic: this.selectedFile });
      }
    }
  }
}
