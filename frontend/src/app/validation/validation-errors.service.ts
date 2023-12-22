import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorsService {
  constructor() { }

  generateErrorString(error: any) {
    if (error.error === null) {
      return 'Wrong e-mail and/or password'
    }
    if (error.error && error.error.error) {
      return error.error.error;
    } else if (error.error.message) {
      return `${error.error.message}: ${error.error.details}`;
    }
    return 'Contact the admin'
  }
}
