import {Component, OnInit, viewChild} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectListComponent} from "@app/components/project-list/project-list.component";
import {DataIseful} from "@app/dto/DataIseful";
import {UserEsiful} from "@app/dto/UserEsiful";
import {EsifulService} from "@app/services/esiful.service";

@Component({
    selector: 'app-select-role',
    templateUrl: 'select-role.component.html',
    styleUrls: ['select-role.component.scss'],
    standalone: false
})
export class SelectRoleComponent implements OnInit {

  roles: string[] = [];
  currRole: string;
  userEsiful: UserEsiful;
  rolesInfo: RoleInfoDto[] = [];
  mapInfoRole: { [key: string]: RoleInfoDto } = {};
  user: any = {};

  readonly projectListComponent = viewChild(ProjectListComponent);

  constructor(private _storageService: StorageService,
              private _authService: AuthService,
              private esifulService: EsifulService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const dataParam = params['data'];
      if (dataParam) {
        const data = new DataIseful();
        data.dataParam = dataParam;
        data.codeVerifier = this._storageService.getCodeVerifier();
       this.esifulService.dataParams(data).subscribe({
          next: (response: UserEsiful) => {
              console.log(response);
              // fix: убираем ?data= из URL, чтобы F5 не повторял callback
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {},
                replaceUrl: true
              });
          },
          error: (err) => {
            console.error('Ошибка при обработке callback', err);
          }
        });
      }
        this.roles = this._storageService.getRoles();
        this.currRole = this._storageService.getCurrRole();
        this.route.params.subscribe(() => {
          this.getRolesInfo();
          const comp = this.projectListComponent();
          if (comp != null) {
            comp.loadPage();
          }
        });
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
