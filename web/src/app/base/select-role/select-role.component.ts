import {Component, OnDestroy, OnInit, viewChild} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectListComponent} from "@app/components/project-list/project-list.component";
import {DataIseful} from "@app/dto/DataIseful";
import {UserEsiful} from "@app/dto/UserEsiful";
import {EsifulService} from "@app/services/esiful.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-select-role',
    templateUrl: 'select-role.component.html',
    styleUrls: ['select-role.component.scss'],
    standalone: false
})
export class SelectRoleComponent implements OnInit, OnDestroy {

  roles: string[] = [];
  currRole: string;
  userEsiful: UserEsiful;
  rolesInfo: RoleInfoDto[] = [];
  mapInfoRole: { [key: string]: RoleInfoDto } = {};
  user: any = {};

  readonly projectListComponent = viewChild(ProjectListComponent);

  // fix: отписка при уничтожении компонента — без неё поздний ответ dataParams()
  // переходит обратно на /select-role (relativeTo ссылается на уже неактуальный route),
  private readonly destroy$ = new Subject<void>();

  constructor(private _storageService: StorageService,
              private _authService: AuthService,
              private esifulService: EsifulService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const dataParam = params['data'];
      if (dataParam) {
        const data = new DataIseful();
        data.dataParam = dataParam;
        data.codeVerifier = this._storageService.getCodeVerifier();
       this.esifulService.dataParams(data).pipe(takeUntil(this.destroy$)).subscribe({
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
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.getRolesInfo();
          const comp = this.projectListComponent();
          if (comp != null) {
            comp.loadPage();
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
