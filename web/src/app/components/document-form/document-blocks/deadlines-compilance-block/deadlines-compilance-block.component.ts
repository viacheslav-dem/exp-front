import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";

@Component({
    selector: 'app-deadlines-compliance-block',
    template: `
      <div class="form-sub-group">
          <label>
              {{num}}. Создание объекта права промышленной собственности
              при реализации объекта государственной экспертизы:
          </label>
          <app-dropdown [options]="deadlinesCompliance" [(ngModel)]="_form.deadlinesCompliance"
                        (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
          <textarea *ngIf="full || _form.deadlinesCompliance == 'предусматривается'"
                    [(ngModel)]="_form.deadlinesComplianceText" rows="3" class="form-control mt-05"
                    placeholder="Обязательный текст"></textarea>
          <div *ngIf="full" class="hint">
              <p>
                  <b>Подсказка.</b>
                  Укажите объекты права промышленной собственности, создание которых предусматривается объектом
                  государственной экспертизы.
              </p>
              <p>
                  Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
                  или сделайте пометку "не представлено в материалах по объекту государственной экспертизы". Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
              </p>
          </div>
      </div>
  `,
    styles: [],
    standalone: false
})
export class DeadlinesComplianceBlockComponent {

    deadlinesCompliance: string[] = [
        'предусматривается',
        'не предусматривается',
    ];

    @Input()
    num: string = "7";

    @Input()
    full: boolean = true;

    @Input()
    _form: { deadlinesCompliance: string, deadlinesComplianceText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
