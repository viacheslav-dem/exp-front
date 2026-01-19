import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-product-competitiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Конкурентоспособность товара:
      </label>
      <app-boolean-button name="competitiveness" required [(ngModel)]="_form().competitiveness" [trueLabel]="'да'"
        [falseLabel]="'нет'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea
          [(ngModel)]="_form().competitivenessText"
          [attr.name]="'competitivenessText_' + num().split('.').join('_')"
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
export class ProductCompetitivenessBlockComponent {

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    competitiveness: boolean;
    competitivenessText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
