import {Component, input} from '@angular/core';

@Component({
    selector: 'app-scientific-level-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Оценка научно-технического уровня внедряемых технологий по сравнению с передовыми технологиями,
        используемыми в мире, и возможности их применения на соответствующем производстве.
      </label>
      <textarea
        [(ngModel)]="_form().scientificLevel"
        [attr.name]="'scientificLevel_' + num().split('.').join('_')"
        required
        rows="3"
        class="form-control"
        placeholder="Обязательный текст."
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Проведите оценку научно-технического уровня внедряемых технологий по сравнению с передовыми
            технологиями для объекта государственной экспертизы.
          </p>
          <p>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы"
            и дайте свою экспертную оценку по данному вопросу.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ScientificLevelBlockComponent {

  readonly num = input<string>("1.1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    scientificLevel: string;
}>(undefined);
}
