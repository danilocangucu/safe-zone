import { Injectable } from '@angular/core';
import { UserTokenService } from '../user/user-token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(
    private userTokenService: UserTokenService,
    private httpClient: HttpClient
  ) {}

  getHeaders(): HttpHeaders {
    const token = this.userTokenService.getUserToken();
    if (!token) {
      throw new Error('No token available');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  httpRequest(method: string, url: string, body?: any): Observable<any> {
    const headers = this.getHeaders();
    switch (method) {
      case 'GET':
        return this.httpClient.get(url, { headers });
      case 'POST':
        return this.httpClient.post(url, body, { headers });
      case 'PUT':
        return this.httpClient.put(url, body, { headers });
      case 'DELETE':
        return this.httpClient.delete(url, { headers });
      default:
        throw new Error('Invalid HTTP method');
    }
  }
}
