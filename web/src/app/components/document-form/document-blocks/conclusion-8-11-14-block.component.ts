import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-11-14-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств
        республиканского бюджета и (или) других источников финансирования:
      </label>
      <app-boolean-button
        [(ngModel)]="_form().conclusion"
        [disabled]="disabled()"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
      <textarea [(ngModel)]="_form().conclusionText" rows="3" class="form-control mt-05"
                placeholder="Обязательный текст"></textarea>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          В случае указания целесообразности экспертное заключение считается <b>положительным</b>, 
          а в случае указания нецелесообразности – <b>отрицательным</b>.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_11_14_BlockComponent {

  readonly num = input<string>("1");

  readonly disabled = input<boolean>(false);

  readonly _form = input<{
    conclusion: boolean;
    conclusionText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
