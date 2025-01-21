import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-rb-needs-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Потребность республики в результатах, получение которых запланировано в ходе реализации мероприятий 
        (заданий, проектов, планов, работ, услуг), являющихся объектами государственной экспертизы, 
        в том числе с учетом возможностей расширения экспорта и (или) сокращения импорта продукции, 
        поставки потребителю разработанной и осваиваемой продукции:
      </label>
      <app-dropdown [options]="needsOptions" [(ngModel)]="_form.needs"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.needsText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `
})
export class RbNeedsBlockComponent {

  needsOptions: string[] = [
    'низкая',
    'средняя',
    'высокая'
  ];

  @Input()
  num: string = "3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { needs: string, needsText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
