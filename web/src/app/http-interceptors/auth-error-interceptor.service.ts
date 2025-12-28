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
  private isRefreshTokenInvalid = false; // Флаг для предотвращения повторных попыток обновления после 412/401
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private refreshErrorSubject: BehaviorSubject<HttpErrorResponse | null> = new BehaviorSubject<HttpErrorResponse | null>(null);

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
    
    // Если это запрос на логин, сбрасываем флаг невалидности refresh token
    // (при успешном логине будет установлен новый валидный refresh token)
    if (url.includes('/public/login') || url.endsWith('/login')) {
      // Сбрасываем флаг, так как после логина будет новый refresh token
      this.isRefreshTokenInvalid = false;
      return next.handle(req);
    }
    
    if (url.includes('/refresh-token') || 
        url.includes('/public/logout') || 
        url.includes('/system-notification/get')) {
      return next.handle(req);
    }

    let headers: { [key: string]: string } = {};
    const authToken = this.storage.getAccessToken();
    
    // Если идет обновление токена, не используем старый токен из localStorage
    // Вместо этого запрос будет обработан через handle401Error, который дождется нового токена
    if (authToken != null && !this.isRefreshing) {
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
          // 403 может означать как ошибку доступа, так и проблему с аутентификацией
          // Spring Security может вернуть AccessDeniedException (403) когда токен истек
          // Пытаемся обновить токен, если refresh token есть
          return this.handle403Error(authReq, next, error);
        }
      }
      return throwError(error);
    }));
  }

  private handle403Error(request: HttpRequest<any>, next: HttpHandler, error?: HttpErrorResponse) {
    // 403 может означать как ошибку доступа, так и проблему с аутентификацией
    // Spring Security может вернуть AccessDeniedException (403) когда токен истек или невалиден
    // Проверяем наличие refresh token - если он есть, пытаемся обновить токен
    // Если обновление успешно - повторяем запрос, если нет - делаем logout
    
    const refreshToken = this.storage.getRefreshToken();
    
    // Если refresh token есть, пытаемся обновить токен (возможно, access token истек)
    if (refreshToken) {
      console.log("403 error received. Attempting to refresh token in case it's expired...");
      
      // Если уже идет обновление токена, ждем его завершения
      if (this.isRefreshing) {
        console.log("403 error received while token refresh is in progress. Waiting for refresh...");
        return race(
          this.refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => {
              if (!token) {
                // Если токен null, обновление не удалось - это ошибка доступа
                return throwError(error || new HttpErrorResponse({
                  error: 'Доступ запрещён.',
                  status: 403,
                  statusText: 'Forbidden'
                }));
              }
              console.log("Token refreshed successfully. Retrying request after 403...");
              return next.handle(this.addTokenHeader(request, token));
            })
          ),
          this.refreshErrorSubject.pipe(
            filter(error => error !== null),
            take(1),
            switchMap((refreshError) => {
              console.log("Token refresh failed after 403. Logout already performed in handle401Error.");
              // Если обновление токена не удалось (412 или 401), logout уже был выполнен в handle401Error
              // Возвращаем EMPTY, чтобы остановить цепочку обработки ошибок
              return EMPTY;
            })
          )
        );
      }
      
      // Если обновление не идет, вызываем handle401Error
      return this.handle401Error(request, next).pipe(
        catchError((refreshError) => {
          // Если обновление токена не удалось, logout уже был выполнен в handle401Error
          // Возвращаем EMPTY, чтобы остановить цепочку обработки ошибок
          return EMPTY;
        })
      );
    }
    
    // Если refresh token отсутствует, проверяем наличие access token
    // Если access token тоже отсутствует - это проблема авторизации, делаем logout
    // Если access token есть - это реальная ошибка доступа, просто показываем ошибку
    const accessToken = this.storage.getAccessToken();
    if (!accessToken) {
      // Нет ни access token, ни refresh token - пользователь не авторизован
      console.log("403 error received without refresh token and access token. Performing logout and redirecting to login...");
      this.storage.resetCredentials();
      this.storage.clear();
      this.toasty.err(403, "Сессия истекла. Пожалуйста, выполните вход.");
      this.redirectToLoginIfNeeded();
      return EMPTY;
    } else {
      // Access token есть, но refresh token отсутствует - это реальная ошибка доступа
      // Не делаем logout, просто показываем ошибку
      console.log("403 error received without refresh token, but access token is present. This is likely an access denied error.");
      return throwError(error || new HttpErrorResponse({
        error: 'Доступ запрещён.',
        status: 403,
        statusText: 'Forbidden'
      }));
    }
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {

      const refreshToken = this.storage.getRefreshToken();
      console.log("Refresh token:", refreshToken ? "present" : "missing");
      
      // Если refresh token отсутствует, и он уже был признан невалидным ранее, 
      // не пытаемся обновлять токен повторно
      if (!refreshToken && this.isRefreshTokenInvalid) {
        console.log("Refresh token was previously invalidated and is still missing. Redirecting to login...");
        this.storage.resetCredentials();
        this.storage.clear();
        this.redirectToLoginIfNeeded();
        return EMPTY;
      }
      
      // Если refresh token присутствует, даже если флаг был установлен ранее,
      // пытаемся использовать его (возможно, пользователь залогинился заново)
      // Флаг будет сброшен при успешном обновлении токена

      console.log("Access token is expired. Attempting to refresh...")
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.refreshErrorSubject.next(null);

      if (refreshToken) {
        console.log("Calling refreshToken API...")
        return this.authService.refreshToken(refreshToken)
            .pipe(
            switchMap((credentials: UserCredentials) => {
              console.log("Refresh token successful. Updating credentials...")
              
              // Проверяем, что accessToken существует
              // Это критическая ошибка - сервер вернул некорректный ответ
              if (!credentials || !credentials.accessToken) {
                console.error("Invalid credentials received: missing accessToken");
                console.error("Server returned 200 OK but response is missing accessToken field");
                console.error("Received credentials:", credentials);
                
                // Устанавливаем флаг, так как это критическая проблема с ответом сервера
                this.isRefreshTokenInvalid = true;
                this.isRefreshing = false;
                
                // Показываем понятное сообщение пользователю
                this.toasty.err(500, "Ошибка сервера: получен некорректный ответ при обновлении сессии. Пожалуйста, выполните вход заново.");
                
                // Очищаем токены и перенаправляем на login
                this.storage.resetCredentials();
                this.storage.clear();
                this.redirectToLoginIfNeeded();
                
                // Создаем ошибку для уведомления ожидающих запросов
                const error = new HttpErrorResponse({
                  error: 'Invalid credentials: missing accessToken',
                  status: 500,
                  statusText: 'Internal Server Error'
                });
                this.refreshErrorSubject.next(error);
                return EMPTY;
              }

              // При успешном обновлении токена сбрасываем флаг невалидности
              this.isRefreshTokenInvalid = false;

              // ВАЖНО: Сначала публикуем токен в subject для ожидающих запросов
              // Это должно произойти ДО сохранения в localStorage и сброса флага isRefreshing
              this.refreshTokenSubject.next(credentials.accessToken);
              
              // Затем сохраняем в localStorage
              this.authService.updateCredentials(credentials);
              
              // И только после этого сбрасываем флаг isRefreshing
              // Это предотвращает race condition: новые запросы будут ждать через race(),
              // а не пытаться использовать старый токен из localStorage
              this.isRefreshing = false;

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
              
              // Критические ошибки, связанные с токенами (412, 401)
              // Эти ошибки означают, что refresh token невалиден или истек
              if (error.status === 412 || error.status === 401) {
                console.log("Invalid or expired refresh token. Status:", error.status)
                console.log("Refresh token was:", this.storage.getRefreshToken() ? "present" : "missing")
                
                // Устанавливаем флаг, чтобы предотвратить повторные попытки обновления токена
                this.isRefreshTokenInvalid = true;
                
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
              
              // Временные ошибки сервера (500, 502, 503, 504) или сетевые ошибки
              // Эти ошибки могут быть временными и не связаны с валидностью токена
              // Не устанавливаем флаг, чтобы при следующей попытке можно было повторить обновление
              const isTemporaryError = error.status === 500 || 
                                       error.status === 502 || 
                                       error.status === 503 || 
                                       error.status === 504 ||
                                       error.status === 0; // Сетевые ошибки (нет ответа от сервера)
              
              if (isTemporaryError) {
                console.log("Temporary error during token refresh. Status:", error.status, "Error:", error)
                console.log("Not setting isRefreshTokenInvalid flag - this may be a temporary server issue")
                
                // Показываем сообщение о временной ошибке
                this.toasty.err(error.status || 500, "Временная ошибка сервера. Пожалуйста, попробуйте войти заново.");
                
                // Очищаем токены и перенаправляем на login, но НЕ устанавливаем флаг
                // Это позволит при следующем логине попытаться обновить токен снова
                this.storage.resetCredentials();
                this.storage.clear();
                this.redirectToLoginIfNeeded();
                return EMPTY;
              }
              
              // Для других неизвестных ошибок тоже перенаправляем на login
              // но не устанавливаем флаг (на случай, если это временная проблема)
              console.log("Unknown error during token refresh. Status:", error.status, "Error:", error)
              this.toasty.err(error.status || 500, "Ошибка при обновлении сессии. Пожалуйста, выполните вход.");
              
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
