import { Component, computed, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { LoggedInService } from '../../services/logged-in.service';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private loggedInService = inject(LoggedInService);
  
  loggedin = computed(() => this.loggedInService.loggedIn());

  openLogin() {
    this.dialog.open(LoginComponent);
  };

  logout() {
    this.loggedInService.loggedIn.set(false);
  };
}
