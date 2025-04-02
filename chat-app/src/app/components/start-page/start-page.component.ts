import { Component, inject, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { MatSliderModule }  from '@angular/material/slider'
import { FormBuilder, FormGroup} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { WebsocketService } from '../../services/websocket.service';
import { CurrentUserService } from '../../services/current-user.service';

@Component({
  selector: 'app-start-page',
  imports: [MatSliderModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
})
export class StartPageComponent implements OnInit{
  loginForm?: FormGroup;

  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private currentUserService = inject(CurrentUserService);

  ngOnInit() {
    // this.dialog.open(LoginComponent);
    this.authService.checkIfLoggedIn().subscribe({
      next: res => {
        this.authService.login(res);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  openLogin() {
    this.dialog.open(LoginComponent);
  }

  openCreateAccount() {
    this.dialog.open(CreateAccountComponent);
  }



 
}
