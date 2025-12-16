import {ChangeDetectionStrategy, Component, forwardRef, input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "app/components/common-components/control-component";
import * as _ from "lodash";
import {PasswordDto} from "@app/dto/PasswordDto";
import {environment} from "../../../../environments/environment";
export const PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordInputComponent),
  multi: true
};

@Component({
    selector: 'app-password-input',
    template: `
    <ng-container *ngIf="value" ngForm appNestableForm>
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Текущий пароль</label>
        <input [(ngModel)]="value.currentPassword" name="currentPassword" class="form-control form-control-lg rounded-3" type="password" required
               (change)="onChange()" (input)="onInput()" placeholder="Введите текущий пароль"/>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Новый пароль</label>
        <input [(ngModel)]="value.password" name="password" class="form-control form-control-lg rounded-3" type="password" required
               [pattern]="pattern()" (change)="onChange()" (input)="onInputNumber2()" #currentPasswordNgModel="ngModel" placeholder="Введите новый пароль"/>
        <app-control-error-messages [control]="currentPasswordNgModel.control"></app-control-error-messages>
      </div>
      <div class="mb-3">
        <div class="password-strength-indicator">
          <div class="row g-2 m-0">
            <div class="col p-0">
              <div class="strength-bar" 
                   [class.bg-secondary]="colors.get('GREY1')"
                   [class.bg-danger]="colors.get('RED1')"
                   [class.bg-warning]="colors.get('YELLOW1')"
                   [class.bg-info]="colors.get('BLUE1')"
                   [class.bg-success]="colors.get('GREEN1')"></div>
            </div>
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="colors.get('GREY2')"
                   [class.bg-warning]="colors.get('YELLOW2')"
                   [class.bg-info]="colors.get('BLUE2')"
                   [class.bg-success]="colors.get('GREEN2')"></div>
            </div>
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="colors.get('GREY3')"
                   [class.bg-info]="colors.get('BLUE3')"
                   [class.bg-success]="colors.get('GREEN3')"></div>
            </div>
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="colors.get('GREY4')"
                   [class.bg-success]="colors.get('GREEN4')"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <div class="row g-2">
          <div class="col-6 col-md-3">
            <div class="password-requirement" [class.requirement-met]="number">
              <i class="fas me-2" [class.fa-check-circle]="number" [class.fa-times-circle]="!number"></i>
              <span class="small">Цифры</span>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="password-requirement" [class.requirement-met]="uppercase">
              <i class="fas me-2" [class.fa-check-circle]="uppercase" [class.fa-times-circle]="!uppercase"></i>
              <span class="small">Заглавные</span>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="password-requirement" [class.requirement-met]="lowercase">
              <i class="fas me-2" [class.fa-check-circle]="lowercase" [class.fa-times-circle]="!lowercase"></i>
              <span class="small">Строчные</span>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="password-requirement" [class.requirement-met]="eightPlus">
              <i class="fas me-2" [class.fa-check-circle]="eightPlus" [class.fa-times-circle]="!eightPlus"></i>
              <span class="small">8+ символов</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Повторите новый пароль</label>
        <input [(ngModel)]="value.passwordConfirmation" name="passwordConfirmation" class="form-control form-control-lg rounded-3" type="password"
               required [pattern]="pattern()" (change)="onChange()" (input)="onInput()" placeholder="Повторите новый пароль"/>
      </div>
    </ng-container>
  `,
    providers: [PASSWORD_INPUT_CONTROL_VALUE_ACCESSOR],
    styles: [`
      .password-strength-indicator {
        margin: 0.75rem 0;
      }
      
      .strength-bar {
        height: 4px;
        border-radius: 2px;
        transition: all 0.3s ease;
      }
      
      .password-requirement {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: #f8f9fa;
        transition: all 0.3s ease;
      }
      
      .password-requirement i.fa-times-circle {
        color: #dc3545;
      }
      
      .password-requirement i.fa-check-circle {
        color: #198754;
      }
      
      .password-requirement.requirement-met {
        background-color: #d1e7dd;
      }
      
      .password-requirement:not(.requirement-met) {
        background-color: #f8d7da;
      }
    `],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: environment.features.onPush.passwordInput ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
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

  readonly changeValueAfterBlur = input(true);

  readonly pattern = input<string>("^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$");

  onInput() {
    if (!this.changeValueAfterBlur()) {
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
    if (!this.changeValueAfterBlur()) {
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
