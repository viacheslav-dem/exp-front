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
    this.authService.defaultRedirectUrl();
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
