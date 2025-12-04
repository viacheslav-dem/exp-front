import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import {StorageService} from "@app/services/storage.service";
import {ROLE_HEADER, TOKEN_HEADER} from "@app/config";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {BehaviorSubject, throwError, EMPTY} from "rxjs";
import {AuthService} from "@app/services/auth.service";
import {UserCredentials} from "@app/dto/UserCredentials";
import {Router} from "@angular/router";

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
      private storage: StorageService,
      private authService: AuthService,
      private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let headers = {};
    const authToken = this.storage.getAccessToken();
    if (authToken != null) {
      headers[TOKEN_HEADER] = authToken;
    }
    headers['Content-Type'] = 'application/json';
    let role = this.storage.getCurrRole();
    if (role) {
      headers[ROLE_HEADER] = role;
    }
    const authReq = req.clone({ setHeaders: headers });
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !authReq.url.includes('/login')) {
        if (error.status === 401){
          return this.handle401Error(authReq, next);
        }
        if (error.status === 403){
          this.handle403Error();
        }
      }
      return throwError(error);
    }));
  }

  private handle403Error() {
    this.isRefreshing = false;
    this.storage.resetCredentials();
    this.router.navigateByUrl('/login');
    this.storage.clear();
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {

      console.log("Access token is expired.")
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.storage.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken(refreshToken)
            .pipe(
            switchMap((credentials: UserCredentials) => {
              this.isRefreshing = false;

              this.authService.updateCredentials(credentials);
              
              // Устанавливаем новый токен в subject для ожидающих запросов
              this.refreshTokenSubject.next(credentials.accessToken);

              console.log("Successful refresh of access token.")
              
              // Повторяем оригинальный запрос с новым токеном
              return next.handle(this.addTokenHeader(request, credentials.accessToken));
            }),
            catchError((error) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(null);
              
              if (error.status === 412) {
                console.log("Invalid refresh token.")
                this.storage.resetCredentials();
                this.router.navigateByUrl('/login');
                this.storage.clear();
                return EMPTY;
              } else if (error.status === 401) {
                // Refresh token невалиден или истек
                console.log("Refresh token is invalid or expired.")
                this.storage.resetCredentials();
                this.router.navigateByUrl('/login');
                this.storage.clear();
                return EMPTY;
              }
              
              // Для других ошибок пробрасываем дальше
              return throwError(error);
            })
        );
      }
      
      // Если нет refresh token, перенаправляем на login
      this.isRefreshing = false;
      this.storage.resetCredentials();
      this.router.navigateByUrl('/login');
      return EMPTY;
    }

    // Если уже идет обновление токена, ждем его завершения
    return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER, token) });
  }
}
