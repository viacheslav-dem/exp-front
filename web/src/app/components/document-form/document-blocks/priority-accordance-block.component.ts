import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-priority-accordance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Приоритетность направления инвестиций в технологию, обоснованность расходов.
      </label>
      <textarea [(ngModel)]="_form.priorityAccordance" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
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
export class PriorityAccordanceBlockComponent {

  @Input()
  num: string = "2";

  @Input()
  full: boolean = true;

  @Input()
  _form: { priorityAccordance: string };
}
