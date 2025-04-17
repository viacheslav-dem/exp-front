import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-analog-params-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Основные технико-экономические и социально-экономические параметры планируемых новшеств 
        (аналога импортируемой продукции), анализ аналогов (прототипов) продукции, 
        а также возможности использования промежуточных результатов исследований для других разработок (модификаций, 
        а также в иных сферах экономики):
      </label>
      <app-dropdown [options]="analogParamsOptions" [(ngModel)]="_form.analogParams"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.analogParamsText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
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
export class AnalogParamsBlockComponent {

  analogParamsOptions: string[] = [
    'имеются',
    'не имеются',
  ];

  @Input()
  num: string = "5.3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { analogParams: string, analogParamsText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
