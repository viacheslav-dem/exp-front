import {Component, Input} from '@angular/core';
import {IndustryDto} from "@app/dto/IndustryDto";

@Component({
    selector: 'app-added-value-in-bound-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Организация технологического процесса, обеспечивающего средний уровень добавленной стоимости на одного
        работающего, аналогичный среднему уровню добавленной стоимости на одного работающего по соответствующему виду
        экономической деятельности в Европейском союзе либо превышающий этот уровень:
      </label>
      <app-boolean-button [ngModel]="_form.addedValue >= _form.section?.addedValueBound"
        [disabled]="true"
        [showDisabledSelection]="true"
        [trueLabel]="'соответствует'"
      [falseLabel]="'не соответствует'"></app-boolean-button>
      @if (full) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Если в настоящем заключении значение в подпункте 2.2 больше или равно значения в подпункте 2.1,
            то <b>соответствует</b>, если менее, то <b>не соответствует</b>.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class AddedValueInBoundBlockComponent {

  @Input()
  num: string = "2.3";

  @Input()
  full: boolean = true;

  @Input()
  _form: { addedValue: number, section: IndustryDto };
}
