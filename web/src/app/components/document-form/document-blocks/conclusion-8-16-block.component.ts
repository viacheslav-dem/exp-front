import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-16-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>
      <app-boolean-button
        [(ngModel)]="_form.conclusion"
        [disabled]="disabled"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_16_BlockComponent {

    @Input()
    disabled: boolean = false;

    @Input()
    _form: { conclusion: boolean };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
