import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { UserDataService } from './user-data.service';
import { TokenResponse } from '../models/token-response';

@Injectable()  
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      req = this.addTokenHeader(req, token);
    }
    return next.handle(req).pipe(catchError(errordata => {
      if (errordata.status == 401) {
        return this.handleRefreshToken(req, next);
      }
      return throwError(() => new Error(errordata.message))
    }));
  }


  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshTokens().pipe(
      switchMap((tokens: TokenResponse) => {
        localStorage.setItem('authToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        req = this.addTokenHeader(req, tokens.accessToken);
        return next.handle(req);
      }),
      catchError(errordata => {
        // this.userDataService.loggedIn.set(false);
        // this.userDataService.clearStorage();
        return throwError(() => new Error(errordata.message));
      })
    );
  }

  addTokenHeader(req: HttpRequest<any>, jwtToken: string) {
    return req.clone({headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)})
  }
}