import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-risks-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Риски реализации проекта:
      </label>
      <app-dropdown [options]="risksOptions" [(ngModel)]="_form.risks"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.risksText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Проведите анализ способов и методов оценки результативности и эффективности реализации объекта
          государственной экспертизы рисков, сопутствующих объекту государственной экспертизы, и сделайте вывод
          о <b>высоких</b> / <b>низких</b> рисках реализации проекта.
        </p>
        <p class="mb-0">
          Оцените риски, связанные с:
        </p>
        <ul>
          <li>рынком сбыта (изменение цен, конкуренция);</li>
          <li>финансами;</li>
          <li>использованием интеллектуальной собственности;</li>
          <li>выходом нового законодательства;</li>
          <li>введением государственных санкций или установлением таможенных барьеров;</li>
          <li>другими причинами.</li>
        </ul>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          даже если в материалах по обьекту государственной экспертизы отсутствует соответствующая информация. 
          Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
        </p>
      </div>
    </div>
  `
})
export class RisksBlockComponent {

  risksOptions: string[] = [
    'низкие',
    'высокие',
  ];

  @Input()
  num: string = "6";

  @Input()
  full: boolean = true;

  @Input()
  _form: { risks: string, risksText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
