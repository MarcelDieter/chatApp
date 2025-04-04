import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable} from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenResponse } from '../models/token-response';
import { CurrentUserService } from './current-user.service';

@Injectable()  
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private currentUserService = inject(CurrentUserService);
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    if (token) {
      req = this.addTokenHeader(req, token)
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
        this.currentUserService.user.set(null);
        localStorage.clear();
        return throwError(() => new Error(errordata.message));
      })
    );
  }

  addTokenHeader(req: HttpRequest<any>, jwtToken: string) {
    return req.clone({headers: req.headers.set('Authorization', `Bearer ${jwtToken}`)})
  }
}