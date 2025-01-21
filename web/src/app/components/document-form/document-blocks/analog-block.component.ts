import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-analog-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Укажите, на что направлен объект государственной экспертизы:
      </label>
      <app-dropdown [options]="analogOptions" [(ngModel)]="_form.analog"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.analogText" rows="3" class="form-control mt-05"
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
export class AnalogBlockComponent {

  analogOptions: string[] = [
    'на создание новшества',
    'на создание полного аналога импортируемой продукции',
  ];

  @Input()
  num: string = "5.2";

  @Input()
  full: boolean = true;

  @Input()
  _form: { analog: string, analogText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
