import { TimeAndDate } from './time-and-date';
import { User } from './user';

export class Message {
  user: User = {id: 0, username:'', profilePic:'', password: '', active: false};
  content: string = '';
  date: TimeAndDate | null = null;

  constructor(user: User, content: string, date: TimeAndDate) {
    this.user = user;
    this.content = content;
    this.date = date;
  }
}