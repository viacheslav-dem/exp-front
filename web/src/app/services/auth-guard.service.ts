import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import {AuthService} from "./auth.service";

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
    
    // Перенаправляем на login только если мы еще не на странице логина
    // чтобы избежать бесконечных редиректов
    if (state.url !== '/login') {
      this.router.navigateByUrl('/login');
    }
    return false;
  }
}
