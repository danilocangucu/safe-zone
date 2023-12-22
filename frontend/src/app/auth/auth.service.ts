import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserTokenService } from '../user/user-token.service';
import { StateService } from '../states/state.service';
import { NotificationTypeEnum } from '../notifications/types/notificationType.enum';
import { NotificationService } from '../notifications/services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userRole = localStorage.getItem('userRole') || '';
  public userName = localStorage.getItem('userName') || '';
  public userEmail = localStorage.getItem('userEmail') || '';
  public userId = localStorage.getItem('userId') || '';
  public userAvatar = localStorage.getItem('userAvatar') || '';

  constructor(
    private userTokenService: UserTokenService,
    private router: Router,
    private stateService: StateService,
    private notificationService: NotificationService,
  ) {}

  public async getUserInfo(): Promise<void> {
    const token = this.userTokenService.getUserToken();
    if (!token) {
      this.signOut();
      return;
    }

    try {
      const response = await fetch('https://localhost:448/private/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      this.userRole = data.role;
      this.userName = data.name;
      this.userEmail = data.email;
      this.userId = data.userId;
      this.userAvatar = data.avatar;
      this.stateService.setUserRole(data.role);
      this.stateService.setUserName(data.name);
      this.stateService.setUserEmail(data.email);
      this.stateService.setUserId(data.userId);
      this.stateService.setUserAvatar(data.avatar);

    } catch (error) {
      this.signOut();
      this.notificationService.setNotification({
        type: NotificationTypeEnum.danger,
        text: 'An error occurred. Please try again.',
      });
    }
  }

  public signOut() {
    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      this.router.navigate(['/login']);
    }, 5);
  }
}
