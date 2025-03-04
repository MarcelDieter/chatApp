import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginUser } from '../models/login-user';
import { Observable } from 'rxjs';
import { TokenResponse } from '../models/token-response';
import { LoginResponse } from '../models/login-response';
import { UserDataService } from './user-data.service';
import { UserData } from '../models/userdata';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = signal(false);
  private baseUrl = 'https://localhost:7062/api/auth';
  private http = inject(HttpClient);
  private userDataService = inject(UserDataService);

  signUp(userObj: FormData) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj);
  }
  
  login(loginObj: LoginUser): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, loginObj);
  }

  logout() {
    return this.http.post<string>(`${this.baseUrl}/logout`, null);
  }

  refreshTokens(): Observable<TokenResponse> {
    let id = this.userDataService.user()?.userId;
    let refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<TokenResponse>(`${this.baseUrl}/refresh-tokens`, {id: id, refreshToken: refreshToken});
  }

  revokeToken() {
    return this.http.delete(`${this.baseUrl}/revoke-token`);
  }

  getUser(): Observable<UserData> {
    return this.http.get<UserData>(`${this.baseUrl}/user`);
  }

  test() {
    return this.http.get(`${this.baseUrl}/test`);
  }

}
