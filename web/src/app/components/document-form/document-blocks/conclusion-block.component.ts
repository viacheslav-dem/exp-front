import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-conclusion-block',
  template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы 
      </label>
        <br\>
      <app-boolean-button
        [(ngModel)]="_form.conclusion"
        [disabled]="disabled"
        [showDisabledSelection]="true"
        [trueLabel]="'положительное'"
        [falseLabel]="'отрицательное'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea [(ngModel)]="_form.conclusionText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div *ngIf="financeConclusionNum" class="hint">
        <p>
          <b>Подсказка.</b>
          Положительное решение принимается, если в подпункте {{financeConclusionNum}} имеется оценка «целесообразно».
        </p>
      </div>
    </div>
  `
})
export class ConclusionBlockComponent {

  @Input()
  disabled: boolean = false;

  @Input()
  financeConclusionNum: string;

  @Input()
  _form: { conclusion: boolean, conclusionText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
