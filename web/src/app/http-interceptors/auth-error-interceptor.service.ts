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
import {TokenRefreshCoordinatorService} from "@app/services/token-refresh-coordinator.service";

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  private static readonly HTTP_STATUS_UNAUTHORIZED = 401;
  private static readonly HTTP_STATUS_FORBIDDEN = 403;
  private static readonly HTTP_STATUS_PRECONDITION_FAILED = 412;
  private static readonly HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

  private isRefreshing = false;
  private isRefreshTokenInvalid = false; // Флаг для предотвращения повторных попыток обновления после 412/401
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private refreshErrorSubject: BehaviorSubject<HttpErrorResponse | null> = new BehaviorSubject<HttpErrorResponse | null>(null);

  constructor(
      private storage: StorageService,
      private authService: AuthService,
      private router: Router,
      private toasty: GlobalToastyService,
      private refreshCoordinator: TokenRefreshCoordinatorService
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
        if (error.status === AuthErrorInterceptor.HTTP_STATUS_UNAUTHORIZED) {
          return this.handle401Error(authReq, next);
        }
        if (error.status === AuthErrorInterceptor.HTTP_STATUS_FORBIDDEN) {
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
    const accessToken = this.storage.getAccessToken();
    const refreshToken = this.storage.getRefreshToken();
    const isAccessTokenValid = this.storage.isAccessTokenValidNow();
    
    // Если access token валиден, это реальная ошибка доступа, а не проблема с токеном
    // Spring Security должен возвращать 401 для истекших токенов, а не 403
    if (isAccessTokenValid) {
      return this.createForbiddenError(error);
    }
    
    // Если access token невалиден и есть refresh token - пробуем обновить
    if (refreshToken) {
      return this.attemptTokenRefresh(request, next, error);
    }
    
    // Если refresh token отсутствует и access token тоже отсутствует - пользователь не авторизован
    if (!accessToken) {
      // Нет ни access token, ни refresh token - пользователь не авторизован
      this.logoutAndRedirect("Сессия истекла. Пожалуйста, выполните вход.");
      return EMPTY;
    }
    
    // Access token есть, но refresh token отсутствует и access token невалиден
    // Показываем ошибку доступа без попытки обновления
    return this.createForbiddenError(error);
  }

  private createForbiddenError(originalError?: HttpErrorResponse) {
    return throwError(originalError || new HttpErrorResponse({
      error: 'Доступ запрещён.',
      status: AuthErrorInterceptor.HTTP_STATUS_FORBIDDEN,
      statusText: 'Forbidden'
    }));
  }

  private attemptTokenRefresh(request: HttpRequest<any>, next: HttpHandler, originalError?: HttpErrorResponse) {
    // Если уже идет обновление токена, ждем его завершения
    if (this.isRefreshing) {
      return this.waitForTokenRefresh(request, next, originalError);
    }
    
    // Если обновление не идет, вызываем handle401Error
    return this.handle401Error(request, next).pipe(
      catchError((refreshError) => {
        // Если обновление токена вернуло 403, это означает проблему с правами доступа
        // Пробрасываем оригинальную ошибку 403, чтобы её можно было обработать правильно
        if (refreshError?.status === AuthErrorInterceptor.HTTP_STATUS_FORBIDDEN) {
          return throwError(() => originalError || refreshError);
        }
        // Если обновление токена не удалось (412 или 401), logout уже был выполнен в handle401Error
        return EMPTY;
      })
    );
  }

  private waitForTokenRefresh(request: HttpRequest<any>, next: HttpHandler, originalError?: HttpErrorResponse) {
    return race(
      this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          if (!token) {
            return this.createForbiddenError(originalError);
          }
          return next.handle(this.addTokenHeader(request, token));
        })
      ),
      this.refreshErrorSubject.pipe(
        filter(error => error !== null),
        take(1),
        switchMap(() => EMPTY) // Logout уже выполнен в handle401Error
      )
    );
  }

  private logoutAndRedirect(message: string) {
    this.storage.resetCredentials();
    this.storage.clear();
    this.toasty.err(AuthErrorInterceptor.HTTP_STATUS_FORBIDDEN, message);
    this.redirectToLoginIfNeeded();
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {

      const refreshToken = this.storage.getRefreshToken();
      
      // Если refresh token отсутствует, и он уже был признан невалидным ранее, 
      // не пытаемся обновлять токен повторно
      if (!refreshToken && this.isRefreshTokenInvalid) {
        this.storage.resetCredentials();
        this.storage.clear();
        this.redirectToLoginIfNeeded();
        return EMPTY;
      }
      
      // Если refresh token присутствует, даже если флаг был установлен ранее,
      // пытаемся использовать его (возможно, пользователь залогинился заново)
      // Флаг будет сброшен при успешном обновлении токена

      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.refreshErrorSubject.next(null);

      if (refreshToken) {
        return this.refreshCoordinator.refreshOnce(() => this.authService.refreshToken(refreshToken))
            .pipe(
            switchMap((credentials: UserCredentials) => {
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
              // Сообщаем другим вкладкам, что refresh завершился успешно (после записи в localStorage)
              this.refreshCoordinator.notifyRefreshSucceeded();
              
              // И только после этого сбрасываем флаг isRefreshing
              // Это предотвращает race condition: новые запросы будут ждать через race(),
              // а не пытаться использовать старый токен из localStorage
              this.isRefreshing = false;
              
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
              if (error.status === AuthErrorInterceptor.HTTP_STATUS_PRECONDITION_FAILED || 
                  error.status === AuthErrorInterceptor.HTTP_STATUS_UNAUTHORIZED) {
                // Устанавливаем флаг, чтобы предотвратить повторные попытки обновления токена
                this.isRefreshTokenInvalid = true;
                
                // Показываем понятное сообщение пользователю
                if (error.status === AuthErrorInterceptor.HTTP_STATUS_PRECONDITION_FAILED) {
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
                  this.toasty.err(AuthErrorInterceptor.HTTP_STATUS_PRECONDITION_FAILED, errorMessage);
                } else {
                  // 401 при обновлении токена означает, что refresh token истек или невалиден
                  this.toasty.err(
                    AuthErrorInterceptor.HTTP_STATUS_UNAUTHORIZED,
                    "Время сессии истекло. Пожалуйста, выполните вход."
                  );
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
                // Показываем сообщение о временной ошибке
                this.toasty.err(error.status || 500, "Временная ошибка сервера. Пожалуйста, попробуйте войти заново.");
                
                // Очищаем токены и перенаправляем на login, но НЕ устанавливаем флаг
                // Это позволит при следующем логине попытаться обновить токен снова
                this.storage.resetCredentials();
                this.storage.clear();
                this.redirectToLoginIfNeeded();
                return EMPTY;
              }
              
              // Ошибка 403 при обновлении токена - пробрасываем ошибку, не делаем logout
              // Это позволит оригинальному запросу (например, DELETE) обработать ошибку доступа
              if (error.status === AuthErrorInterceptor.HTTP_STATUS_FORBIDDEN) {
                return throwError(() => error);
              }
              
              // Для других неизвестных ошибок тоже перенаправляем на login
              // но не устанавливаем флаг (на случай, если это временная проблема)
              this.logoutAndRedirect("Ошибка при обновлении сессии. Пожалуйста, выполните вход.");
              return EMPTY;
            })
        );
      }
      
      // Если нет refresh token, перенаправляем на login
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
