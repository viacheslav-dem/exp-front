import {Component, input} from '@angular/core';

@Component({
    selector: 'app-priority-accordance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Приоритетность направления инвестиций в технологию, обоснованность расходов.
      </label>
      <textarea
        [(ngModel)]="_form().priorityAccordance"
        [attr.name]="'priorityAccordance_' + num().split('.').join('_')"
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
      }
    </div>
    `,
    standalone: false
})
export class PriorityAccordanceBlockComponent {

  readonly num = input<string>("2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    priorityAccordance: string;
}>(undefined);
}
