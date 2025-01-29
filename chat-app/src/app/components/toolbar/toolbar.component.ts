import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-toolbar',
  imports: [MaterialModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  loggedin = false;

  private dialog = inject(MatDialog);

  openLogin() {
    this.dialog.open(LoginComponent);
  };

  logout() {};
}
