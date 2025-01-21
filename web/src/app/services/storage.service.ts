import {Injectable} from "@angular/core";
import {RolePipe} from "@app/pipes/role.pipe";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";

@Injectable()
export class StorageService {

  private accessTokenPlace: string = 'access_token';
  private refreshTokenPlace: string = 'refresh_token';
  private rolesPlace: string = 'roles';
  private currRolePlace: string = 'curr_role';
  private userIdPlace: string = 'user_id';
  private usernamePlace: string = 'username';
  private redirectUrlPlace: string = 'redirectUrl';
  private rolesInfo: string = 'roles_info';

  constructor(private _rolePipe: RolePipe) {
  }

  saveCredentials(accessToken: string, refreshToken: string, roles: string[], userId, username: string, rolesInfo: RoleInfoDto[]) {
    this._rolePipe.sortRoles(roles);
    localStorage.setItem(this.accessTokenPlace, accessToken);
    localStorage.setItem(this.refreshTokenPlace, refreshToken);
    localStorage.setItem(this.rolesPlace, JSON.stringify(roles));
    localStorage.setItem(this.userIdPlace, userId);
    localStorage.setItem(this.usernamePlace, username);
    localStorage.setItem(this.rolesInfo, JSON.stringify(rolesInfo));
  }

  resetCredentials() {
    localStorage.removeItem(this.accessTokenPlace);
    localStorage.removeItem(this.refreshTokenPlace);
    localStorage.removeItem(this.rolesPlace);
    localStorage.removeItem(this.currRolePlace);
    localStorage.removeItem(this.userIdPlace);
    localStorage.removeItem(this.usernamePlace);
    localStorage.removeItem(this.rolesInfo);
  }

  getCurrRole(): string {
    return localStorage.getItem(this.currRolePlace);
  }

  getAccessToken(): string {
    return localStorage.getItem(this.accessTokenPlace);
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem(this.accessTokenPlace, accessToken);
  }

  getRefreshToken(): string {
    return localStorage.getItem(this.refreshTokenPlace);
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem(this.rolesPlace));
  }

  getRolesInfo(): RoleInfoDto[] {
    return JSON.parse(localStorage.getItem(this.rolesInfo));
  }

  getUsername(): string {
    return localStorage.getItem(this.usernamePlace);
  }

  getUserId(): string {
    return localStorage.getItem(this.userIdPlace);
  }

  getRedirectUrl(): string {
    return localStorage.getItem(this.redirectUrlPlace);
  }

  setRedirectUrl(url: string) {
    localStorage.setItem(this.redirectUrlPlace, url);
  }

  changeCurrRole(newRole) {
    localStorage.setItem(this.currRolePlace, newRole);
  }

  clear() {
    sessionStorage.clear();
    localStorage.clear();
  }
}
