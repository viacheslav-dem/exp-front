import {Component, EventEmitter, OnInit, Output, input} from '@angular/core';
import {PasswordDto} from "@app/dto/PasswordDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {StorageService} from "@app/services/storage.service";
import {AuthService} from "@app/services/auth.service";

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
    standalone: false
})
export class ChangePasswordComponent implements OnInit {

  password: PasswordDto = new PasswordDto();

  readonly userId = input<number>(undefined);

  constructor(private _authService: AuthService,
              private _storage: StorageService,
              private toasty: GlobalToastyService,) {
  }

  ngOnInit() {
  }

  @Output() onSave = new EventEmitter<number>();
  @Output() canceled = new EventEmitter();

  changePassword() {
    this._authService.changePassword(this.userId(), this.password).subscribe(() => {
      this.toasty.success('Пароль успешно изменён.');
      this.password = new PasswordDto();
      this.onSave.next(this.userId());
    });
  }

  cancel() {
    this.password = new PasswordDto();
    this.canceled.next(this.userId());
  }
}
