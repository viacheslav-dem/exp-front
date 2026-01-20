import {map} from 'rxjs/operators';
import {Injectable, OnInit} from "@angular/core";
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {Router} from "@angular/router";
import {StorageService} from "./storage.service";
import {Observable, Observer, of, defer} from "rxjs";
import {UserCredentials} from "@app/dto/UserCredentials";
import {PasswordDto} from "@app/dto/PasswordDto";
import {UserDto} from "@app/dto/UserDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonService} from "@app/services/person.service";
import {DocumentDto} from "@app/dto/DocumentDto";
import {TokenDto} from "@app/dto/TokenDto";
import {catchError, finalize, map as rxMap, shareReplay} from "rxjs/operators";
import {TokenRefreshCoordinatorService} from "@app/services/token-refresh-coordinator.service";

@Injectable()
export class AuthService implements OnInit {

  private restoreSessionInFlight$?: Observable<boolean>;

  constructor(private http: HttpClientSecure,
              private storage: StorageService,
              private router: Router,
              private toasty: GlobalToastyService,
              private dialogService: DialogService,
              private personService: PersonService,
              private refreshCoordinator: TokenRefreshCoordinatorService) {
    this.defaultRedirectUrl();
  }

  ngOnInit(): void {
  }

  defaultRedirectUrl() {
    this.storage.setRedirectUrl('/');
  }

  isLoggedIn(): boolean {
    // Проверяем не только наличие токена, но и что он ещё не истёк (от "залипания" протухшего access)
    return this.storage.isAccessTokenValidNow();
  }

  /**
   * Пытается восстановить сессию при протухшем access-токене, используя refresh-токен из localStorage.
   *
   * Зачем: иначе AuthGuard может сразу увести на /login и refresh никогда не произойдёт.
   * Риск: минимальный — это ровно тот же refresh endpoint, который уже используется в interceptor'е.
   * Поведение обратимо: при неуспехе ничего не "ломаем", просто возвращаем false.
   */
  restoreSessionIfPossible(): Observable<boolean> {
    // Если access ещё валиден — ничего делать не надо.
    if (this.storage.isAccessTokenValidNow()) {
      return of(true);
    }

    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      return of(false);
    }

    // Дедупликация: если несколько гардов/инициализаций одновременно попытаются восстановить сессию,
    // делаем один запрос на refresh и шарим результат.
    if (this.restoreSessionInFlight$) {
      return this.restoreSessionInFlight$;
    }

    this.restoreSessionInFlight$ = defer(() =>
      // ВАЖНО: используем тот же межвкладочный координатор, что и interceptor.
      // Иначе возможно два параллельных refresh-а: один из guard (здесь) и один из interceptor на первых 401.
      this.refreshCoordinator.refreshOnce(() => this.refreshToken(refreshToken)).pipe(
        rxMap((credentials: UserCredentials) => {
          // На всякий случай: если сервер вернул некорректный ответ, считаем восстановление неуспешным
          if (!credentials?.accessToken) return false;
          this.updateCredentials(credentials);
          // ВАЖНО: если лидером стал guard (а не interceptor), без этого уведомления
          // ожидающие ветки внутри той же вкладки/в других вкладках могут дождаться только таймаута.
          // Также это освобождает lock (releaseLock внутри notifyRefreshSucceeded).
          this.refreshCoordinator.notifyRefreshSucceeded();
          return true;
        }),
        catchError(() => of(false)),
        finalize(() => {
          this.restoreSessionInFlight$ = undefined;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      )
    );

    return this.restoreSessionInFlight$;
  }

  inRole(roles: string[] | string): boolean {
    if (typeof roles === "string") {
      return this.getCurrRole() == roles;
    } else
      return roles.indexOf(this.getCurrRole()) >= 0;
  }

  getToken() {
    return this.storage.getAccessToken();
  }

  getCurrRole(): any {
    return this.storage.getCurrRole();
  }

  changePassword(personId: number, pass: PasswordDto) {
    return this.http.postBlock<UserDto>(`${SERVER_URL}/users/${personId}/changePassword`, pass);
  }

  resetPassword(personId: number) {
    return this.http.postBlock<UserDto>(`${SERVER_URL}/users/${personId}/resetPassword`, null);
  }

  blockUser(personId: number) {
    return this.http.postBlock<UserDto>(`${SERVER_URL}/users/${personId}/block`, null).pipe(map(res => {
      this.personService.onPersonListChanged.next(res);
      return res;
    }));
  }

  unblockUser(personId: number) {
    return this.http.postBlock<UserDto>(`${SERVER_URL}/users/${personId}/unblock`, null).pipe(map(res => {
      this.personService.onPersonListChanged.next(res);
      return res;
    }));
  }

  login(user): Observable<UserCredentials> {
    return this.http.postBlock<UserCredentials>(`${SERVER_URL}/public/login`, user);
  }

  loginWithCredentials(credentials: UserCredentials) {
    let roles = credentials.roles;
    this.updateCredentials(credentials);

    if (credentials.passwordExpired) {
      this.toasty.warn('Истёк срок действия пароля.');
      this.dialogService.showChangePasswordDialog(credentials.id).subscribe();
    } else if (roles.length >= 0) {
      this.router.navigateByUrl('select-role');
    } else {
      this.storage.changeCurrRole(roles[0]);
      this.navigateByUrl();
    }
  }

  refreshToken(refreshToken: string): Observable<UserCredentials> {
    // Используем post напрямую, без postBlock, чтобы избежать показа progress indicator
    // и чтобы ошибки обрабатывались в interceptor'е, а не в HttpClientSecure.handleError
    return this.http.post(`${SERVER_URL}/public/refresh-token`, {
      refreshToken: refreshToken
    });
  }

  navigateByUrl() {
    this.router.navigateByUrl(this.storage.getRedirectUrl());
 //   this.defaultRedirectUrl();
  }

  logout() {
    // Получаем refreshToken ДО очистки, чтобы сервер мог удалить только текущую сессию
    const refreshToken = this.storage.getRefreshToken();
    // Очищаем токены сразу, чтобы предотвратить дальнейшие запросы с устаревшими токенами
    this.storage.resetCredentials();
    // Очищаем все кэши фильтров при выходе из системы
    this.storage.clearFilterCaches();
    // Отправляем refreshToken на сервер для удаления только этой сессии (мультисессии)
    this.http.post(`${SERVER_URL}/public/logout`, { refreshToken }).subscribe({
      next: () => {
        // Успешный logout на сервере
      },
      error: () => {
        // Даже если запрос не удался, токены уже очищены локально
      }
    });
    this.router.navigateByUrl('/login');
  }

  getManual(): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${SERVER_URL}/data/manual/document`);
  }

  updateGroupStats(): Observable<any> {
    return this.http.getBlock<UserCredentials>(`${SERVER_URL}/info/groups`).pipe(
      map(credentials => {
        this.updateCredentials(credentials);
        return credentials;
      })
    );
  }

  updateCredentials(credentials: UserCredentials) {
    // Делаем метод адаптированным к "частичным" credentials (например, когда другая вкладка обновила токены,
    // а эта вкладка только подхватила новый access/refresh из localStorage).
    const personName: any = (credentials as any)?.personName;
    const usernameFromResponse =
      personName?.lastName && personName?.firstName && personName?.middleName
        ? `${personName.lastName} ${personName.firstName} ${personName.middleName}`
        : null;

    const username = usernameFromResponse ?? this.storage.getUsername() ?? '';

    // Если refreshToken не пришёл (null/undefined) — сохраняем существующий
    // (для /info/groups который теперь не выдаёт refresh и для межвкладочного refresh).
    const refreshToken = (credentials as any)?.refreshToken ?? this.storage.getRefreshToken();
    const roles = (credentials as any)?.roles ?? this.storage.getRoles();
    const rolesInfo = (credentials as any)?.rolesInfo ?? this.storage.getRolesInfo();
    const id = (credentials as any)?.id ?? this.storage.getUserId();
    this.storage.saveCredentials(
        credentials.accessToken,
        refreshToken,
        roles,
        id,
        username,
        rolesInfo
    );
  }

}
