import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import {StorageService} from "@app/services/storage.service";
import {ROLE_HEADER, TOKEN_HEADER} from "@app/config";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {BehaviorSubject, throwError, EMPTY, race} from "rxjs";
import {AuthService} from "@app/services/auth.service";
import {UserCredentials} from "@app/dto/UserCredentials";
import {Router} from "@angular/router";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private refreshErrorSubject: BehaviorSubject<HttpErrorResponse | null> = new BehaviorSubject<HttpErrorResponse | null>(null);
  private last403ErrorTime: number = 0;
  private readonly ERROR_THROTTLE_MS = 2000; // Показываем ошибку не чаще чем раз в 2 секунды

  constructor(
      private storage: StorageService,
      private authService: AuthService,
      private router: Router,
      private toasty: GlobalToastyService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Пропускаем запросы на обновление токена, логин, логаут и системные уведомления, чтобы избежать рекурсии
    // Проверяем как относительный, так и абсолютный URL
    const url = req.url.toLowerCase();
    if (url.includes('/refresh-token') || 
        url.includes('/public/login') || 
        url.includes('/public/logout') || 
        url.includes('/system-notification/get') ||
        url.endsWith('/login')) {
      return next.handle(req);
    }

    let headers: { [key: string]: string } = {};
    const authToken = this.storage.getAccessToken();
    if (authToken != null) {
      headers[TOKEN_HEADER] = authToken;
    }
    // Устанавливаем Content-Type только если он еще не установлен и запрос имеет тело
    if (!req.headers.has('Content-Type') && req.body != null) {
    headers['Content-Type'] = 'application/json';
    }
    let role = this.storage.getCurrRole();
    if (role) {
      headers[ROLE_HEADER] = role;
    }
    const authReq = req.clone({ setHeaders: headers });
    return next.handle(authReq).pipe(catchError(error => {
      // Не обрабатываем ошибки для публичных эндпоинтов и системных уведомлений
      const isPublicEndpoint = authReq.url.includes('/login') || 
                               authReq.url.includes('/public/') ||
                               authReq.url.includes('/system-notification/get');
      
      if (error instanceof HttpErrorResponse && !isPublicEndpoint) {
        if (error.status === 401){
          return this.handle401Error(authReq, next);
        }
        if (error.status === 403){
          // При 403 также пытаемся обновить токен, если есть refresh token
          // Это нужно для случая, когда сервер возвращает 403 вместо 401 при истекшем токене
          return this.handle403Error(authReq, next, error);
        }
      }
      return throwError(error);
    }));
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler, error?: HttpErrorResponse) {
    // Проверяем наличие refresh token - если он есть, пытаемся обновить access token
    // Это нужно для случая, когда сервер возвращает 403 вместо 401 при истекшем токене
    const refreshToken = this.storage.getRefreshToken();
    
    // Если уже идет обновление токена, ждем его завершения
    if (this.isRefreshing) {
      console.log("403 error received while token refresh is in progress. Waiting for refresh...");
      return race(
        this.refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1),
          switchMap((token) => {
            if (!token) {
              return this.finalize403Error();
            }
            console.log("Token refreshed successfully. Retrying request after 403...");
            return next.handle(this.addTokenHeader(request, token));
          })
        ),
        this.refreshErrorSubject.pipe(
          filter(error => error !== null),
          take(1),
          switchMap((error) => {
            console.log("Token refresh failed. Finalizing 403 error...");
            // Если это ошибка 412, показываем более информативное сообщение
            if (error.status === 412) {
              let errorMessage = "Сессия была завершена. Возможно, вы вошли с другого устройства или браузера.";
              if (error.error) {
                if (typeof error.error === 'string') {
                  errorMessage = error.error;
                } else if (error.error.message) {
                  errorMessage = error.error.message;
                } else if (error.error.error) {
                  errorMessage = error.error.error;
                }
              }
              this.toasty.err(412, errorMessage);
            }
            return this.finalize403Error();
          })
        )
      );
    }
    
    // Если refresh token есть и обновление не идет, пытаемся обновить токен
    if (refreshToken) {
      console.log("403 error received. Attempting to refresh token...");
      return this.handle401Error(request, next);
    }
    
    // Если refresh token отсутствует, обрабатываем как обычную 403 ошибку
    return this.finalize403Error();
  }

  private finalize403Error() {
    // Показываем ошибку только один раз при множественных запросах
    const now = Date.now();
    if (now - this.last403ErrorTime > this.ERROR_THROTTLE_MS) {
      this.last403ErrorTime = now;
      // Показываем toast сообщение об ошибке
      this.toasty.err(403, "Доступ запрещён.");
    }
    
    this.storage.resetCredentials();
    this.storage.clear();
    
    // Перенаправляем на login только если мы еще не на странице логина
    this.redirectToLoginIfNeeded();
    
    // Останавливаем распространение ошибки, так как она уже обработана
    return EMPTY;
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {

      console.log("Access token is expired. Attempting to refresh...")
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.refreshErrorSubject.next(null);

      const refreshToken = this.storage.getRefreshToken();
      console.log("Refresh token:", refreshToken ? "present" : "missing");

      if (refreshToken) {
        console.log("Calling refreshToken API...")
        return this.authService.refreshToken(refreshToken)
            .pipe(
            switchMap((credentials: UserCredentials) => {
              this.isRefreshing = false;

              console.log("Refresh token successful. Updating credentials...")
              
              // Проверяем, что accessToken существует
              if (!credentials || !credentials.accessToken) {
                console.error("Invalid credentials received: missing accessToken");
                const error = new HttpErrorResponse({
                  error: 'Invalid credentials: missing accessToken',
                  status: 500,
                  statusText: 'Internal Server Error'
                });
                this.refreshErrorSubject.next(error);
                return throwError(error);
              }

              this.authService.updateCredentials(credentials);
              
              // Устанавливаем новый токен в subject для ожидающих запросов
              this.refreshTokenSubject.next(credentials.accessToken);

              console.log("Successful refresh of access token. Retrying original request...")
              
              // Повторяем оригинальный запрос с новым токеном
              return next.handle(this.addTokenHeader(request, credentials.accessToken));
            }),
            catchError((error) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(null);
              
              console.error("Error during token refresh:", error);
              console.error("Error status:", error.status);
              console.error("Error message:", error.message);
              if (error.error) {
                console.error("Error details:", error.error);
              }
              
              // Уведомляем ожидающие запросы об ошибке
              this.refreshErrorSubject.next(error);
              
              if (error.status === 412 || error.status === 401) {
                console.log("Invalid or expired refresh token. Status:", error.status)
                console.log("Refresh token was:", this.storage.getRefreshToken() ? "present" : "missing")
                
                // Показываем понятное сообщение пользователю
                if (error.status === 412) {
                  // 412 обычно означает, что refresh token был отозван (например, из-за входа с другого устройства)
                  let errorMessage = "Сессия была завершена. Возможно, вы вошли с другого устройства или браузера.";
                  if (error.error) {
                    if (typeof error.error === 'string') {
                      errorMessage = error.error;
                    } else if (error.error.message) {
                      errorMessage = error.error.message;
                    } else if (error.error.error) {
                      errorMessage = error.error.error;
                    }
                  }
                  this.toasty.err(412, errorMessage);
                } else {
                  // 401 при обновлении токена означает, что refresh token истек или невалиден
                  this.toasty.err(401, "Время сессии истекло. Пожалуйста, выполните вход.");
                }
                
                this.storage.resetCredentials();
                this.storage.clear();
                this.redirectToLoginIfNeeded();
                return EMPTY;
              }
              
              // Для других ошибок (500, сетевые и т.д.) тоже перенаправляем на login
              // чтобы избежать зависания
              console.log("Error refreshing token. Status:", error.status, "Error:", error)
              this.storage.resetCredentials();
              this.storage.clear();
              this.redirectToLoginIfNeeded();
              return EMPTY;
            })
        );
      }
      
      // Если нет refresh token, перенаправляем на login
      console.log("No refresh token found. Redirecting to login...")
      this.isRefreshing = false;
      this.storage.resetCredentials();
      this.redirectToLoginIfNeeded();
      return EMPTY;
    }

    // Если уже идет обновление токена, ждем его завершения
    // Используем race между успешным обновлением и ошибкой
    // Добавляем таймаут, чтобы избежать зависания запроса
    return race(
      this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          if (!token) {
            return throwError(new HttpErrorResponse({
              error: 'Token refresh failed',
              status: 401,
              statusText: 'Unauthorized'
            }));
          }
          return next.handle(this.addTokenHeader(request, token));
        })
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

  /**
   * Перенаправляет на страницу логина, если пользователь еще не на ней
   * Используется для избежания дублирования кода
   */
  private redirectToLoginIfNeeded(): void {
    const currentUrl = this.router.url;
    if (!currentUrl.includes('/login')) {
      // Используем setTimeout для асинхронной навигации, чтобы избежать проблем
      // с обработкой ошибок в текущем цикле обработки событий
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 100);
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    let headers = request.headers.set(TOKEN_HEADER, token);
    // Обновляем роль в заголовках, если она есть
    const role = this.storage.getCurrRole();
    if (role) {
      headers = headers.set(ROLE_HEADER, role);
    }
    return request.clone({ headers });
  }
}
