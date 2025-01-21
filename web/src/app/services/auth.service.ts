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
    return !!this.storage.getAccessToken();
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

    return this.http.post(`${SERVER_URL}/public/refresh-token`, {
      refreshToken: refreshToken
    });
  }

  navigateByUrl() {
    this.router.navigateByUrl(this.storage.getRedirectUrl());
 //   this.defaultRedirectUrl();
  }

  logout() {
      this.http.post(`${SERVER_URL}/public/logout`, null).subscribe(() => {
     //   this.defaultRedirectUrl();
        this.storage.resetCredentials();
    });
    this.router.navigateByUrl('/login');
  }

  getManual(): Observable<DocumentDto> {
    return this.http.get<DocumentDto>(`${SERVER_URL}/data/manual/document`);
  }

  updateGroupStats(): Observable<any> {
    return this.http.getBlock<UserCredentials>(`${SERVER_URL}/info/groups`)
      .map(credentials => this.updateCredentials(credentials));
  }

  updateCredentials(credentials: UserCredentials) {
    let username = credentials.personName.lastName + ' ' + credentials.personName.firstName + ' ' + credentials.personName.middleName;
    this.storage.saveCredentials(
        credentials.accessToken,
        credentials.refreshToken,
        credentials.roles,
        credentials.id,
        username,
        credentials.rolesInfo
    );
  }

}
