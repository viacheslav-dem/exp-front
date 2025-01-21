import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-priority-accordance-conclusion-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Соответствие приоритетности направления инвестиций в технологии:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.priorityAccordance"
        [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea *ngIf="full" [(ngModel)]="_form.priorityAccordanceText" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
        </p>
        <p class="mb-0">Укажите:</p>
        <ul>
          <li>уровень инвестиционных затрат в технологию и оборудование;</li>
          <li>долю импорта;</li>
          <li>
            результаты сравнения удельных расходов на создание объекта с уровнем затрат при создании
            аналогичных объектов в мировой практике;
          </li>
          <li>
            обоснованность запрашиваемого объема бюджетного финансирования для внедрения технологии (оборудования)
            в рамках реализуемого инвестиционного проекта.
          </li>
        </ul>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `
})
export class PriorityAccordanceConclusionBlockComponent {

  @Input()
  num: string = "2";

  @Input()
  full: boolean = true;

  @Input()
  _form: { priorityAccordance: boolean, priorityAccordanceText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
