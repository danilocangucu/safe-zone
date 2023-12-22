import { computed, Injectable, signal} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserTokenService } from '../user/user-token.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(
  ) {}

  setUserRole(role: string) {
    localStorage.setItem('userRole', role);
    this.userRole = signal(role);
  }

  setUserName(name: string) {
    localStorage.setItem('userName', name);
    this.userName = signal(name);
  }

  setUserEmail(email: string) {
    localStorage.setItem('userEmail', email);
    this.userEmail = signal(email);
  }

  setUserId(id: string) {
    localStorage.setItem('userId', id);
    this.userId = signal(id);
  }

  setUserAvatar(avatar: string) {
    localStorage.setItem('userAvatar', avatar);
    this.userAvatar = signal(avatar);
  }
  setToken(token: string) {
    localStorage.setItem('userToken', token);
    this.userToken = signal(token);
  }

  userToken = computed(() => (localStorage.getItem('userToken') || ''));
  userName = computed(() => (localStorage.getItem('userName') || ''));
  userAvatar = computed(() => (localStorage.getItem('userAvatar') || ''));
  userEmail = computed(() => (localStorage.getItem('userEmail') || ''));
  userId = computed(() => (localStorage.getItem('userId') || ''));
  userRole = computed(() => (localStorage.getItem('userRole') || ''));
}
