import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-intellectual-property-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (использование интеллектуальной собственности) по пункту 7 таблицы «Критерии
        отнесения товаров к высокотехнологичным» приложения 3 к Инструкции о порядке выдачи заключений об отнесении
        товаров к высокотехнологичным, утвержденной постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <app-boolean-button
        name="intellectualProperty"
        required
        [(ngModel)]="_form().intellectualProperty"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().intellectualPropertyText" name="intellectualPropertyText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class IntellectualPropertyBlockComponent {

  readonly num = input<string>("7");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    intellectualProperty: boolean;
    intellectualPropertyText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
