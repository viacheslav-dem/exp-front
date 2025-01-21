import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-intellectual-labor-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие (использование высококвалифицированного интеллектуального труда) по пункту 8 таблицы
        «Критерии отнесения товаров к высокотехнологичным» приложения 3 к Инструкции о порядке выдачи заключений об
        отнесении товаров к высокотехнологичным, утвержденной постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.intellectualLabor"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.intellectualLaborText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class IntellectualLaborBlockComponent {

  @Input()
  num: string = "8";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    intellectualLabor: boolean;
    intellectualLaborText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
