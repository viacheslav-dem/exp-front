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

  /**
   * We mark requests that were already retried after token refresh
   * to avoid infinite refresh loops (e.g. when 403 is caused by real permission issues).
   */
  private static readonly RETRY_HEADER = 'X-Auth-Refresh-Retry';

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
        // Some backends respond with 403 for expired/invalid access tokens.
        // Try refreshing on both 401 and 403.
        if (error.status === 401 || error.status === 403) {
          return this.handleAuthError(authReq, next, error.status);
        }
      }
      return throwError(error);
    }));
  }

  private handleAuthError(request: HttpRequest<any>, next: HttpHandler, status: number) {
    const alreadyRetried = request.headers.get(AuthErrorInterceptor.RETRY_HEADER) === '1';

    // If we've already retried this request after refresh:
    // - on 401: session is effectively invalid -> go to login
    // - on 403: likely real "forbidden" -> don't logout, just propagate the error
    if (alreadyRetried) {
      if (status === 401) {
        return this.logoutToLogin();
      }
      return throwError(() => new HttpErrorResponse({
        error: (request as any).error,
        headers: request.headers,
        status,
        statusText: 'Forbidden',
        url: request.url
      }));
    }

    return this.handle401Error(request, next);
  }

  private logoutToLogin() {
    this.isRefreshing = false;
    this.storage.resetCredentials();
    this.storage.clear();
    this.router.navigateByUrl('/login');
    return EMPTY;
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {

      console.log("Access token is expired or invalid.")
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
              return next.handle(this.addTokenHeader(request, credentials.accessToken, true));
            }),
            catchError((error) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(null);
              
              // Уведомляем ожидающие запросы об ошибке
              this.refreshErrorSubject.next(error);
              
              if (error.status === 412 || error.status === 401) {
                console.log("Invalid or expired refresh token. Status:", error.status)
                console.log("Refresh token was:", this.storage.getRefreshToken() ? "present" : "missing")
                return this.logoutToLogin();
              }
              
              // Для других ошибок (500, сетевые и т.д.) тоже перенаправляем на login
              // чтобы избежать зависания
              console.log("Error refreshing token. Status:", error.status, "Error:", error)
              return this.logoutToLogin();
            })
        );
      }
      
      // Если нет refresh token, перенаправляем на login
      this.isRefreshing = false;
      return this.logoutToLogin();
    }

    // Если уже идет обновление токена, ждем его завершения
    // Используем race между успешным обновлением и ошибкой
    return race(
      this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token, true)))
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

  private addTokenHeader(request: HttpRequest<any>, token: string, markRetried = false) {
    let headers = request.headers.set(TOKEN_HEADER, token);
    if (markRetried) {
      headers = headers.set(AuthErrorInterceptor.RETRY_HEADER, '1');
    }
    return request.clone({ headers });
  }
}
