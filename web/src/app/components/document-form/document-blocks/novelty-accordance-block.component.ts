import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-novelty-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (новизна товара (работ, услуг)) по пункту 2 таблицы «Критерии отнесения товаров к
        высокотехнологичным» приложения 3 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <app-boolean-button
        name="noveltyAccordance"
        required
        [(ngModel)]="_form().noveltyAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().noveltyAccordanceText" (ngModelChange)="onConditionsChanged.emit(true)" name="noveltyAccordanceText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class NoveltyAccordanceBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    noveltyAccordance: boolean;
    noveltyAccordanceText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
