import {merge as observableMerge, Observable, of as observableOf, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {Component, Injector, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import {AbstractControl} from "@angular/forms";
import {NestableFormDirective} from "app/components/common-components/custom-forms/nestable-form.directive";


@Component({
  selector: 'app-control-error-messages',
  template: `
    <div *ngIf="messagesAvailable&&messages?.length" [class.alert]="alertClass" [class.alert-danger]="alertClass">
      <span *ngFor="let msg of messages" style="color:#dc3545"><small>{{msg}}</small></span>
    </div>
    <!--<app-show-json [objectToShow]="control.errors"></app-show-json>-->
  `,
})
export class ControlErrorMessagesComponent implements OnInit, OnChanges {

  @Input() alertClass = false;

  @Input() control: AbstractControl;
  controlValue$: Observable<any>;
  hasSubmitted: boolean;
  controlSubscription: Subscription;
  _fg: NestableFormDirective;

  messages = [];

  messagesAvailable = false;

  pattern_patternErrorMessage = {};

  constructor(private renderer: Renderer2, private injector: Injector) {
    // this.pattern_patternErrorMessage[constantsHolder.passwordPattern] = "пароль должен быть от 6 до 20 символов, содержать цифры и буквы латинского алфавита";
    // this.pattern_patternErrorMessage[constantsHolder.identificationNumberPattern] = "номер должен быть вида 0000000A000AA0 (буквы латинского алфавита)";
    // this.pattern_patternErrorMessage[constantsHolder.registrationIndexPattern] = "номер должен быть вида 00-00ААА либо 00-000ААА (буквы русского алфавита)";
    // this.pattern_patternErrorMessage[constantsHolder.emailPattern] = "значение должно соответствовать адресу e-mail";
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("  ngOnChanges(changes: SimpleChanges): void {\n", this);
    if (this.control) {
      this._fg = this.injector.get(NestableFormDirective, null);
      // console.log("ControlContainer", this._fg);
      if (!!this._fg) {
        this.messagesAvailable = true;

        let formSubmit$ = this._fg.rootSubmitEvent$.pipe(map(() => {
          // console.log("catch submit event", this);
          this.hasSubmitted = true;
        }));

        //чтобы учесть resetForm
        this.controlValue$ = observableMerge(this.control.valueChanges, observableOf(''), formSubmit$);

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
    if (this.control.invalid && (this.control.dirty || this.hasSubmitted)) {
      if (this.control && this.control.errors) {
        this.messages = Object.keys(this.control.errors).map((k) => {
          let msg = this.messagesMap[k];
          if (k == "pattern") {
            let requiredPattern = this.control.errors[k]["requiredPattern"];
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
