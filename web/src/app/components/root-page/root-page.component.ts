import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, OnInit} from "@angular/core";
import {AuthService} from "@app/services/auth.service";
import {Role} from "@app/pipes/role.pipe";
import {SystemNotificationDto} from "@app/dto/SystemNotificationDto";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {SafeHtmlPipe} from "@app/pipes/safe-html-pipe";
import {AuditService} from "@app/services/audit.service";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {SystemNotificationStore} from "@app/services/system-notification.store";

@Component({
    selector: 'app-root-page',
    templateUrl: 'root-page.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.coreShell) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class RootPageComponent implements OnInit {

  public menu: any[];
  systemNotificationForAllPages: SystemNotificationDto = new SystemNotificationDto();
  programVersion = "";

  constructor(private _authService: AuthService,
              private notificationService: SystemNotificationService,
              private safeHtmlPipe: SafeHtmlPipe,
              private auditService: AuditService,
              private router: Router,
              private notificationStore: SystemNotificationStore,
              private cdr: ChangeDetectorRef) {

    // Без перезагрузки страницы: обновляем баннер, когда store меняется (zoneless/OnPush friendly).
    effect(() => {
      this.systemNotificationForAllPages = this.notificationStore.allPages();
      this.cdr?.markForCheck?.();
    });
  }

  ngOnInit(): void {
    this.updateMenu();
    this.getSystemNotificationForAllPages();
    this.updateProgramVersion();
  }

  updateMenu() {
    let role = this._authService.getCurrRole();
    let catalogMenu = [
      {link: '/data-management/councils', title: 'ГЭС'},
      {link: '/data-management/orgs', title: 'Организации'},
      {link: '/data-management/gknt-department', title: 'Подразделения ГКНТ'},
      {link: '/data-management/project-codes', title: 'Коды объектов экспертизы'},
      {link: '/data-management/industries', title: 'Виды деятельности'},
      {link: '/data-management/areas', title: 'Области компетенции'},
      {link: '/data-management/currencies', title: 'Валюты'},
      {link: '/data-management/directions', title: 'Приоритетные направления'},
      {link: '/data-management/templates', title: 'Шаблоны'},
      {link: '/data-management/mail-template', title: 'Почтовая рассылка'},
      {link: '/data-management/science', title: 'Отрасли наук'},
      {link: '/data-management/funding', title: 'Источники финансирования'},
      {link: '/data-management/speciality', title: 'Специальности'},
      {link: '/data-management/specialization', title: 'Специализации'},
      {link: '/data-management/industrial-property', title: 'Объекты промышленной собственности'},
      {link: '/data-management/tariff', title: 'Тарифы'},
      {link: '/data-management/meth-rec', title: 'Методические рекомендации'},
      {link: '/data-management/commercialization-methods', title: 'Способы коммерциализации'}
    ];
    let statsMenu = [
      {link: '/index', title: 'Сводная информация'},
      {link: '/stats', title: 'Общая статистика'},
      {link: '/council-stats', title: 'Статистика по ГЭС'},
      {link: '/result-fun', title: 'Результаты функционирования'},
      {link: '/best-expert', title: 'Эксперт года'},
    ];
    let notificationMenu = [
      {link: '/notification', title: 'Уведомление на почту'},
      {link: '/system-notification', title: 'Системное оповещение'}
    ];

    switch (role) {
      case Role.BUREAU_ASSESSOR:
      case Role.SECTION_ASSESSOR:
        this.menu = [
          {link: '/meetings', title: 'Заседания'}
        ];
        break;
      case Role.BUREAU_CHAIRMAN:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '/meetings', title: 'Заседания'},
          {link: '/experts', title: 'Эксперты'},
          {link: '/council-stats', title: 'Статистика по ГЭС'},
        ];
        break;
      case Role.SECTION_CHAIRMAN:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '/meetings', title: 'Заседания'},
          {link: '/experts', title: 'Эксперты'},
        ];
        break;
      case Role.GKNT_WORKER:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '', title: 'Статистика', children: statsMenu},
        ];
        break;
      case Role.EXPERT:
      case Role.SUB_CUSTOMER:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
        ];
        break;
      case Role.CUSTOMER:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '/sub-org', title: 'Подчиненные организации'}
        ];
        break;
      case Role.BELISA_READ:
      case Role.BELISA_EDIT:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '/users', title: 'Пользователи'},
          {link: '/experts', title: 'Эксперты'},
          {link: '', title: 'Данные', children: catalogMenu},
          // {link: '/settings', title: 'Настройки'},
          {link: '', title: 'Статистика', children: statsMenu},
        ];
        break;
      case Role.ADMIN:
        catalogMenu.push({link: '/data-management/manual', title: 'Руководства пользователя'});
        this.menu = [
          {link: '/users', title: 'Пользователи'},
          {link: '/experts', title: 'Эксперты'},
          {link: '', title: 'Данные', children: catalogMenu},
          {
            link: '', title: 'Аудит', children: [
              {link: '/audit', title: 'Журнал аудита'},
              {link: '/sessions', title: 'Активные подключения'},
            ]
          },
          {link: '/settings', title: 'Настройки'},
          {link: '', title: 'Статистика', children: statsMenu},
          {link: '', title: 'Уведомление', children: notificationMenu },
        ];
        break;
      case Role.BUHGALTER:
        this.menu = [
          {link: '/accounting', title: 'Бухгалтерский учёт'},
        ];
        break;
      case Role.GKNT_CHAIRMAN:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '/confirm-reports', title: 'Согласование экспертов'},
          {link: '/experts', title: 'Эксперты'},
          {link: '', title: 'Статистика', children: statsMenu},
        ];
        break;
      case Role.GKNT_DEPARTMENT_CHAIRMAN:
        this.menu = [
          {link: '/projects', title: 'Объекты экспертизы'},
          {link: '/experts', title: 'Эксперты'},
          {link: '', title: 'Статистика', children: statsMenu},
        ];
        break;
    }
  }

  getSystemNotificationForAllPages() {
      // Держим метод для обратимой миграции: фактически загружаем через store.
      this.notificationStore.refreshAllPages();
  }

  notificationToSafeHtml(notificationMessage: string) {
      return this.safeHtmlPipe.transform(notificationMessage);
  }

  updateProgramVersion() {
      let role = this._authService.getCurrRole();
      if (role == Role.ADMIN) {
          this.auditService.getProjectVersion().subscribe(res => {
              this.programVersion = "Версия: " + res.version;
              this.cdr?.markForCheck?.();
          });
      }
  }

}
