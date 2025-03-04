import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { FormGroup } from '@angular/forms';
import { WebsocketService } from './websocket.service';
import { UserData } from '../models/userdata';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  createForm?: FormGroup;
  userList = signal<UserData[]>([]);

  private baseUrl = 'https://localhost:7062/api/user';
  private http = inject(HttpClient);
  
  getUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.baseUrl}/users`);
  }

  getAllUsers() {
    this.getUsers().subscribe({
      next: users => {
        this.userList.set(users);
      }
    })
  }

  updateUserList(obj: any) {
    let userData = obj.UserData;
    let newUser: UserData = {
      userId: userData.UserId,
      username: userData.Username, 
      profilePicUrl: userData.ProfilePic, 
      active: userData.Active};  
    this.userList.update(userList => [...userList, newUser]);
  }

  updateUserActivity(obj: any) {
    this.userList.update(userList => {
      for (let user of userList) {
        if (user.userId == obj.UserId) {
          user.active = obj.Active;
        }
      }
      return userList;
    });

  }
 
  getUserById(userId: number) {
    let userList = this.userList();
    let user = userList.find(user => user.userId == userId);
    return user;
  }

}
