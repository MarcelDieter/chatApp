import { Injectable, signal } from '@angular/core';
import { UserDTO } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  user = signal<UserDTO | null>(null);

  clearStorage() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}
