import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-analog-params-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Основные технико-экономические и социально-экономические параметры планируемых новшеств
        (аналога импортируемой продукции), анализ аналогов (прототипов) продукции,
        а также возможности использования промежуточных результатов исследований для других разработок (модификаций,
        а также в иных сферах экономики):
      </label>
      <app-dropdown name="analogParams" required [options]="analogParamsOptions" [(ngModel)]="_form().analogParams"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full()) {
        <textarea [(ngModel)]="_form().analogParamsText" name="analogParamsText" required minlength="30" maxlength="5000" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст (не менее 30 символов)"></textarea>
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
export class AnalogParamsBlockComponent {

  analogParamsOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  readonly num = input<string>("5.3");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    analogParams: string;
    analogParamsText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
