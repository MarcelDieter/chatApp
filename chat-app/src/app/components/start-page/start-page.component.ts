import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { MatSliderModule }  from '@angular/material/slider'

@Component({
  selector: 'app-start-page',
  imports: [MatSliderModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss'
})
export class StartPageComponent {
  private dialog = inject(MatDialog);
  
  
  openLogin() {
    this.dialog.open(LoginComponent);
  }

  openCreateAccount() {
    this.dialog.open(CreateAccountComponent);
  }
}
