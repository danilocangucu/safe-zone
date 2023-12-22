import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpClientWithInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Modify the request here if needed (e.g., for headers, authentication, etc.)
    // For example, you can add headers or modify the request method here.

    // Then, pass the modified request to the next interceptor or the HttpClient
    return next.handle(req);
  }
}
