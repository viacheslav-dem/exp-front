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
      this._authService.login(this.user).subscribe(res => {
          this._authService.loginWithCredentials(res);
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
