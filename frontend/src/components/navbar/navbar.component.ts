import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../app/auth/auth.service';
import { UserTokenService } from '../../app/user/user-token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userRole: BehaviorSubject<string> = new BehaviorSubject('');
  userName: BehaviorSubject<string> = new BehaviorSubject('');
  userEmail: BehaviorSubject<string> = new BehaviorSubject('');
  userId: BehaviorSubject<string> = new BehaviorSubject('');
  userAvatar: BehaviorSubject<string> = new BehaviorSubject('');

  private pollingInterval = 250;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userTokenService: UserTokenService,
    ) {}

  ngOnInit(): void {
    this.startLocalStorageSubscribe();
    this.authService.getUserInfo();
  }

  async ngOnDestroy(): Promise<void> {
    // if we subscribe to the BehaviorSubjects, we need to unsubscribe
    if (this.userName.observed) {
      this.userName.unsubscribe();
    }
    if (this.userEmail.observed) {
      this.userEmail.unsubscribe();
    }
    if (this.userId.observed) {
      this.userId.unsubscribe();
    }
    if (this.userRole.observed) {
      this.userRole.unsubscribe();
    }
    if (this.userAvatar.observed) {
      this.userAvatar.unsubscribe();
    }
  }

  startLocalStorageSubscribe() {
    timer(0, this.pollingInterval).pipe(
      tap(() => this.checkLocalStorageValues())
    ).subscribe();
  }

  checkLocalStorageValues() {
    this.userName.next(localStorage.getItem('userName') || '');
    this.userEmail.next(localStorage.getItem('userEmail') || '');
    this.userId.next(localStorage.getItem('userId') || '');
    this.userRole.next(localStorage.getItem('userRole') || '');
    this.userAvatar.next(localStorage.getItem('userAvatar') || '');
    this.validateToken();
  }

  private validateToken() {
    const token = this.userTokenService.getUserToken();
    if (!token) { 
      this.signOut();
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  async signOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
