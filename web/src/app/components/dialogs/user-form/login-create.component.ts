import {Component, forwardRef, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {UserDto} from "@app/dto/UserDto";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {environment} from "../../../../environments/environment";

export const LC_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LoginCreateComponent),
  multi: true
};

@Component({
    selector: 'app-login-create',
    template: `
    @if (_value == null) {
      <button class="btn btn-primary" (click)="create()">Предоставить доступ</button>
    }
    @if (_value != null) {
      @if (_value.id == 0) {
        <label>Логин</label>
        <div class="text-sm italic">По умолчанию будет использован первый адрес электронной почты</div>
        <input type="text" id="login" class="form-control" [(ngModel)]="_value.login" placeholder="login">
        <button class="btn btn-danger mt-05" (click)="reset()">Отмена</button>
      }
      @if (_value.id != 0) {
        Логин: <i>{{_value.login}}</i>
      }
    }
    `,
    providers: [LC_CONTROL_VALUE_ACCESSOR],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.dialogs)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class LoginCreateComponent extends ControlComponent<UserDto> {

  constructor(private _cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
  }

  create() {
    this.value = new UserDto();
    this._cdr?.markForCheck?.();
  }

  reset() {
    this.value = null;
    this._cdr?.markForCheck?.();
  }

}
