import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-product-competitiveness-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Конкурентоспособность товара:
      </label>
      <app-boolean-button [(ngModel)]="_form().competitiveness" [trueLabel]="'да'"
        [falseLabel]="'нет'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().competitivenessText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст."></textarea>
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

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
