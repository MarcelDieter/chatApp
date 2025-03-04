import { Component, computed, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { UserDataService } from '../../services/user-data.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private webSocketService = inject(WebsocketService);
  
  user = this.userDataService.user;

  openLogin() {
    this.dialog.open(LoginComponent);
  };

  logout(username: string | undefined) {
    if (username != undefined) {
      this.authService.logout().subscribe({
        next: res => {
          localStorage.clear();
          this.userDataService.user.set(null);
        }
      })
    }
  };
}