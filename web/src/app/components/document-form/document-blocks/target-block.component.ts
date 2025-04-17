import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-target-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Оценка целевых показателей проекта:
      </label>
      <app-dropdown [options]="targetOptions" [(ngModel)]="_form.target"
                    (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      <textarea *ngIf="full" [(ngModel)]="_form.targetText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Укажите наличие и суть целевых показателей проекта.
        </p>
        <p>
          Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
          или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
        </p>
      </div>
    </div>
  `
})
export class TargetBlockComponent {

  targetOptions: string[] = [
    'достаточна',
    'недостаточна',
  ];

  @Input()
  num: string = "2.1";

  @Input()
  full: boolean = true;

  @Input()
  _form: { target: string, targetText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
