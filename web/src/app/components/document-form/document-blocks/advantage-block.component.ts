import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-advantage-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Обладание товаром более высокими технико-экономическими показателями по сравнению с другими товарами,
        представленными на определенном сегменте рынка:
      </label>
      <app-boolean-button name="advantage" required [(ngModel)]="_form().advantage" [trueLabel]="'да'"
        [falseLabel]="'нет'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().advantageText"
          [attr.name]="'advantageText_' + num().split('.').join('_')"
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
            Проведите анализ и оценку соответствия объекта экспертизы критерию.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class AdvantageBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    advantage: boolean;
    advantageText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
