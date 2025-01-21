import {Component, forwardRef} from '@angular/core';
import {ControlComponent} from "@app/components/common-components/control-component";
import {UserDto} from "@app/dto/UserDto";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const LC_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LoginCreateComponent),
  multi: true
};

@Component({
  selector: 'app-login-create',
  template: `
    <ng-container *ngIf="_value == null">
      <button class="btn btn-primary" (click)="create()">Предоставить доступ</button>
    </ng-container>
    <ng-container *ngIf="_value != null">
      <ng-container *ngIf="_value.id == 0">
        <label>Логин</label>
        <div class="text-sm italic">По умолчанию будет использован первый адрес электронной почты</div>
        <input type="text" id="login" class="form-control" [(ngModel)]="_value.login" placeholder="login">
        <button class="btn btn-danger mt-05" (click)="reset()">Отмена</button>
      </ng-container>
      <ng-container *ngIf="_value.id != 0">
        Логин: <i>{{_value.login}}</i>
      </ng-container>
    </ng-container>
  `,
  providers: [LC_CONTROL_VALUE_ACCESSOR]
})
export class LoginCreateComponent extends ControlComponent<UserDto> {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  create() {
    this.value = new UserDto();
  }

  reset() {
    this.value = null;
  }

}
