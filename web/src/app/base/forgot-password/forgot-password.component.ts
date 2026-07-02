import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@app/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /* Обычное поле, а не signal: биндится через [(ngModel)] в template-driven форме,
  которая рассчитана на settable property, а не на вызов signal как функции. */
  login: string = '';

  private readonly _isSubmitting = signal(false);
  readonly isSubmitting = this._isSubmitting.asReadonly();

  private readonly _submitted = signal(false);
  readonly submitted = this._submitted.asReadonly();

  submit(): void {
    const login = this.login?.trim();

    // Защита от двойного сабмита и от пустого логина
    if (this._isSubmitting() || !login) {
      return;
    }
    this._isSubmitting.set(true);

    this.authService.forgotPassword(login).subscribe({
      next: () => {
        /* Бэк намеренно всегда отвечает успехом, независимо от того,
         существует ли такой логин - чтобы форму нельзя было использовать
         для перебора и проверки зарегистрированных логинов. */
        this._submitted.set(true);
      },
      error: (err) => {
        // Ошибка уже обработана в HttpClientSecure.handleError() и показан toast
        console.error('Forgot password error:', err);
        this._isSubmitting.set(false);
      },
      complete: () => {
        this._isSubmitting.set(false);
      }
    });
  }

  backToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
