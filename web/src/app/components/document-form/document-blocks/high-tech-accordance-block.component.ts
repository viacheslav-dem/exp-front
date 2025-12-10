import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-high-tech-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие (высокотехнологичность производства) по пункту 1 таблицы «Критерии отнесения товаров
        к высокотехнологичным» приложения 2 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 25 июля 2022 г. № 12:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.highTechAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full) {
        <textarea [(ngModel)]="_form.highTechAccordanceText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class HighTechAccordanceBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    highTechAccordance: boolean;
    highTechAccordanceText: string;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
