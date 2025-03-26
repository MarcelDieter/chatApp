import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { CurrentUserService } from '../../services/current-user.service';
import { ConversationService } from '../../services/conversation.service';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule, FormsModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private currentUserService = inject(CurrentUserService);
  private conversationService = inject(ConversationService);
  private settingsService = inject(SettingsService);

  user = this.currentUserService.user;
  isChecked = true;

  openLogin() {
    this.dialog.open(LoginComponent);
  };

  logout(username: string | undefined) {
    if (username != undefined) {
      this.authService.logout().subscribe({
        next: () => {
          localStorage.clear();
          this.currentUserService.user.set(null);
        }
      })
    }
    this.conversationService.logout();
  };
}