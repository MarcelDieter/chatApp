import { Injectable, signal } from '@angular/core';
import { UserData } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  user = signal<UserData | null>(null);

  clearStorage() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}
