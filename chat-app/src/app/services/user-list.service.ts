import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {ActiveUserMessage, NewUserMesaage} from '../models/websocket-messages';
import { UserData } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  baseUrl = 'https://localhost:7062/api/user';
  createForm?: FormGroup;
  users = signal<UserData[]>([]);
  
  private http = inject(HttpClient);
  
  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.baseUrl}/users`);
  }

  getAllUsers() {
    this.getUsers().subscribe({
      next: users => {
        this.users.set(users);
      }
    });
  }

  addToList(newUserMessage: NewUserMesaage) {
    let userData = newUserMessage.userData;
    let newUser: UserData = {
      userId: userData.userId,
      username: userData.username, 
      profilePicUrl: userData.profilePicUrl, 
      active: userData.active};  
    this.users.update(userList => [...userList, newUser]);
  }

  updateUserActivity(activeUserMessage: ActiveUserMessage) {
    this.users.update(userList => {
      userList.map(user => {
        if (user.userId == activeUserMessage.userId) {
          user.active = activeUserMessage.active;
        }
      }); 
      return userList;
    });
  }
 
  getUserById(userId: number) {
    return this.users().find(user => user.userId == userId);
  }

}
