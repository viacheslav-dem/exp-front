import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-export-balance-block',
    template: `
    <div class="form-sub-group">
    
      <label>
        {{num}}. Экспортная ориентированность инновационного проекта (превышение экспорта над импортом):
      </label>
      <app-boolean-button [ngModel]="_form.exportBalance > 0"
        [disabled]="disabled"
        [showDisabledSelection]="true"
        [trueLabel]="'да'"
      [falseLabel]="'нет'"></app-boolean-button>
      @if (full) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Необходимо сделать вывод об экспортной ориентированности объекта государственной экспертизы;
            если в настоящем заключении значение в пункте 2.1 больше нуля,
            то объект государственной экспертизы признается экспортоориентированным, если менее или равно, то нет.
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class ExportBalanceBlockComponent {

    @Input()
    num: string = "2.5";

    @Input()
    full: boolean = true;
    @Input()
    disabled: boolean = true;

    @Input()
    _form: { exportBalance: number };
}
