import { Component, OnDestroy } from '@angular/core';
import { NotificationInterface } from './types/notification-interface';
import { NotificationService } from './services/notification.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnDestroy {
  notification = new BehaviorSubject<NotificationInterface | undefined>(undefined);
  timeoutId?: number;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getNotification().pipe(
      takeUntil(this.destroy$)
    ).subscribe((notification) => {
      if (notification) {
        this.notification.next(notification);
        this.resetTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetTimer(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => {
      this.notification.next(undefined);
    }, 10000);
  }
}
