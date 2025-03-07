import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../modules/material.module';

@Component({
  selector: 'app-create-account',
  imports: [MaterialModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss',
})
export class CreateAccountComponent implements OnInit {
  createForm?: FormGroup;
  selectedFile?: File;
  usernameErrorMessage = '';
  createAccountMessage = ''
  imageDisplayed = 'https://localhost:7062/DefaultProfilePic/shiba1.jpg';
  accountCreated = false;

  private dialogRef = inject(MatDialogRef<LoginComponent>);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

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
    const formValues = this.createForm.value;
    const formData = new FormData();

    formData.append('username', formValues.username);
    formData.append('password', formValues.password);
    if (this.selectedFile) {
      formData.append('profilePic', this.selectedFile, this.selectedFile.name);
    }

    this.authService.register(formData).subscribe({
      next: (res) => {
        this.usernameErrorMessage = '';
        this.createAccountMessage = 'Account created successfully!'
        this.accountCreated = true;
      },
      error: (err) => {
          if (err.status == 409) {
          this.usernameErrorMessage = 'Username ist not available';
        }
      }
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
      this.previewImage();
      if (this.createForm) {
        this.createForm.patchValue({ profilePicUrl: this.selectedFile });
      }
    }
  }

  previewImage() {
    const reader = new FileReader();

    reader.onload = () => {
      this.imageDisplayed = <string>reader.result; 
    }
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  login() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent);
  }


}
