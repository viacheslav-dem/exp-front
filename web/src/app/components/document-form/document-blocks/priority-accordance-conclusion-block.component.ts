import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-priority-accordance-conclusion-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Соответствие приоритетности направления инвестиций в технологии:
      </label>
      <input type="hidden" [ngModel]="_form()?.priorityAccordance" name="priorityAccordance" required>
      <app-boolean-button
        name="priorityAccordance"
        required
        [ngModel]="_form()?.priorityAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ priorityAccordance: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.priorityAccordanceText" (ngModelChange)="emitPatch({ priorityAccordanceText: $event })" name="priorityAccordanceText" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
          </p>
          <p class="mb-0">Укажите:</p>
          <ul>
            <li>уровень инвестиционных затрат в технологию и оборудование;</li>
            <li>долю импорта;</li>
            <li>
              результаты сравнения удельных расходов на создание объекта с уровнем затрат при создании
              аналогичных объектов в мировой практике;
            </li>
            <li>
              обоснованность запрашиваемого объема бюджетного финансирования для внедрения технологии (оборудования)
              в рамках реализуемого инвестиционного проекта.
            </li>
          </ul>
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
export class PriorityAccordanceConclusionBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<PriorityAccordanceConclusionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<PriorityAccordanceConclusionBlockForm>>();

  emitPatch(patch: Partial<PriorityAccordanceConclusionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type PriorityAccordanceConclusionBlockForm = {
  priorityAccordance: boolean;
  priorityAccordanceText: string;
};
