import { Injectable, signal } from '@angular/core';
import { UserData } from '../models/userdata';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  user = signal<UserData | null>(null);

  constructor() { }

  clearStorage() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
}
