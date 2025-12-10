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
          Эксперт должен указать наличие и суть целевых показателей проекта с обязательным указанием ссылок на наименования документов и номера страниц, 
          в которых приводится соответствующая информация по представленным материалам объекта государственной экспертизы; если в материалах 
          по объекту государственной экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу: 
          «Не представлено в материалах по объекту государственной экспертизы».
        </p>
      </div>
    </div>
  `,
    standalone: false
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
