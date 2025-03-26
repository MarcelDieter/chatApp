import { Injectable, model, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  notificationsOn = signal<boolean>(true);
}
