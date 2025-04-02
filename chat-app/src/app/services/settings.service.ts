import { HttpClient } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  notificationsOn = signal<boolean>(true);
  api = environment.baseUrl + 'settings';

  private http = inject(HttpClient);

  getDefaultProfilePic(): Observable<{ url: string }> {return this.http.get<{ url: string }>(`${this.api}/default-profile-pic-url`);
  }

  getDefaultGroupPic(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.api}/default-group-pic-url`);
  }

  updateNotificationSetting(notificationOn: boolean) {
    return this.http.post<boolean>(`${this.api}/update-notifications-setting`, {notificationOn: notificationOn});
  }

  updateNotification(notificationSetting: boolean) {
    this.notificationsOn.set(notificationSetting);
    this.updateNotificationSetting(notificationSetting).subscribe();
  }
}
