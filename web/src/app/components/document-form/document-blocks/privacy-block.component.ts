import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-privacy-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание объекта права промышленной собственности
        при реализации объекта государственной экспертизы:
      </label>
      <app-dropdown
        [options]="privacyOptions"
        [ngModel]="_form()?.privacyObjectsDescription"
        [name]="'privacyObjectsDescription_' + num().split('.').join('_')"
        required
        (ngModelChange)="emitPatch({ privacyObjectsDescription: $event })"
      ></app-dropdown>
      @if (full() || _form()?.privacyObjectsDescription == 'предусматривается') {
        <textarea
          [ngModel]="_form()?.privacyObjectsDescriptionText"
          (ngModelChange)="emitPatch({ privacyObjectsDescriptionText: $event })"
          [name]="'privacyObjectsDescriptionText_' + num().split('.').join('_')"
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
    standalone: false
})
export class PrivacyBlockComponent {

  privacyOptions: string[] = [
    'предусматривается',
    'не предусматривается',
  ];

  readonly num = input<string>("7");

  readonly full = input<boolean>(true);

  readonly _form = input<PrivacyBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<PrivacyBlockForm>>();

  emitPatch(patch: Partial<PrivacyBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type PrivacyBlockForm = {
  privacyObjectsDescription: string;
  privacyObjectsDescriptionText: string;
};
