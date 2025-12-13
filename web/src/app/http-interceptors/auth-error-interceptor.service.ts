import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import {StorageService} from "@app/services/storage.service";
import {ROLE_HEADER, TOKEN_HEADER} from "@app/config";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {BehaviorSubject, throwError, EMPTY, race} from "rxjs";
import {AuthService} from "@app/services/auth.service";
import {UserCredentials} from "@app/dto/UserCredentials";
import {Router} from "@angular/router";

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private refreshErrorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
      private storage: StorageService,
      private authService: AuthService,
      private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Пропускаем запросы на обновление токена и логин, чтобы избежать рекурсии
    // Проверяем как относительный, так и абсолютный URL
    const url = req.url.toLowerCase();
    if (url.includes('/refresh-token') || url.includes('/public/login') || url.endsWith('/login')) {
      return next.handle(req);
    }

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
      this.refreshErrorSubject.next(null);

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
              
              // Уведомляем ожидающие запросы об ошибке
              this.refreshErrorSubject.next(error);
              
              if (error.status === 412 || error.status === 401) {
                console.log("Invalid or expired refresh token. Status:", error.status)
                console.log("Refresh token was:", this.storage.getRefreshToken() ? "present" : "missing")
                this.storage.resetCredentials();
                this.storage.clear();
                // Небольшая задержка перед навигацией, чтобы избежать проблем с обработкой ошибок
                setTimeout(() => {
                  this.router.navigateByUrl('/login');
                }, 100);
                return EMPTY;
              }
              
              // Для других ошибок (500, сетевые и т.д.) тоже перенаправляем на login
              // чтобы избежать зависания
              console.log("Error refreshing token. Status:", error.status, "Error:", error)
              this.storage.resetCredentials();
              this.storage.clear();
              setTimeout(() => {
                this.router.navigateByUrl('/login');
              }, 100);
              return EMPTY;
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
    // Используем race между успешным обновлением и ошибкой
    return race(
      this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token)))
      ),
      this.refreshErrorSubject.pipe(
        filter(error => error !== null),
        take(1),
        switchMap((error) => {
          // Если была ошибка обновления, пробрасываем её
          return throwError(error);
        })
      )
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER, token) });
  }
}
