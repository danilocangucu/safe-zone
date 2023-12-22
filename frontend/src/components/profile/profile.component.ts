import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationTypeEnum } from 'src/app/notifications/types/notificationType.enum';
import { NotificationService } from 'src/app/notifications/services/notification.service';
import { UserService } from '../../app/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  name: string = localStorage.getItem('userName') || '';
  id: string = localStorage.getItem('userId') || '';
  userRole: string = localStorage.getItem('userRole') || '';
  defaultAvatar: string = 'https://i0.wp.com/researchictafrica.net/wp/wp-content/uploads/2016/10/default-profile-pic.jpg?w=300&ssl=1';
  userAvatar: string = this.defaultAvatar;
  loadingAvatar = false;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('userAvatar') || localStorage.getItem('userAvatar') == "null") {
      this.userAvatar = this.defaultAvatar;
    } else {
      this.userAvatar = localStorage.getItem('userAvatar') || this.defaultAvatar;
    }
  }

  handleFileInput(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files != null ? element.files[0] : null;
  
    if (!file) {
      return;
    }
  
    if (file.size > 2097152) {
      this.notificationService.setNotification({
        type: NotificationTypeEnum.danger,
        text: 'File size should be less than 2MB',
      });
      return;
    }
  
    if (!file.type.match('image.*')) {
      this.notificationService.setNotification({
        type: NotificationTypeEnum.danger,
        text: 'Invalid file type. Please upload an image.',
      });
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        const avatarBlob = e.target.result;
        this.updateAvatar(avatarBlob);
      }
    };
    reader.readAsDataURL(file);
  }

  async updateAvatar(avatarBlob: string | ArrayBuffer) {
    const url = 'https://localhost:448/private/users/avatar';
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('userToken'), 
      'Content-Type': 'application/json'
    });
  
    try {
      this.loadingAvatar = true;
      const response = await this.http.put<any>(url, { avatar: avatarBlob }, { headers }).toPromise();
        this.userAvatar = avatarBlob.toString();
        localStorage.setItem('userAvatar', this.userAvatar);
        this.notificationService.setNotification({
          type: NotificationTypeEnum.success,
          text: 'Avatar updated successfully.',
        });
    } catch (error) {
      this.notificationService.setNotification({
        type: NotificationTypeEnum.danger,
        text: 'Failed to update avatar. Please try again.',
      });
    }
    this.loadingAvatar = false;
  }

  deleteUser() {
    this.userService.deleteUser(this.id).subscribe(
      () => {
        this.notificationService.setNotification({
          type: NotificationTypeEnum.info,
          text: 'User deleted successfully.',
        });
        setTimeout(() => {
          this.authService.signOut();
          this.router.navigate(['/login']);
        } , 1500);
      },
      () => {
        this.notificationService.setNotification({
          type: NotificationTypeEnum.danger,
          text: 'Failed to delete user. Please try again.',
        });
      }
    );
  }
}
