import {Injectable, inject} from '@angular/core';
import {AuthService} from "./auth.service";
import {Role} from "@app/pipes/role.pipe";
import {Router} from "@angular/router";
import {CanActivateFn} from "@angular/router";

@Injectable()
export class DefineRole  {
  private readonly _authService = inject(AuthService);

  /**
   * Функциональный guard: всегда редиректит на целевой маршрут по роли/состоянию авторизации.
   */
  static guard: CanActivateFn = () => {
    const router = inject(Router);
    const defineRole = inject(DefineRole);
    return router.parseUrl(defineRole.defineRedirectUrl());
  };

  defineRedirectUrl(): string {
    // Если access-токен валиден, но роль ещё не выбрана (curr_role отсутствует),
    // нельзя отправлять пользователя на /login — он уже авторизован.
    // В мульти-ролевом сценарии корректный UX: перейти на экран выбора роли.
    if (this._authService.isLoggedIn() && !this._authService.getCurrRole()) {
      return '/select-role';
    }

    const role = this._authService.getCurrRole();
    switch (role) {
      case Role.SUB_CUSTOMER:
      case Role.CUSTOMER:
      case Role.EXPERT:
      case Role.GKNT_CHAIRMAN:
      case Role.GKNT_DEPARTMENT_CHAIRMAN:
      case Role.BUREAU_CHAIRMAN:
      case Role.SECTION_CHAIRMAN:
      case Role.GKNT_WORKER:
        return '/projects';
      case Role.SECTION_ASSESSOR:
        return '/meetings';
      case Role.BUREAU_ASSESSOR:
        return '/meetings';
      case Role.ADMIN:
        return '/users';
      case Role.BELISA_READ:
        return '/projects';
      case Role.BELISA_EDIT:
        return '/projects';
      case Role.BUHGALTER:
        return '/accounting';
      default:
        // Если не авторизован — логин. Если авторизован, но роль неизвестна/пустая — выбор роли.
        return this._authService.isLoggedIn() ? '/select-role' : '/login';
    }
  }
}
