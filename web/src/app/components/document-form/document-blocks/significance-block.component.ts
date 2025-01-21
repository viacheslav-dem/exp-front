import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-significance-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Значение работы для реализации приоритетов социально-экономического развития, разработки новых 
        технологических процессов, наукоемкой, конкурентоспособной продукции, 
        формирования перспективных научных направлений.
      </label>
      <textarea [(ngModel)]="_form.significance" rows="3" class="form-control"
                placeholder="Обязательный текст."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Раскройте суть значения и важности работы для республики.
        </p>
      </div>
    </div>
  `
})
export class SignificanceBlockComponent {

  @Input()
  num: string = "1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { significance: string };
}
