import {Component, input} from '@angular/core';

@Component({
    selector: 'app-results-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сопоставительный анализ запланированных результатов и их соответствия достигнутым результатам.
      </label>
      <textarea
        [(ngModel)]="_form().results"
        [attr.name]="'results_' + num().split('.').join('_')"
        required
        minlength="30"
        rows="3"
        class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."
      ></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Проведите детальный сопоставительный анализ запланированных и фактических результатов
            по каждому этапу календарного плана по реализации объекта экспертизы.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ResultsBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    results: string;
}>(undefined);
}
