import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-wastelessness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (безотходность производства товара) по пункту 3 таблицы «Критерии отнесения товаров к
        высокотехнологичным» приложения 3 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <app-boolean-button
        name="wastelessness"
        required
        [(ngModel)]="_form().wastelessness"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().wastelessnessText" (ngModelChange)="onConditionsChanged.emit(true)" name="wastelessnessText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class WastelessnessBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    wastelessness: boolean;
    wastelessnessText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
