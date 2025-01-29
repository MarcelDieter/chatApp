import { Injectable } from '@angular/core';
import { User } from '../user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [
    {
      name: 'user1',
      profilePic: '/profilePics/shiba1.jpg',
      active: false,
    },
    {
      name: 'user2',
      profilePic: '/profilePics/f0d4011c75b92f165dbab83c8654ebf1.jpg',
      active: true,
    },
    {
      name: 'user3',
      profilePic: '/profilePics/cutest-dog-breeds-jpg.jpg',
      active: false,
    },
  ];

  constructor() {}

  getUsers(): User[] {
    return this.users;
  }
}
