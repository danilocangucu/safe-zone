import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationInterface } from '../types/notification-interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notification$ = new Subject<NotificationInterface>();

  setNotification(notification: NotificationInterface): void {
    this.notification$.next(notification);
  }

  getNotification(): Observable<NotificationInterface> {
    return this.notification$.asObservable();
  }
}