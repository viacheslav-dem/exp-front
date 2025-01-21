import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-results-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Сопоставительный анализ запланированных результатов и их соответствия достигнутым результатам.
      </label>
      <textarea [(ngModel)]="_form.results" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Проведите детальный сопоставительный анализ запланированных и фактических результатов
          по каждому этапу календарного плана по реализации объекта экспертизы.
        </p>
      </div>
    </div>
  `
})
export class ResultsBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { results: string };
}
