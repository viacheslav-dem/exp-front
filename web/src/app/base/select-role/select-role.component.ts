import {Component, OnInit, viewChild} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {StorageService} from "@app/services/storage.service";
import {RoleInfoDto} from "@app/dto/RoleInfoDto";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectListComponent} from "@app/components/project-list/project-list.component";

@Component({
    selector: 'app-select-role',
    templateUrl: 'select-role.component.html',
    styleUrls: ['select-role.component.scss'],
    standalone: false
})
export class SelectRoleComponent implements OnInit {

  roles: string[] = [];
  currRole: string;
  rolesInfo: RoleInfoDto[] = [];
  mapInfoRole: { [key: string]: RoleInfoDto } = {};
  user: any = {};

  readonly projectListComponent = viewChild(ProjectListComponent);

  constructor(private _storageService: StorageService,
              private _authService: AuthService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    // Получаем параметр "data" из query-строки
    this.route.queryParams.subscribe(params => {
      const dataParam = params['data'];
      console.log(dataParam);
      if (dataParam) {
        // Отправляем GET-запрос на бэкенд с этим параметром
       this._authService.dataParams(dataParam).subscribe({
          next: (response: any) => {
            // Здесь обрабатываем ответ от бэкенда (сохраняем токены, перенаправляем в приложение)
            console.log('Успешный вход', response);
            // Например, сохраняем токены и редиректим на главную
            localStorage.setItem('access_token', response.access_token);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Ошибка при обработке callback', err);
            // Перенаправляем на страницу ошибки или показываем сообщение
          }
        });
      } else {
        // Нет параметра data — что-то пошло не так
        console.error('Отсутствует параметр data');
        this.router.navigate(['/error']);
      }
    });

    this.roles = this._storageService.getRoles();
    this.currRole = this._storageService.getCurrRole();
    this.route.params.subscribe(() => {
      this.getRolesInfo();
      const comp = this.projectListComponent();
      if (comp != null) {
        comp.loadPage();
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
