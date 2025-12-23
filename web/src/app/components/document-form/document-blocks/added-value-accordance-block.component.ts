import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-added-value-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (удельная добавленная стоимость (без учета НДС; включает фонд заработной платы с
        учетом установленных платежей, амортизацию, прибыль) в объеме товарной продукции) по пункту 6 таблицы «Критерии
        отнесения товаров к высокотехнологичным» приложения 3 к Инструкции о порядке выдачи заключений об отнесении
        товаров к высокотехнологичным, утвержденной постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <app-boolean-button
        name="addedValue"
        required
        [(ngModel)]="_form().addedValue"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().addedValueText" name="addedValueText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class AddedValueAccordanceBlockComponent {

  readonly num = input<string>("6");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    addedValue: boolean;
    addedValueText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
