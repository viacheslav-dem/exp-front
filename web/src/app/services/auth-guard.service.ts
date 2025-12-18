import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AuthGuardService  {

  constructor(
      private router: Router,
      private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Сохраняем URL для редиректа после логина
    if (state.url !== '/login') {
      this.authService.defaultRedirectUrl();
    }
    
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Важный кейс: access-токен мог истечь, но refresh-токен ещё валиден.
    // Если сразу редиректнуть на /login, refresh никогда не произойдёт (интерцептор срабатывает только на 401/403 от API).
    return this.authService.restoreSessionIfPossible().pipe(
      tap((restored) => {
        if (!restored && state.url !== '/login') {
          this.router.navigateByUrl('/login');
        }
      }),
      map((restored) => restored)
    );
  }
}
