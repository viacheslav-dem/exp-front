import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {Role} from "@app/pipes/role.pipe";

@Injectable()
export class DefineRole  {

  constructor(private router: Router,
              private _authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    this.router.navigateByUrl(this.defineRedirectUrl());
    return false;
  }

  defineRedirectUrl(): string {
    let role = this._authService.getCurrRole();
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
        return '/login';
    }
  }
}
