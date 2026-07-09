import {Component, OnInit, input, ChangeDetectionStrategy, ChangeDetectorRef, output} from '@angular/core';
import {PasswordDto} from "@app/dto/PasswordDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {StorageService} from "@app/services/storage.service";
import {AuthService} from "@app/services/auth.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-change-password',
    template: `
    <div ngForm appNestableForm class="change-password-form">
      <div class="mb-4">
        <app-password-input passwordInputValidator #passwordInputComponentNgModel="ngModel"
                            [changeValueAfterBlur]="passwordInputComponentNgModel.control.valid"
                            [(ngModel)]="password" name="pwd"></app-password-input>
        <app-control-error-messages [control]="passwordInputComponentNgModel.control"></app-control-error-messages>
      </div>
      <div class="d-flex gap-2 justify-content-end pt-3 border-top">
        <button class="btn btn-outline-secondary rounded-pill px-4" (click)="cancel()" type="reset">
          <i class="fas fa-times me-2"></i>Отмена
        </button>
        <button class="btn btn-primary rounded-pill px-4" (click)="changePassword()" type="submit">
          <i class="fas fa-key me-2"></i>Сменить пароль
        </button>
      </div>
    </div>
  `,
    styles: [`
      .change-password-form {
        padding: 0.5rem;
      }
    `],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class ChangePasswordComponent implements OnInit {

  password: PasswordDto = new PasswordDto();

  readonly userId = input<number>(undefined);

  constructor(private _authService: AuthService,
              private _storage: StorageService,
              private toasty: GlobalToastyService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  readonly onSave = output<number>();
  readonly canceled = output<number>();

  changePassword() {
    this._authService.changePassword(this.userId(), this.password).subscribe(() => {
      this.toasty.success('Пароль успешно изменён.');
      this.password = new PasswordDto();
      this.onSave.emit(this.userId());
      this.cdr?.markForCheck?.();
    });
  }

  cancel() {
    this.password = new PasswordDto();
    this.canceled.emit(this.userId());
    // markForCheck не нужен: синхронный вызов из (click) автоматически триггерит change detection,
    // а signal output автоматически обновляет родительский компонент
  }
}
