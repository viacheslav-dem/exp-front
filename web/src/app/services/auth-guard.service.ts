import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * Функциональный guard: разрешает доступ при валидной сессии или после успешного
 * восстановления по refresh-токену; иначе редирект на /login через UrlTree.
 */
export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (state.url !== '/login') {
    authService.defaultRedirectUrl();
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  return authService.restoreSessionIfPossible().pipe(
    map((restored) => (restored ? true : router.parseUrl('/login')))
  );
};
