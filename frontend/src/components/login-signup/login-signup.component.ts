import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { UserTokenService } from '../../app/user/user-token.service';
import { ValidationErrorsService } from '../../app/validation/validation-errors.service';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { AuthService } from '../../app/auth/auth.service';
import { NotificationService } from '../../app/notifications/services/notification.service';
import { NotificationTypeEnum } from 'src/app/notifications/types/notificationType.enum';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent {
  userName = '';
  userEmail = '';
  userRole = '';
  userAvatar = '';
  loading = false;

  isSignUp = false;
  userType: 'USER_CLIENT' | 'USER_SELLER' = 'USER_CLIENT';
  showAvatarChangeButton = false;

  apiUrl = 'https://localhost:448/public';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private http: HttpClient,
    private userTokenService: UserTokenService,
    private errorValidation: ValidationErrorsService,
    private authService: AuthService,
    private notificationService: NotificationService,   ) {
    this.userType = 'USER_CLIENT';
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
    this.updateAvatarButtonState();
  }

  updateAvatarButtonState() {
    this.showAvatarChangeButton = this.isSignUp && this.userType === 'USER_SELLER';
    this.cd.detectChanges();
  }

  handleFileInput(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files != null ? element.files[0] : null;

    if (file) {
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

      // Read the file as a blob and store it
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          this.userAvatar = e.target.result.toString();
        }
      };
      reader.readAsDataURL(file);
    } 
  }



  private validateInput(payload: any, action: string): boolean {
    let errorMessages = [];
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // Minimum five characters, at least one letter and one number special characters are allowed"!#€%&/()=?¡*¨[]_:;.,-"
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!#€%&/()=?¡*¨[]_:;.,-]{5,}$/;

    if (action === 'authenticate' || action === 'register') {
      if (!payload.email) {
        errorMessages.push('Email is required.');
      } else if (!emailRegex.test(payload.email)) {
        errorMessages.push('Invalid email address.');
      }

      if (!payload.password) {
        errorMessages.push('Password is required.');
      } 
    }

    if (action === 'register') {
      if (!payload.name) {
        errorMessages.push('Name is required.');
      }
      if (passwordRegex.test(payload.password)) {
        errorMessages.push('Invalid password.');
      }
    }

    if (errorMessages.length > 0) {
      this.notificationService.setNotification({
        type: NotificationTypeEnum.danger,
        text: (errorMessages.join('\n')),
      });
      return false;
    }
    return true;
  }

  onSubmit(
    action: string,
    name: HTMLInputElement | null,
    email: HTMLInputElement,
    password: HTMLInputElement
    ) {
    const commonData = {
      "password": password.value,
      "email": email.value
    };
    let requestData
    if (action === 'register') {
      requestData = {
        ...commonData,
        "name": name ? name.value : '',
        "role": this.userType,
        "avatar": this.userAvatar
      }
    } else {
      requestData = commonData
    }

    this.makePostRequestToUserMicroService(action, requestData);
  }

  async makePostRequestToUserMicroService(action: string, payload: any): Promise<void> {
    // Front end validation
    if (!this.validateInput(payload, action)) {
      return;
    }    
    try {
      this.loading = true;
      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/${action}`, payload, this.httpOptions).pipe(
          timeout(8000), // Set the request to timeout after 8 seconds
          catchError((error) => this.handleError(error))
        )
      );
      if (response.token) {
        localStorage.setItem('userRole', this.userType);
        this.userTokenService.setUserToken(response.token);
        this.router.navigate(['/welcome-page']);
      }
    } catch (error) {
      this.authService.signOut();
    }
    this.loading = false;
  }

  private handleError(error: any) {
    let errorMessage = '';
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          errorMessage = 'Unauthorized: Incorrect email or password.';
          break;
        case 409:
          errorMessage = 'Conflict: Email already registered.';
          break;
        case 400:
          errorMessage = 'Bad Request: ' + this.errorValidation.generateErrorString(error);
          break;
        case 404:
          errorMessage = 'Not found: ' + this.errorValidation.generateErrorString(error);
          break;
        case 500:
          errorMessage = 'Internal Server Error: ' + this.errorValidation.generateErrorString(error);
          break;
        case 503:
        errorMessage = 'Service Unavailable: ' + this.errorValidation.generateErrorString(error);
        break;
        default:
          errorMessage = 'An unexpected error occurred. Please try again later.';
          break;
      }
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'Request timeout: The server did not respond in time.';
    } else {
      errorMessage = 'An unexpected error occurred. Please try again later.';
    }
    this.notificationService.setNotification({
      type: NotificationTypeEnum.danger,
      text: errorMessage,
    });
    return throwError(() => new Error(errorMessage)); // Throw an observable error
  }
}

