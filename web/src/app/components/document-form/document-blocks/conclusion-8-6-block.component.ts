import {Component, input} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-6-block',
    template: `
    <div class="form-sub-group">
      <label>
        Заключение эксперта по объекту государственной экспертизы:
      </label>
      <app-boolean-button [ngModel]="_form().accordance && _form().effectAccordance"
                          [disabled]="true"
                          [showDisabledSelection]="true"
                          [trueLabel]="'положительное'"
                          [falseLabel]="'отрицательное'"></app-boolean-button>
      <div class="hint">
        <p>
          <b>Подсказка.</b>
          Экспертное заключение считается <b>положительным</b>, если в предыдущих двух пунктах
          указано <b>"соответствует"</b>, иначе оно считается <b>отрицательным</b>.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_6_BlockComponent {

  readonly _form = input<{
    effectAccordance: boolean;
    accordance: boolean;
}>(undefined);
}
