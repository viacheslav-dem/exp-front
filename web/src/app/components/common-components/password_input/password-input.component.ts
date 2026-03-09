import {ChangeDetectionStrategy, Component, forwardRef, input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {ControlComponent} from "app/components/common-components/control-component";
import cloneDeep from "lodash/cloneDeep";
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
    @if (value) {
    <ng-container ngForm appNestableForm>
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Текущий пароль</label>
        <div class="position-relative">
          <input [(ngModel)]="value.currentPassword" name="currentPassword" class="form-control form-control-lg rounded-3 pe-5"
                 [type]="showCurrentPassword ? 'text' : 'password'" required
                 (change)="onChange()" (input)="onInput()" placeholder="Введите текущий пароль"/>
          <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-body-secondary"
                  (click)="showCurrentPassword = !showCurrentPassword" tabindex="-1" aria-label="Показать/скрыть пароль">
            <fa-icon [icon]="showCurrentPassword ? 'eye-slash' : 'eye'" [fixedWidth]="true"></fa-icon>
          </button>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold mb-2">Новый пароль</label>
        <div class="position-relative">
          <input [(ngModel)]="value.password" name="password" class="form-control form-control-lg rounded-3 pe-5"
                 [type]="showNewPassword ? 'text' : 'password'" required
                 [pattern]="pattern()" (change)="onChange()" (input)="onPasswordInput()" #currentPasswordNgModel="ngModel" placeholder="Введите новый пароль"/>
          <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-body-secondary"
                  (click)="showNewPassword = !showNewPassword" tabindex="-1" aria-label="Показать/скрыть пароль">
            <fa-icon [icon]="showNewPassword ? 'eye-slash' : 'eye'" [fixedWidth]="true"></fa-icon>
          </button>
        </div>
        <app-control-error-messages [control]="currentPasswordNgModel.control"></app-control-error-messages>
      </div>
      <div class="mb-3">
        <div class="password-strength-indicator">
          <div class="row g-2 m-0">
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="strengthLevel < 1"
                   [class.bg-danger]="strengthLevel === 1"
                   [class.bg-warning]="strengthLevel === 2"
                   [class.bg-info]="strengthLevel === 3"
                   [class.bg-success]="strengthLevel === 4"></div>
            </div>
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="strengthLevel < 2"
                   [class.bg-warning]="strengthLevel === 2"
                   [class.bg-info]="strengthLevel === 3"
                   [class.bg-success]="strengthLevel === 4"></div>
            </div>
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="strengthLevel < 3"
                   [class.bg-info]="strengthLevel === 3"
                   [class.bg-success]="strengthLevel === 4"></div>
            </div>
            <div class="col p-0">
              <div class="strength-bar"
                   [class.bg-secondary]="strengthLevel < 4"
                   [class.bg-success]="strengthLevel === 4"></div>
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
        <div class="position-relative">
          <input [(ngModel)]="value.passwordConfirmation" name="passwordConfirmation" class="form-control form-control-lg rounded-3 pe-5"
                 [type]="showConfirmPassword ? 'text' : 'password'"
                 required [pattern]="pattern()" (change)="onChange()" (input)="onInput()" placeholder="Повторите новый пароль"/>
          <button type="button" class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-body-secondary"
                  (click)="showConfirmPassword = !showConfirmPassword" tabindex="-1" aria-label="Показать/скрыть пароль">
            <fa-icon [icon]="showConfirmPassword ? 'eye-slash' : 'eye'" [fixedWidth]="true"></fa-icon>
          </button>
        </div>
      </div>
    </ng-container>
    }
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

      :host-context([data-bs-theme="dark"]) .password-requirement {
        background-color: var(--dark-bg-elevated);
        color: var(--dark-text);
      }

      :host-context([data-bs-theme="dark"]) .password-requirement.requirement-met {
        background-color: #1a3a2a;
      }

      :host-context([data-bs-theme="dark"]) .password-requirement:not(.requirement-met) {
        background-color: var(--dark-danger-bg);
      }
    `],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class PasswordInputComponent extends ControlComponent<PasswordDto> {

  strengthLevel = 0;
  number = false;
  uppercase = false;
  lowercase = false;
  eightPlus = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  readonly changeValueAfterBlur = input(true);

  readonly pattern = input<string>("^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$");

  onInput() {
    if (!this.changeValueAfterBlur()) {
      this.onChange();
    }
  }

  onPasswordInput() {
    this.updateStrength();
    if (!this.changeValueAfterBlur()) {
      this.onChange();
    }
  }

  onChange() {
    this.value = cloneDeep(this.value);
  }

  private updateStrength() {
    const pwd = this.value.password || '';
    this.lowercase = /[a-z]/.test(pwd);
    this.uppercase = /[A-Z]/.test(pwd);
    this.number = /[0-9]/.test(pwd);
    this.eightPlus = pwd.length >= 8;

    if (pwd === '') {
      this.strengthLevel = 0;
    } else {
      this.strengthLevel = +this.lowercase + +this.uppercase + +this.number + +this.eightPlus;
    }
  }
}
