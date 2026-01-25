import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-science-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (наукоемкость) по пункту 5 таблицы «Критерии отнесения товаров к высокотехнологичным»
        приложения 3 к Инструкции о порядке выдачи заключений об отнесении товаров к высокотехнологичным, утвержденной
        постановлением ГКНТ от 18 декабря 2008 г. № 12:
      </label>
      <input type="hidden" [ngModel]="_form()?.science" name="science" required>
      <app-boolean-button
        name="science"
        required
        [ngModel]="_form()?.science"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ science: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.scienceText" (ngModelChange)="emitPatch({ scienceText: $event })" name="scienceText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class ScienceBlockComponent {

  readonly num = input<string>("5");

  readonly full = input<boolean>(true);

  readonly _form = input<ScienceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ScienceBlockForm>>();

  emitPatch(patch: Partial<ScienceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ScienceBlockForm = {
  science: boolean;
  scienceText: string;
};
