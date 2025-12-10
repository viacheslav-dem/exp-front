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
      color: #babec4;
      position: absolute;
      right: 8%;
      top: 52%;
      cursor: pointer;
    }
    
    #password-icon-crossed{
      display: none;
    }
  `],
    standalone: false
})
export class LoginComponent implements OnInit {

  user: any = {};
  systemLoginNotification: SystemNotificationDto;

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
      const inputPass = document.getElementById("input-password");
      const eyeBtn = document.getElementById("password-icon");
      const eyeBtnСross = document.getElementById("password-icon-crossed");

      inputPass.setAttribute(
         "type",
         inputPass.getAttribute("type") === "password" ? 'text' : 'password'
      );
      eyeBtn.style.display = inputPass.getAttribute("type") === "password" ? 'block' : 'none';
      eyeBtnСross.style.display =inputPass.getAttribute("type") === "password" ? 'none' : 'block';
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
