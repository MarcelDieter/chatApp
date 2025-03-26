import { HttpClient} from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginUser, UserDTO } from '../models/user';
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

  register(formData: FormData) {
    return this.http.post(`${this.baseUrl}/register`, formData);
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

  getUser(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/user`);
  }

  getDefaultProfilePic(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/default-pic-url`);
  }
}
