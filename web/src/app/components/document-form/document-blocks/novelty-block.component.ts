import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-novelty-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Новизна (инновационность) объекта государственной экспертизы.
      </label>
      <label>
        Степень новизны (уровень инновационности) объекта государственной экспертизы:
      </label>
      <app-dropdown
        name="novelty"
        required
        [options]="noveltyOptions"
        [ngModel]="_form()?.novelty"
        (ngModelChange)="emitPatch({ novelty: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form()?.noveltyText"
          (ngModelChange)="emitPatch({ noveltyText: $event })"
          [name]="'noveltyText_' + num()"
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
            Сформулируйте, в чем конкретно заключается новизна (инновационность) объекта государственной
            экспертизы и оцените степень новизны (уровень инновационности) объекта государственной экспертизы.
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
export class NoveltyBlockComponent {

  noveltyOptions = noveltyOptions;

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<NoveltyBlockForm>(undefined);

  readonly isTextRequired = input<boolean>(false);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<NoveltyBlockForm>>();

  emitPatch(patch: Partial<NoveltyBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type NoveltyBlockForm = {
  novelty: string;
  noveltyText: string;
};

export const noveltyOptions: string[] = [
  'не является новым для Республики Беларусь',
  'новый для Республики Беларусь',
  'новый для стран СНГ',
  'новизна мирового уровня'
];
