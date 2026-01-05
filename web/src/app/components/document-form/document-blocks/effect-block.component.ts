import {Component, input} from '@angular/core';

@Component({
    selector: 'app-effect-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия.
      </label>
      <textarea
        [(ngModel)]="_form().effect"
        [attr.name]="'effect_' + num().split('.').join('_')"
        required
        minlength="30"
        maxlength="5000"
        rows="3"
        class="form-control"
      placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Обозначьте возможный эффект по объекту экспертизы по представленным материалам объекта экспертизы.
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
export class EffectBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    effect: string;
}>(undefined);
}
