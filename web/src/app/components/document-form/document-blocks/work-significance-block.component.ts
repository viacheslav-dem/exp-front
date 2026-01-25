import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-work-significance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Значение работы для реализации приоритетов социально-экономического развития, разработки новых
        технологических процессов, наукоемкой, конкурентоспособной продукции, формирования перспективных
        научных направлений:
      </label>
      <input type="hidden" [ngModel]="_form()?.workSignificance" name="workSignificance" required>
      <app-boolean-button
        name="workSignificance"
        required
        [ngModel]="_form()?.workSignificance"
        [trueLabel]="'присутствует'"
        [falseLabel]="'отсутствует'"
        (ngModelChange)="emitPatch({ workSignificance: $event })"></app-boolean-button>
      @if (full()) {
        <textarea [ngModel]="_form()?.workSignificanceText" (ngModelChange)="emitPatch({ workSignificanceText: $event })" name="workSignificanceText" required minlength="30" maxlength="5000" rows="3" class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class WorkSignificanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<WorkSignificanceBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<WorkSignificanceBlockForm>>();

  emitPatch(patch: Partial<WorkSignificanceBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type WorkSignificanceBlockForm = {
  workSignificance: boolean;
  workSignificanceText: string;
};
