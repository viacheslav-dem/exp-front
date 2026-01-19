import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-16-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>
      <app-boolean-button
        name="conclusion"
        required
        [(ngModel)]="_form().conclusion"
        [disabled]="disabled()"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="onConditionsChanged.emit(true)"></app-boolean-button>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_16_BlockComponent {

    readonly disabled = input<boolean>(false);

    readonly _form = input<{
    conclusion: boolean;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();
}
