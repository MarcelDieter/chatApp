import { Component, inject, ViewEncapsulation } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ContentComponent } from './components/content/content.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { WebsocketService } from './services/websocket.service';
import { CurrentUserService } from './services/current-user.service';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ToolbarComponent, ContentComponent, StartPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chat-app';
  private currentUser = inject(CurrentUserService);
  private websocketService = inject(WebsocketService);
  user = this.currentUser.user;

  ngOnInit() {
    this.websocketService.connect();
  }
}
