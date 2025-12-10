import {Component, EventEmitter, OnInit, Output, input} from '@angular/core';
import {PasswordDto} from "@app/dto/PasswordDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {StorageService} from "@app/services/storage.service";
import {AuthService} from "@app/services/auth.service";

@Component({
    selector: 'app-change-password',
    template: `
    <div ngForm appNestableForm>
      <app-password-input passwordInputValidator #passwordInputComponentNgModel="ngModel"
                          [changeValueAfterBlur]="passwordInputComponentNgModel.control.valid"
                          [(ngModel)]="password" name="pwd"></app-password-input>
      <app-control-error-messages [control]="passwordInputComponentNgModel.control"></app-control-error-messages>
      <div class="mt-3">
        <button class="btn btn-primary" (click)="changePassword()" type="submit">Сменить пароль</button>
        <button class="btn btn-danger float-right" (click)="cancel()" type="reset">Отмена</button>
      </div>
    </div>
  `,
    styles: [],
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
