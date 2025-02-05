import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { RegisterForm, LoginForm, User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = signal(false);
  private baseUrl = 'https://localhost:7062/api/User';
  private http = inject(HttpClient);

  signUp(userObj: FormData) {
    return this.http.post<any>(`${this.baseUrl}/register`, userObj);
  }

  login(loginObj: LoginForm) {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, loginObj);
  }
}
