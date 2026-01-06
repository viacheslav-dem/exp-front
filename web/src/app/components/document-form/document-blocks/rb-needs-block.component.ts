import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-rb-needs-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Потребность республики в результатах, получение которых запланировано в ходе реализации мероприятий
        (заданий, проектов, планов, работ, услуг), являющихся объектами государственной экспертизы,
        в том числе с учетом возможностей расширения экспорта и (или) сокращения импорта продукции,
        поставки потребителю разработанной и осваиваемой продукции:
      </label>
      <app-dropdown name="needs" required [options]="needsOptions" [(ngModel)]="_form().needs"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().needsText" name="needsText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)."></textarea>
      }
      @if (full()) {
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
export class RbNeedsBlockComponent {

  needsOptions: string[] = [
    'низкая',
    'средняя',
    'высокая'
  ];

  readonly num = input<string>("3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    needs: string;
    needsText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
