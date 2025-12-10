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
             [pattern]="pattern" (change)="onChange()" (input)="onInputNumber2()" #currentPasswordNgModel="ngModel"/>
      <app-control-error-messages [control]="currentPasswordNgModel.control"></app-control-error-messages>
      <div>
        <div class="row p-l-3 m-0">
          <div class="col p-0 m-0">
            <hr *ngIf="colors.get('GREY1')" style="border: 4px solid #a0a0a0">
            <hr *ngIf="colors.get('RED1')" style="border: 4px solid #dc143c">
            <hr *ngIf="colors.get('YELLOW1')" style="border: 4px solid #ffd700">
            <hr *ngIf="colors.get('BLUE1')" style="border: 4px solid #1e90ff">
            <hr *ngIf="colors.get('GREEN1')" style="border: 4px solid #008000">
          </div>
          <div class="col p-0 m-0">
            <hr *ngIf="colors.get('GREY2')" style="border: 4px solid #a0a0a0">
            <hr *ngIf="colors.get('YELLOW2')" style="border: 4px solid #ffd700">
            <hr *ngIf="colors.get('BLUE2')" style="border: 4px solid #1e90ff">
            <hr *ngIf="colors.get('GREEN2')" style="border: 4px solid #008000">
          </div>
          <div class="col p-0 m-0">
            <hr *ngIf="colors.get('GREY3')" style="border: 4px solid #a0a0a0">
            <hr *ngIf="colors.get('BLUE3')" style="border: 4px solid #1e90ff">
            <hr *ngIf="colors.get('GREEN3')" style="border: 4px solid #008000">
          </div>
          <div class="col p-0 m-0">
            <hr *ngIf="colors.get('GREY4')" style="border: 4px solid #a0a0a0">
            <hr *ngIf="colors.get('GREEN4')" style="border: 4px solid #008000">
          </div>
        </div>
      </div>
      <div class="p-3">
        <div class="row">
          <div class="col">
            <button *ngIf=!number type="button" class="btn btn-danger rounded-circle" style="padding: 0.10em 1em;" >цифры</button>
            <button *ngIf=number type="button" class="btn btn-success rounded-circle" style="padding: 0.15em 1em;">цифры</button>
          </div>
          <div class="col">
            <button *ngIf=!uppercase type="button" class="btn btn-danger rounded-circle" style="padding: 0.10em 1em;">заглавные</button>
            <button *ngIf=uppercase type="button" class="btn btn-success rounded-circle" style="padding: 0.10em 1em;">заглавные</button>
          </div>
          <div class="col">
            <button *ngIf=!lowercase type="button" class="btn btn-danger rounded-circle" style="padding: 0.10em 1em;">строчные</button>
            <button *ngIf=lowercase type="button" class="btn btn-success rounded-circle" style="padding: 0.10em 1em;">строчные</button>
          </div>
          <div class="col">
            <button *ngIf=!eightPlus type="button" class="btn btn-danger rounded-circle" style="padding: 0.10em 1em;">8+ символов</button>
            <button *ngIf=eightPlus type="button" class="btn btn-success rounded-circle" style="padding: 0.10em 1em;">8+ символов</button>
          </div>
        </div>
      </div>
      <label>Повторите новый пароль</label>
      <input [(ngModel)]="value.passwordConfirmation" name="passwordConfirmation" class="form-control" type="password"
             required [pattern]="pattern" (change)="onChange()" (input)="onInput()"/>
    </ng-container>
  `,
    providers: [PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR],
    standalone: false
})
export class PasswordInputComponent extends ControlComponent<PasswordDto> {

  public colors: Map<string, boolean> = new Map();
  public number: boolean = false;
  public uppercase: boolean = false;
  public lowercase: boolean = false;
  public eightPlus: boolean = false;

  constructor() {
    super();
    this.colors.set('GREY1', true);
    this.colors.set('RED1', false);
    this.colors.set('YELLOW1', false);
    this.colors.set('BLUE1', false);
    this.colors.set('GREEN1', false);

    this.colors.set('GREY2', true);
    this.colors.set('YELLOW2', false);
    this.colors.set('BLUE2', false);
    this.colors.set('GREEN2', false);

    this.colors.set('GREY3', true);
    this.colors.set('BLUE3', false);
    this.colors.set('GREEN3', false);

    this.colors.set('GREY4', true);
    this.colors.set('GREEN4', false);
  }

  @Input()
  changeValueAfterBlur = true;

  @Input()
  pattern: string = "^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$";

  onInput() {
    if (!this.changeValueAfterBlur) {
      this.onChange();
    }
  }

  onInputNumber2() {
    this.buttonStatus();
    this.zeroLineLevel();
    this.firstLineLevel();
    this.secondLineLevel();
    this.thirdLineLevel();
    this.fourthLineLevel();
    if (!this.changeValueAfterBlur) {
      this.onChange();
    }
  }

  onChange() {
    this.value = _.cloneDeep(this.value);
  }

  private zeroLineLevel() {
    if(this.value.password == ''){
      this.colors.set('GREY1', true);
      this.colors.set('RED1', false);
      this.colors.set('YELLOW1', false);
      this.colors.set('BLUE1', false);
      this.colors.set('GREEN1', false);

      this.colors.set('GREY2', true);
      this.colors.set('YELLOW2', false);
      this.colors.set('BLUE2', false);
      this.colors.set('GREEN2', false);

      this.colors.set('GREY3', true);
      this.colors.set('BLUE3', false);
      this.colors.set('GREEN3', false);

      this.colors.set('GREY4', true);
      this.colors.set('GREEN4', false);
    }
  }



  private firstLineLevel() {
    if(this.value.password.match(/[a-z]/) || this.value.password.match(/[A-Z]/)
        || this.value.password.match(/[0-9]/) || this.value.password.length >= 8){
      this.colors.set('GREY1', false);
      this.colors.set('RED1', true);
      this.colors.set('YELLOW1', false);
      this.colors.set('BLUE1', false);
      this.colors.set('GREEN1', false);

      this.colors.set('GREY2', true);
      this.colors.set('YELLOW2', false);
      this.colors.set('BLUE2', false);
      this.colors.set('GREEN2', false);

      this.colors.set('GREY3', true);
      this.colors.set('BLUE3', false);
      this.colors.set('GREEN3', false);

      this.colors.set('GREY4', true);
      this.colors.set('GREEN4', false);
    }
  }

  private secondLineLevel() {
    if((this.value.password.match(/[a-z]/) && this.value.password.match(/[A-Z]/))
        || (this.value.password.match(/[a-z]/) && this.value.password.match(/[0-9]/))
        || (this.value.password.match(/[a-z]/) && this.value.password.length >= 8)
        || (this.value.password.match(/[A-Z]/) && this.value.password.match(/[0-9]/))
        || (this.value.password.match(/[A-Z]/) && this.value.password.length >= 8)
        || (this.value.password.match(/[0-9]/) && this.value.password.length >= 8)){
      this.colors.set('GREY1', false);
      this.colors.set('RED1', false);
      this.colors.set('YELLOW1', true);
      this.colors.set('BLUE1', false);
      this.colors.set('GREEN1', false);

      this.colors.set('GREY2', false);
      this.colors.set('YELLOW2', true);
      this.colors.set('BLUE2', false);
      this.colors.set('GREEN2', false);

      this.colors.set('GREY3', true);
      this.colors.set('BLUE3', false);
      this.colors.set('GREEN3', false);

      this.colors.set('GREY4', true);
      this.colors.set('GREEN4', false);
    }
  }

  private thirdLineLevel() {
    if((this.value.password.match(/[a-z]/) && this.value.password.match(/[A-Z]/) && this.value.password.match(/[0-9]/))
        || (this.value.password.match(/[a-z]/) && this.value.password.match(/[0-9]/) && this.value.password.length >= 8)
        || (this.value.password.match(/[A-Z]/) && this.value.password.match(/[0-9]/) && this.value.password.length >= 8)){
      this.colors.set('GREY1', false);
      this.colors.set('RED1', false);
      this.colors.set('YELLOW1', false);
      this.colors.set('BLUE1', true);
      this.colors.set('GREEN1', false);

      this.colors.set('GREY2', false);
      this.colors.set('YELLOW2', false);
      this.colors.set('BLUE2', true);
      this.colors.set('GREEN2', false);

      this.colors.set('GREY3', false);
      this.colors.set('BLUE3', true);
      this.colors.set('GREEN3', false);

      this.colors.set('GREY4', true);
      this.colors.set('GREEN4', false);
    }
  }

  private fourthLineLevel() {
    if(this.value.password.match(/[a-z]/) && this.value.password.match(/[A-Z]/)
        && this.value.password.match(/[0-9]/) && this.value.password.length >= 8){
      this.colors.set('GREY1', false);
      this.colors.set('RED1', false);
      this.colors.set('YELLOW1', false);
      this.colors.set('BLUE1', false);
      this.colors.set('GREEN1', true);

      this.colors.set('GREY2', false);
      this.colors.set('YELLOW2', false);
      this.colors.set('BLUE2', false);
      this.colors.set('GREEN2', true);

      this.colors.set('GREY3', false);
      this.colors.set('BLUE3', false);
      this.colors.set('GREEN3', true);

      this.colors.set('GREY4', false);
      this.colors.set('GREEN4', true);
    }
  }

  private buttonStatus() {
    if(this.value.password.length >= 8) this.eightPlus = true;
    else this.eightPlus = false;
    if(this.value.password.match(/[a-z]/)) this.lowercase = true;
    else this.lowercase = false;
    if(this.value.password.match(/[A-Z]/)) this.uppercase = true;
    else this.uppercase = false;
    if(this.value.password.match(/[0-9]/)) this.number = true;
    else this.number = false;
  }
}
