import {Injectable, signal} from "@angular/core";
import {SystemNotificationDto} from "@app/dto/SystemNotificationDto";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {finalize} from "rxjs";

/**
 * Единый источник правды для системных оповещений (zoneless/OnPush friendly).
 * Обновляется:
 * - при первичной загрузке (RootPage/Login)
 * - после сохранения в админке (SystemNotificationComponent) — без reload страницы
 */
@Injectable({providedIn: 'root'})
export class SystemNotificationStore {

  readonly allPages = signal<SystemNotificationDto>(this.buildDefault('ALL_PAGES_NOTIFICATION'));
  readonly loginPage = signal<SystemNotificationDto>(this.buildDefault('LOGIN_PAGE_NOTIFICATION'));

  readonly loadingAllPages = signal(false);
  readonly loadingLoginPage = signal(false);

  constructor(private api: SystemNotificationService) {
  }

  refreshAllPages() {
    const req = this.buildDefault('ALL_PAGES_NOTIFICATION');
    this.loadingAllPages.set(true);
    this.api.getNotification(req)
      .pipe(finalize(() => this.loadingAllPages.set(false)))
      .subscribe({
        next: (res) => this.allPages.set(res ?? req),
        error: () => this.allPages.set(req),
      });
  }

  refreshLoginPage() {
    const req = this.buildDefault('LOGIN_PAGE_NOTIFICATION');
    this.loadingLoginPage.set(true);
    this.api.getNotification(req)
      .pipe(finalize(() => this.loadingLoginPage.set(false)))
      .subscribe({
        next: (res) => this.loginPage.set(res ?? req),
        error: () => this.loginPage.set(req),
      });
  }

  /**
   * Применить сохранённое уведомление сразу (например, после save в админке),
   * чтобы оно стало видно без перезагрузки страницы.
   */
  applySaved(saved: SystemNotificationDto) {
    if (!saved?.name) {
      return;
    }
    if (saved.name === 'ALL_PAGES_NOTIFICATION') {
      this.allPages.set(saved);
    }
    if (saved.name === 'LOGIN_PAGE_NOTIFICATION') {
      this.loginPage.set(saved);
    }
  }

  private buildDefault(name: 'ALL_PAGES_NOTIFICATION' | 'LOGIN_PAGE_NOTIFICATION'): SystemNotificationDto {
    const dto = new SystemNotificationDto();
    dto.name = name;
    dto.enabled = false;
    dto.message = "";
    dto.type = "EMPTY_BACKGROUND";
    return dto;
  }
}


