import {Component, OnInit} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {SystemNotificationDto} from "@app/dto/SystemNotificationDto";
import {SafeHtmlPipe} from "@app/pipes/safe-html-pipe";
import {ProgressService} from "@app/components/common-components/progress/progress.service";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {

  user: any = {};
  systemLoginNotification: SystemNotificationDto;
  showPassword: boolean = false;

  constructor(private _authService: AuthService,
              private notificationService: SystemNotificationService,
              private safeHtmlPipe: SafeHtmlPipe,
              private progressService: ProgressService) {
  }

  ngOnInit() {
      // Убеждаемся, что progress indicator скрыт при загрузке страницы логина
      this.progressService.hide();
      this.getSystemNotificationForLoginPage();
  }

  login() {
      this._authService.login(this.user).subscribe({
          next: (res) => {
              this._authService.loginWithCredentials(res);
          },
          error: (err) => {
              // Ошибка уже обработана в HttpClientSecure.handleError() и показано toast-сообщение
              // Здесь просто предотвращаем попадание ошибки в глобальный обработчик
              console.error('Login error:', err);
          }
      });
  }

  toggleVisibility() {
      this.showPassword = !this.showPassword;
      const inputPass = document.getElementById("input-password") as HTMLInputElement;
      if (inputPass) {
        inputPass.type = this.showPassword ? 'text' : 'password';
      }
  }

  getSystemNotificationForLoginPage() {
      // Инициализируем уведомление с дефолтными значениями
      this.systemLoginNotification = new SystemNotificationDto();
      this.systemLoginNotification.name = "LOGIN_PAGE_NOTIFICATION";
      this.systemLoginNotification.enabled = false; // По умолчанию отключено

      // Загружаем уведомление, но не блокируем форму при ошибках
      this.notificationService.getNotification(this.systemLoginNotification).subscribe({
          next: (response) => {
            this.systemLoginNotification = response;
          },
          error: (err) => {
            // Игнорируем ошибки при загрузке уведомлений, чтобы не блокировать форму логина
            // Уведомление остается с дефолтными значениями (enabled = false)
            console.warn('Failed to load system notification:', err);
          }
      });
  }

  notificationToSafeHtml(notificationMessage: string) {
      return this.safeHtmlPipe.transform(notificationMessage);
  }
}
