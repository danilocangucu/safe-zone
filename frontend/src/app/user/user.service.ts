import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'https://localhost:448/private/users'; 
  constructor(
    private requestService: RequestService,
  ) { }
  public deleteUser(id: string) {
    return this.requestService.httpRequest('DELETE', this.url);
  }
}
