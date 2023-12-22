import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserTokenService {
  private userTokenKey = 'userToken';

  setUserToken(userToken: string) {
    localStorage.setItem(this.userTokenKey, userToken);
  }

  getUserToken(): string | null {
    const userToken = localStorage.getItem(this.userTokenKey);
    return userToken ? userToken : null;
   }
   
}
