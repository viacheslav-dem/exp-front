import {Component, input, output} from '@angular/core';
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";

@Component({
    selector: 'app-finance-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие заявленного финансирования планируемому объему выполняемых работ:
      </label>
      <app-boolean-button
        name="financeAccordance"
        required
        [ngModel]="_form()?.financeAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="emitPatch({ financeAccordance: $event })"
      ></app-boolean-button>
      @if (!_form()?.financeAccordance) {
        <label>Рекомендуемый объем финансирования, {{project()?.currency?.name || 'руб.'}}:</label>
        <div class="input-group">
          <input
            [ngModel]="_form()?.financeSuggestion"
            (ngModelChange)="emitPatch({ financeSuggestion: $event })"
            min="0"
            numberInput
            type="text"
            class="form-control"
            [title]="'Рекомендуемый объем финансирования, ' + (project()?.currency?.name || 'руб.')"
            [placeholder]="'сумма, ' + (project()?.currency?.name || 'руб.')"
            name="financeSuggestion"
            required
          >
        </div>
      }
      @if (full()) {
        <textarea
          [ngModel]="_form()?.financeAccordanceText"
          (ngModelChange)="emitPatch({ financeAccordanceText: $event })"
          [name]="'financeAccordanceText_' + num().split('.').join('_')"
          [required]="isTextRequired()"
          [minlength]="isTextRequired() ? 30 : null"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          [placeholder]="isTextRequired() ? 'Обязательный текст (не менее 30 символов).' : 'Пояснительный текст (при необходимости).'"
          ></textarea>
        }
        @if (full()) {
          <div class="hint">
            <p>
              <b>Подсказка.</b>
              Проведите анализ и оценку обоснованности расходов во внедряемые технологии по объекту государственной
              экспертизы. Обоснуйте расходы по сравнению с аналогичными технологиями и (или) продукцией,
              применяемыми и (или) выпускаемой в Республике Беларусь и (или) мире.
              Оцените обоснованность расходов по соотношению себестоимости и стоимости продукции (работ и услуг).
            </p>
            <p>
              Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
              или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
              Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
              Оцените обоснованность расходов по соответствующим статьям себестоимости и стоимость продукции (работ и услуг).
            </p>
          </div>
        }
      </div>
    `,
    standalone: false
})
export class FinanceAccordanceBlockComponent {

  readonly num = input<string>("9.3");

  readonly full = input<boolean>(true);

  readonly isTextRequired = input<boolean>(false);

  readonly _form = input<FinanceAccordanceBlockForm>(undefined);

  readonly project = input<ProjectPlainDto | ProjectDto>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<FinanceAccordanceBlockForm>>();

  emitPatch(patch: Partial<FinanceAccordanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type FinanceAccordanceBlockForm = {
  financeAccordance: boolean;
  financeSuggestion: number;
  financeAccordanceText: string;
};
