import {Component, input} from '@angular/core';

@Component({
    selector: 'app-significance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Значение работы для реализации приоритетов социально-экономического развития, разработки новых
        технологических процессов, наукоемкой, конкурентоспособной продукции,
        формирования перспективных научных направлений.
      </label>
      <textarea
        [(ngModel)]="_form().significance"
        [attr.name]="'significance_' + num().split('.').join('_')"
        required
        maxlength="5000"
        rows="3"
        class="form-control"
      placeholder="Обязательный текст."></textarea>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Раскройте суть значения и важности работы для республики.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class SignificanceBlockComponent {

  readonly num = input<string>("1");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    significance: string;
}>(undefined);
}
