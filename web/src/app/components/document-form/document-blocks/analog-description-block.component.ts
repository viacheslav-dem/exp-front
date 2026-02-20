import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-analog-description-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Наиболее близкий аналог используемой (выпускаемой) на территории Республики Беларусь
        и (или) в мире технологии и (или) продукции того же назначения:
      </label>
      <input [ngModel]="_form()?.analog"
        (ngModelChange)="emitPatch({ analog: $event })"
        [attr.name]="'analog_' + num().split('.').join('_')"
        required
        type="text" class="form-control"
        title="Наиболее близкий аналог"
        placeholder="наименование аналога">
        @if (full()) {
          <textarea
            [ngModel]="_form()?.analogText"
            (ngModelChange)="emitPatch({ analogText: $event })"
            [attr.name]="'analogText_' + num().split('.').join('_')"
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
              Укажите наиболее близкий аналог в республике или в мире по объекту государственной экспертизы.
            </p>
            <p>
              Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
              или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
              Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
            </p>
          </div>
        }
      </div>
    `,
    standalone: false
})
export class AnalogDescriptionBlockComponent {

  readonly num = input<string>("5.3");

  readonly full = input<boolean>(true);

  readonly _form = input<AnalogDescriptionBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<AnalogDescriptionBlockForm>>();

  emitPatch(patch: Partial<AnalogDescriptionBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type AnalogDescriptionBlockForm = {
  analog: string;
  analogText: string;
};
