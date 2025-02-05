import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedInService {
  loggedIn = signal(false);

  constructor() { }
}
