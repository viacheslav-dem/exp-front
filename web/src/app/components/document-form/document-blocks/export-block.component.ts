import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-export-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Экспортная ориентированность инновационного проекта (превышение экспорта над импортом):
      </label>
      <app-boolean-button [ngModel]="_form.balance > 0"
                          [disabled]="true"
                          [showDisabledSelection]="true"
                          [trueLabel]="'да'"
                          [falseLabel]="'нет'"></app-boolean-button>
      <div *ngIf="full" class="hint">
        <p>
          <b>Подсказка.</b>
          Если в настоящем заключении значение в подпункте 2.4 больше нуля, то проект 
          <b>признается</b> экспортоориентированным, если менее или равно, то <b>не признается</b>.
        </p>
      </div>
    </div>
  `,
    standalone: false
})
export class ExportBlockComponent {

  @Input()
  num: string = "2.5";

  @Input()
  full: boolean = true;

  @Input()
  _form: { balance: number };
}
