import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";
import {ActivatedRoute} from "@angular/router";
import {ProjectListComponent} from "@app/components/project-list/project-list.component";

@Component({
  selector: 'app-select-role',
  templateUrl: 'select-role.component.html',
  styles: [`
      .col-2.badge.badge-info.badge-pill {
          margin-right: 0px;
          max-height: 20px;
      }
  `]
})
export class SelectRoleComponent implements OnInit {

  roles: string[] = [];
  currRole: string;
  rolesInfo: RoleInfoDto[] = [];
  mapInfoRole: [] = [];
  user: any = {};

  @ViewChild(ProjectListComponent) projectListComponent: ProjectListComponent;

  constructor(private _storageService: StorageService,
              private _authService: AuthService,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.roles = this._storageService.getRoles();
    this.currRole = this._storageService.getCurrRole();
    this.route.params.subscribe(() => {
      this.getRolesInfo();
      if (this.projectListComponent != null) {
        this.projectListComponent.loadPage();
      }
    });
  }

  enterHow(currRole: string) {
    this._storageService.changeCurrRole(currRole);
  //  this._authService.defaultRedirectUrl();
    this._authService.navigateByUrl();
  }

  getRolesInfo() {
    this.rolesInfo = this._storageService.getRolesInfo();
    this.rolesInfo.forEach(item => this.mapInfoRole[item.role] = item);
  }

  cancel() {
    this._authService.navigateByUrl();
  }

  exit() {
    this._authService.logout();
  }
}
