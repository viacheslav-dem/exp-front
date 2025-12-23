import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-work-significance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Значение работы для реализации приоритетов социально-экономического развития, разработки новых
        технологических процессов, наукоемкой, конкурентоспособной продукции, формирования перспективных
        научных направлений:
      </label>
      <app-boolean-button
        name="workSignificance"
        required
        [(ngModel)]="_form().workSignificance"
        [trueLabel]="'присутствует'"
        [falseLabel]="'отсутствует'"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      @if (full()) {
        <textarea [(ngModel)]="_form().workSignificanceText" name="workSignificanceText" required minlength="30" rows="3" class="form-control"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class WorkSignificanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    workSignificance: boolean;
    workSignificanceText;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
