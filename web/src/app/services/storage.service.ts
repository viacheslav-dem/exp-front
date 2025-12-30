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
    const roles = localStorage.getItem(this.rolesPlace);
    return roles ? JSON.parse(roles) : null;
  }

  getRolesInfo(): RoleInfoDto[] {
    const rolesInfo = localStorage.getItem(this.rolesInfo);
    return rolesInfo ? JSON.parse(rolesInfo) : null;
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
    // Очищаем фильтры проектов при смене роли
    localStorage.removeItem('filter_cache_project-list');
  }

  clear() {
    sessionStorage.clear();
    localStorage.clear();
  }

  clearFilterCaches() {
    // Очищаем все кэши фильтров
    const filterCacheKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('filter_cache_')) {
        filterCacheKeys.push(key);
      }
    }
    filterCacheKeys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Проверяет, что access-токен существует и ещё не истёк (с запасом leewaySeconds).
   * Это предотвращает "залипание" протухшего токена в UI.
   */
  isAccessTokenValidNow(leewaySeconds: number = 30): boolean {
    const jwt = this.getRawJwtFromAuthorizationHeader(this.getAccessToken());
    if (!jwt) return false;

    const payload = this.decodeJwtPayload(jwt);
    const exp = payload?.exp; // стандартно exp в секундах
    if (typeof exp !== 'number') return false;

    const nowSeconds = Math.floor(Date.now() / 1000);
    return exp > (nowSeconds + leewaySeconds);
  }

  private getRawJwtFromAuthorizationHeader(value: string | null): string | null {
    if (!value) return null;
    // У вас access хранится как "Bearer <jwt>"
    return value.startsWith('Bearer ') ? value.substring(7) : value;
  }

  private decodeJwtPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }
}
