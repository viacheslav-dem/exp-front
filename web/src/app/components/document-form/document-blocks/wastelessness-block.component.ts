import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-wastelessness-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие (безотходность производства товара) по пункту 3 таблицы «Критерии отнесения товаров к
        высокотехнологичным» приложения 3 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.wastelessness"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.wastelessnessText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class WastelessnessBlockComponent {

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    wastelessness: boolean;
    wastelessnessText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
