import {merge as observableMerge, Observable, of as observableOf, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnChanges, OnInit, Renderer2, SimpleChanges, input} from '@angular/core';
import {AbstractControl} from "@angular/forms";
import {NestableFormDirective} from "app/components/common-components/custom-forms/nestable-form.directive";
import {environment} from "../../../../../environments/environment";


@Component({
    selector: 'app-control-error-messages',
    template: `
    @if (messagesAvailable&&messages?.length) {
      <div [class.alert]="alertClass()" [class.alert-danger]="alertClass()">
        @for (msg of messages; track msg) {
          <span style="color:#dc3545"><small>{{msg}}</small></span>
        }
      </div>
    }
    <!--<app-show-json [objectToShow]="control.errors"></app-show-json>-->
    `,
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.commonControls)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class ControlErrorMessagesComponent implements OnInit, OnChanges {

  readonly alertClass = input(false);

  readonly control = input<AbstractControl>(undefined);
  controlValue$: Observable<any>;
  hasSubmitted: boolean;
  controlSubscription: Subscription;
  _fg: NestableFormDirective;

  messages = [];

  messagesAvailable = false;

  pattern_patternErrorMessage = {};

  constructor(private renderer: Renderer2, private injector: Injector, private cdr: ChangeDetectorRef) {
    // this.pattern_patternErrorMessage[constantsHolder.passwordPattern] = "пароль должен быть от 6 до 20 символов, содержать цифры и буквы латинского алфавита";
    // this.pattern_patternErrorMessage[constantsHolder.identificationNumberPattern] = "номер должен быть вида 0000000A000AA0 (буквы латинского алфавита)";
    // this.pattern_patternErrorMessage[constantsHolder.registrationIndexPattern] = "номер должен быть вида 00-00ААА либо 00-000ААА (буквы русского алфавита)";
    // this.pattern_patternErrorMessage[constantsHolder.emailPattern] = "значение должно соответствовать адресу e-mail";
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("  ngOnChanges(changes: SimpleChanges): void {\n", this);
    const control = this.control();
    if (control) {
      this._fg = this.injector.get(NestableFormDirective, null);
      // console.log("ControlContainer", this._fg);
      if (!!this._fg) {
        this.messagesAvailable = true;

        let formSubmit$ = this._fg.rootSubmitEvent$.pipe(map(() => {
          // console.log("catch submit event", this);
          this.hasSubmitted = true;
        }));

        //чтобы учесть resetForm
        this.controlValue$ = observableMerge(control.valueChanges, observableOf(''), formSubmit$);

        if (this._fg.rootForm) {
          this._fg.rootForm.valueChanges.subscribe(() => {
            // console.log("catch valueChanges event", this);
            this.hasSubmitted = false;
          });
          this.controlValue$ = observableMerge(this.controlValue$, this._fg.rootForm.valueChanges);
        }
        // this.controlValue$ = Observable.merge(this.control.valueChanges, Observable.of(''), formSubmit$);
        this.controlSubscription = this.controlValue$.subscribe(() => {
          this.updateVisibility();
          // Важно для OnPush/zoneless: ошибки/сообщения обновляются из подписки
          this.cdr.markForCheck();
        });
      } else {
        // console.log("messages not available", this);

      }
    }
  }

  messagesMap = {
    "required": "Обязательное поле",
    "pattern": "Неверный формат",
    "rangeValidator": "Неверный диапазон",
    "passwordValidator": "Пароль повторён неверно"
  };

  updateVisibility() {
    const control = this.control();
    if (control.invalid && (control.dirty || this.hasSubmitted)) {
      if (control && control.errors) {
        this.messages = Object.keys(control.errors).map((k) => {
          let msg = this.messagesMap[k];
          if (k == "pattern") {
            let requiredPattern = this.control().errors[k]["requiredPattern"];
            // console.log(requiredPattern);
            requiredPattern = requiredPattern.replace("\^\^", "\^");
            requiredPattern = requiredPattern.replace("\$\$", "\$");
            // console.log(requiredPattern);
            if (this.pattern_patternErrorMessage[requiredPattern]) {
              let patternMsg = this.pattern_patternErrorMessage[requiredPattern];
              msg += `(${patternMsg})`;
            }
          }
          return msg;
        })
      }
    } else {
      this.messages = [];
    }
  }


}
