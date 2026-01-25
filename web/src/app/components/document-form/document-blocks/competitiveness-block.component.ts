import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-competitiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Обоснование конкурентоспособности разработки:
      </label>
      <app-dropdown name="competitiveness" required [options]="competitivenessOptions" [ngModel]="_form()?.competitiveness"
      (ngModelChange)="emitPatch({ competitiveness: $event })"></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.competitivenessText"
          (ngModelChange)="emitPatch({ competitivenessText: $event })"
          [attr.name]="'competitivenessText_' + num().split('.').join('_')"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class CompetitivenessBlockComponent {

  competitivenessOptions: string[] = [
    'достаточно',
    'недостаточно',
  ];

  readonly num = input<string>("5.1");

  readonly full = input<boolean>(true);

  readonly _form = input<CompetitivenessBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<CompetitivenessBlockForm>>();

  emitPatch(patch: Partial<CompetitivenessBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type CompetitivenessBlockForm = {
  competitiveness: string;
  competitivenessText: string;
};
