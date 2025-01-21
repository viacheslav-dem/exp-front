import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-conclusion-8-11-14-block',
  template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств
        республиканского бюджета и (или) других источников финансирования:
      </label>
      <app-boolean-button
        [(ngModel)]="_form.conclusion"
        [disabled]="disabled"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea [(ngModel)]="_form.conclusionText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          В случае указания целесообразности экспертное заключение считается <b>положительным</b>, 
          а в случае указания нецелесообразности – <b>отрицательным</b>.
        </p>
      </div>
    </div>
  `
})
export class Conclusion_8_11_14_BlockComponent {

  @Input()
  num: string = "1";

  @Input()
  disabled: boolean = false;

  @Input()
  _form: { conclusion: boolean, conclusionText: string };

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
