import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { DefineRole } from './define-role';

/**
 * Функциональный guard для страницы логина: если пользователь уже авторизован,
 * возвращает UrlTree для редиректа (выбор роли или главная по роли).
 * Залогиненному не показываем форму входа (UX и безопасность).
 */
export const loginPageGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const defineRole = inject(DefineRole);

  if (authService.isLoggedIn()) {
    return router.parseUrl(defineRole.defineRedirectUrl());
  }
  return true;
};
