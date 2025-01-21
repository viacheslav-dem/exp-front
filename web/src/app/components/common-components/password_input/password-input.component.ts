import {Component, forwardRef, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "app/components/common-components/control-component";
import * as _ from "lodash";
import {PasswordDto} from "@app/dto/PasswordDto";
export const PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordInputComponent),
  multi: true
};

@Component({
  selector: 'app-password-input',
  template: `
    <ng-container *ngIf="value" ngForm appNestableForm>
      <label>Текущий пароль</label>
      <input [(ngModel)]="value.currentPassword" name="currentPassword" class="form-control" type="password" required
             (change)="onChange()" (input)="onInput()"/>
      <label>Новый пароль</label>
      <input [(ngModel)]="value.password" name="password" class="form-control" type="password" required
             [pattern]="pattern" (change)="onChange()" (input)="onInput()" #currentPasswordNgModel="ngModel"/>
      <app-control-error-messages [control]="currentPasswordNgModel.control"></app-control-error-messages>
      <label>Повторите новый пароль</label>
      <input [(ngModel)]="value.passwordConfirmation" name="passwordConfirmation" class="form-control" type="password"
             required [pattern]="pattern" (change)="onChange()" (input)="onInput()"/>
    </ng-container>
  `,
  providers: [PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class PasswordInputComponent extends ControlComponent<PasswordDto> {

  constructor() {
    super();
  }

  @Input()
  changeValueAfterBlur = true;

  @Input()
  pattern: string = "^((?=.*\\d)(?=.*[a-zA-Z]).{6,20})$";

  onInput() {
    if (!this.changeValueAfterBlur) {
      this.onChange();
    }
  }

  onChange() {
    this.value = _.cloneDeep(this.value);
  }

}
