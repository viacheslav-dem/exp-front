import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-high-tech-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (высокотехнологичность производства) по пункту 1 таблицы «Критерии отнесения товаров
        к высокотехнологичным» приложения 2 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 25 июля 2022 г. № 12:
      </label>
      <app-boolean-button
        name="highTechAccordance"
        required
        [(ngModel)]="_form().highTechAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().highTechAccordanceText" name="highTechAccordanceText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class HighTechAccordanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    highTechAccordance: boolean;
    highTechAccordanceText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
