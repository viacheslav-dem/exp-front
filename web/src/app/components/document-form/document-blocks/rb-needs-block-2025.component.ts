import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-rb-needs-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Потребность республики в результатах, получение которых запланировано в ходе реализации мероприятий
        (заданий, проектов, планов, работ, услуг), являющихся объектами государственной экспертизы,
        в том числе с учетом возможностей расширения экспорта и (или) сокращения импорта продукции,
        поставки потребителю разработанной и осваиваемой продукции:
      </label>
      <app-dropdown [options]="needsOptions" [(ngModel)]="_form.rbNeeds"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full) {
        <textarea [(ngModel)]="_form.rbNeedsText" rows="3" class="form-control mt-05"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
      @if (full) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
            или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class RbNeedsBlock2025Component {

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
  _form: { rbNeeds: string, rbNeedsText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
