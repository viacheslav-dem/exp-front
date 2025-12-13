import {Component, OnInit} from '@angular/core';
import {AuthService} from "@app/services/auth.service";
import {SystemNotificationService} from "@app/services/system-notification.service";
import {SystemNotificationDto} from "@app/dto/SystemNotificationDto";
import {SafeHtmlPipe} from "@app/pipes/safe-html-pipe";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styles: [`
    .title {
      text-transform: uppercase;
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
    }

    .password-icon {
      color: #6c757d;
      font-size: 1.1rem;
      transition: color 0.3s ease;
    }
    
    .btn-link:hover .password-icon,
    .btn-link:focus .password-icon {
      color: #0d6efd;
    }
    
    // Улучшенные стили для формы логина
    .card-login {
      max-width: 420px;
      width: 100%;
    }
    
    .form-control {
      transition: all 0.3s ease;
      
      &:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
      }
    }
    
    .form-label {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
  `],
    standalone: false
})
export class LoginComponent implements OnInit {

  user: any = {};
  systemLoginNotification: SystemNotificationDto;
  showPassword: boolean = false;

  constructor(private _authService: AuthService,
              private notificationService: SystemNotificationService,
              private safeHtmlPipe: SafeHtmlPipe) {
  }

  ngOnInit() {
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

      this.systemLoginNotification = new SystemNotificationDto();
      this.systemLoginNotification.name = "LOGIN_PAGE_NOTIFICATION";

      this.notificationService.getNotification(this.systemLoginNotification).subscribe(
          (response) => {
            this.systemLoginNotification = response;
          });
  }

  notificationToSafeHtml(notificationMessage: string) {
      return this.safeHtmlPipe.transform(notificationMessage);
  }
}
