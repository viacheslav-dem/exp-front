import {map} from 'rxjs/operators';
import {Injectable, OnInit} from "@angular/core";
import {HttpClientSecure} from "./http.client";
import {SERVER_URL} from "../config";
import {Router} from "@angular/router";
import {StorageService} from "./storage.service";
import {Observable, Observer} from "rxjs";
import {UserCredentials} from "@app/dto/UserCredentials";
import {PasswordDto} from "@app/dto/PasswordDto";
import {UserDto} from "@app/dto/UserDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonService} from "@app/services/person.service";
import {DocumentDto} from "@app/dto/DocumentDto";
import {TokenDto} from "@app/dto/TokenDto";

@Injectable()
export class AuthService implements OnInit {

  constructor(private http: HttpClientSecure,
              private storage: StorageService,
              private router: Router,
              private toasty: GlobalToastyService,
              private dialogService: DialogService,
              private personService: PersonService) {
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
    let username = credentials.personName.lastName + ' ' + credentials.personName.firstName + ' ' + credentials.personName.middleName;
    // Если refreshToken не пришёл (null) — сохраняем существующий (для /info/groups который теперь не выдаёт refresh)
    const refreshToken = credentials.refreshToken ?? this.storage.getRefreshToken();
    this.storage.saveCredentials(
        credentials.accessToken,
        refreshToken,
        credentials.roles,
        credentials.id,
        username,
        credentials.rolesInfo
    );
  }

}
