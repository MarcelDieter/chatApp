import { HttpClient} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginUser, UserDTO } from '../models/user';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { LoginResponse } from '../models/login-response';
import { CurrentUserService } from './current-user.service';
import { environment } from '../../environments/environment.development';
import { WebsocketService } from './websocket.service';
import { SettingsService } from './settings.service';
import { ConversationService } from './conversation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = environment.baseUrl + 'auth';
  loggedIn = signal(false);

  private http = inject(HttpClient);
  private currentUserService = inject(CurrentUserService);
  private websocketService = inject(WebsocketService);
  private settingsService = inject(SettingsService);
  private conversationService = inject(ConversationService);

  register(formData: FormData) {
    return this.http.post(`${this.api}/register`, formData);
  }
  
  
  logout() {
    return this.http.post<string>(`${this.api}/logout`, null);
  }
  
  refreshTokens(): Observable<TokenResponse> {
    let id = +localStorage.getItem('userId')!;
    let refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<TokenResponse>(`${this.api}/refresh-tokens`, {id: id, refreshToken: refreshToken});
  }
  
  revokeToken() {
    return this.http.delete(`${this.api}/revoke-token`);
  }
  
  checkIfLoggedIn(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/check-if-logged-in/${this.websocketService.wsId}`, null);
  }
  
  verifyLogin(loginObj: LoginUser): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.api}/login`, loginObj);
  }

  login(loginResponse: LoginResponse) {
     localStorage.setItem('authToken', loginResponse.tokens.accessToken);
     localStorage.setItem('refreshToken', loginResponse.tokens.refreshToken);
     localStorage.setItem('userId', loginResponse.userDTO.userId.toString());
     this.currentUserService.user.set(loginResponse.userDTO);
     this.settingsService.notificationsOn.set(
       loginResponse.settings.notificationsOn
     );
     this.conversationService.getConversations();
  }
 
}
