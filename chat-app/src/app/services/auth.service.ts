import { HttpClient} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginUser, UserData } from '../models/user';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { LoginResponse } from '../models/login-response';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://localhost:7062/api/auth';
  loggedIn = signal(false);

  private http = inject(HttpClient);
  private currentUserService = inject(CurrentUserService);

  register(userObj: FormData) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj);
  }
  
  login(loginObj: LoginUser): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginObj);
  }

  logout() {
    return this.http.post<string>(`${this.baseUrl}/logout`, null);
  }

  refreshTokens(): Observable<TokenResponse> {
    let id = this.currentUserService.user()?.userId;
    let refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<TokenResponse>(`${this.baseUrl}/refresh-tokens`, {id: id, refreshToken: refreshToken});
  }

  revokeToken() {
    return this.http.delete(`${this.baseUrl}/revoke-token`);
  }

  getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/user`);
  }
}
