import {Component, input, output} from '@angular/core';

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
      <input type="hidden" [ngModel]="_form()?.addedValue" name="addedValue" required>
      <app-boolean-button
        name="addedValue"
        required
        [ngModel]="_form()?.addedValue"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ addedValue: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.addedValueText" (ngModelChange)="emitPatch({ addedValueText: $event })" name="addedValueText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class AddedValueAccordanceBlockComponent {

  readonly num = input<string>("6");

  readonly full = input<boolean>(true);

  readonly _form = input<AddedValueAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AddedValueAccordanceBlockForm>>();

  emitPatch(patch: Partial<AddedValueAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type AddedValueAccordanceBlockForm = {
  addedValue: boolean;
  addedValueText: string;
};
