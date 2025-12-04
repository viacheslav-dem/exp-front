import {Component, input} from '@angular/core';

@Component({
    selector: 'app-export-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Экспортная ориентированность инновационного проекта (превышение экспорта над импортом):
      </label>
      <app-boolean-button [ngModel]="_form().balance > 0"
        [disabled]="true"
        [showDisabledSelection]="true"
        [trueLabel]="'да'"
      [falseLabel]="'нет'"></app-boolean-button>
      @if (full()) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Если в настоящем заключении значение в подпункте 2.4 больше нуля, то проект
            <b>признается</b> экспортоориентированным, если менее или равно, то <b>не признается</b>.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ExportBlockComponent {

  readonly num = input<string>("2.5");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    balance: number;
}>(undefined);
}
