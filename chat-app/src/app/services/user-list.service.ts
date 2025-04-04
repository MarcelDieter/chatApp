import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { UserDTO } from '../models/user';
import { InformationMessage } from '../models/websocket-messages';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  api = environment.baseUrl + 'settings';
  createForm?: FormGroup;
  users = signal<UserDTO[]>([]);
  
  private http = inject(HttpClient);
  
  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.api}/users`);
  }

  getAllUsers() {
    this.getUsers().subscribe({
      next: users => {
        this.users.set(users);
      }
    });
  }

  addToList(newUserMessage: InformationMessage) {
    let userDTO = newUserMessage.data as UserDTO;
    let newUser: UserDTO = {
      userId: userDTO.userId,
      username: userDTO.username, 
      profilePicUrl: userDTO.profilePicUrl, 
      active: userDTO.active};  
    this.users.update(userList => [...userList, newUser]);
  }

  updateUserActivity(activeUserMessage: InformationMessage) {
    let activeUserMessageData = activeUserMessage.data as {userId: number, active: boolean};
    this.users.update(userList => {
      userList.map(user => {
        if (user.userId == activeUserMessageData.userId) {
          user.active = activeUserMessageData.active;
        }
      }); 
      return userList;
    });
  }
 
  getUserById(userId: number) {
    let userList = this.users();
    let user = this.users().find((user) => user.userId == userId);
    return user;
  }

}
