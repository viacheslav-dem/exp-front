import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-significance-block-2025',
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
            Эксперт должен конкретно раскрыть суть значения и важности работы для республики.
        </p>
      </div>
    </div>
  `
})
export class SignificanceBlock2025Component {

    @Input()
    num: string = "1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { significance: string };

}