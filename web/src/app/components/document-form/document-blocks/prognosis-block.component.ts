import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-prognosis-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка анализа текущего состояния и прогноза
        научно-технического развития соответствующей сферы планирования:
      </label>
      <app-boolean-button name="prognosis" required [ngModel]="_form()?.prognosis" [trueLabel]="'достаточна'"
        [falseLabel]="'недостаточна'"
      (ngModelChange)="emitPatch({ prognosis: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.prognosisText"
          (ngModelChange)="emitPatch({ prognosisText: $event })"
          [attr.name]="'prognosisText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Оцените достаточность и достоверность приведенного в материалах объекта экспертизы анализа текущего
            состояния и прогноза (тенденций) научно-технического развития сферы, соответствующей объекту экспертизы.
          </p>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class PrognosisBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<PrognosisBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<PrognosisBlockForm>>();

  emitPatch(patch: Partial<PrognosisBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type PrognosisBlockForm = {
  prognosis: boolean;
  prognosisText: string;
};
