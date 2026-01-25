import {Component, input, output} from '@angular/core';
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";

@Component({
    selector: 'app-deadlines-compliance-block',
    template: `
      <div class="form-sub-group">
        <label>
          {{num()}}. Создание объекта права промышленной собственности
          при реализации объекта государственной экспертизы:
        </label>
        <app-dropdown name="deadlinesCompliance" required [options]="deadlinesCompliance" [ngModel]="_form()?.deadlinesCompliance"
        (ngModelChange)="emitPatch({ deadlinesCompliance: $event })"></app-dropdown>
        @if (full() || _form()?.deadlinesCompliance == 'предусматривается') {
          <textarea
            [ngModel]="_form()?.deadlinesComplianceText" (ngModelChange)="emitPatch({ deadlinesComplianceText: $event })" name="deadlinesComplianceText" required minlength="30" rows="3" class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"></textarea>
        }
        @if (full()) {
          <div class="hint">
            <p>
              <b>Подсказка.</b>
              Укажите объекты права промышленной собственности, создание которых предусматривается объектом
              государственной экспертизы.
            </p>
            <p>
              Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
              или сделайте пометку "не представлено в материалах по объекту государственной экспертизы". Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
            </p>
          </div>
        }
      </div>
      `,
    styles: [],
    standalone: false
})
export class DeadlinesComplianceBlockComponent {

    deadlinesCompliance: string[] = [
        'предусматривается',
        'не предусматривается',
    ];

    readonly num = input<string>("7");

    readonly full = input<boolean>(true);

    readonly _form = input<DeadlinesComplianceBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<DeadlinesComplianceBlockForm>>();

    emitPatch(patch: Partial<DeadlinesComplianceBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type DeadlinesComplianceBlockForm = {
  deadlinesCompliance: string;
  deadlinesComplianceText: string;
};
