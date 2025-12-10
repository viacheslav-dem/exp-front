import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-work-significance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Значение работы для реализации приоритетов социально-экономического развития, разработки новых 
        технологических процессов, наукоемкой, конкурентоспособной продукции, формирования перспективных 
        научных направлений:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.workSignificance"
        [trueLabel]="'присутствует'"
        [falseLabel]="'отсутствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.workSignificanceText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class WorkSignificanceBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: {
    workSignificance: boolean;
    workSignificanceText;
  };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
