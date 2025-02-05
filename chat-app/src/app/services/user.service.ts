import { Injectable } from '@angular/core';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [
    {
      id: 0,
      username: 'user1',
      profilePic: '/profilePics/shiba1.jpg',
      password: '',
      active: false,
    },
    {
      id: 0,
      username: 'user2',
      profilePic: '/profilePics/f0d4011c75b92f165dbab83c8654ebf1.jpg',
      password: '',
      active: true,
    },
    {
      id: 0,
      username: 'user3',
      profilePic: '/profilePics/cutest-dog-breeds-jpg.jpg',
      password: '',
      active: false,
    },
  ];

  constructor() {}

  getUsers(): User[] {
    return this.users;
  }
}
