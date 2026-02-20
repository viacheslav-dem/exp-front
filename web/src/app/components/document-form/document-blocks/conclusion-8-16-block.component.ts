import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-conclusion-8-16-block',
    template: `
    <div class="form-group">

      <label class="font-weight-bold">
        Заключение эксперта по объекту государственной экспертизы
      </label>
      <input type="hidden" [ngModel]="_form()?.conclusion" name="conclusion" required>
      <app-boolean-button
        name="conclusion"
        required
        [ngModel]="_form()?.conclusion"
        [disabled]="disabled()"
        [showDisabledSelection]="true"
        [trueLabel]="'целесообразно'"
        [falseLabel]="'нецелесообразно'"
        (ngModelChange)="emitPatch({ conclusion: $event })"></app-boolean-button>
    </div>
  `,
    standalone: false
})
export class Conclusion_8_16_BlockComponent {

    readonly disabled = input<boolean>(false);

    readonly _form = input<Conclusion816BlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<Conclusion816BlockForm>>();

    emitPatch(patch: Partial<Conclusion816BlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type Conclusion816BlockForm = {
  conclusion: boolean;
};
