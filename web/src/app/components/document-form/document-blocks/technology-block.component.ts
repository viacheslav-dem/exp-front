import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-technology-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оптимальность выбранной технологии и ее инновационность для Республики Беларусь:
      </label>
      <app-boolean-button name="technology" required [ngModel]="_form()?.technology" [trueLabel]="'подтверждается'"
        [falseLabel]="'не подтверждается'"
      (ngModelChange)="emitPatch({ technology: $event })"></app-boolean-button>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.technologyText"
          (ngModelChange)="emitPatch({ technologyText: $event })"
          [attr.name]="'technologyText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите с учётом пунктов 1, 2 данного заключения оптимальность выбранной технологии,
            обоснованность ее внедрения в данной организации и инновационность для Республики Беларусь.
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
export class TechnologyBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<TechnologyBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<TechnologyBlockForm>>();

  emitPatch(patch: Partial<TechnologyBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type TechnologyBlockForm = {
  technology: boolean;
  technologyText: string;
};
