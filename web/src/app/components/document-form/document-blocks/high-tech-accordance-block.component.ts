import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-high-tech-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие (высокотехнологичность производства) по пункту 1 таблицы «Критерии отнесения товаров
        к высокотехнологичным» приложения 2 к Инструкции о порядке выдачи заключений об отнесении товаров к
        высокотехнологичным, утвержденной постановлением ГКНТ от 25 июля 2022 г. № 12:
      </label>
      <input type="hidden" [ngModel]="_form()?.highTechAccordance" name="highTechAccordance" required>
      <app-boolean-button
        name="highTechAccordance"
        required
        [ngModel]="_form()?.highTechAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ highTechAccordance: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.highTechAccordanceText" (ngModelChange)="emitPatch({ highTechAccordanceText: $event })" name="highTechAccordanceText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class HighTechAccordanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<HighTechAccordanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<HighTechAccordanceBlockForm>>();

  emitPatch(patch: Partial<HighTechAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type HighTechAccordanceBlockForm = {
  highTechAccordance: boolean;
  highTechAccordanceText: string;
};
