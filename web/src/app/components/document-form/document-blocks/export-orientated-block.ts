import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-export-orientated-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Экспортная ориентированность товара:
      </label><br>
      <input type="hidden" [ngModel]="_form()?.exportOrientation" name="exportOrientation" required>
      <app-boolean-button [ngModel]="_form()?.exportOrientation" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ exportOrientation: $event })"></app-boolean-button>
      @if (full() || _form()?.exportOrientation) {
        <textarea
          [ngModel]="_form()?.exportOrientationText"
          (ngModelChange)="emitPatch({ exportOrientationText: $event })"
          [attr.name]="'exportOrientationText_' + num().split('.').join('_')"
          required
          minlength="30"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)."
        ></textarea>
      }
    </div>
    `,
    standalone: false
})
export class ExportOrientatedBlockComponent {

    readonly num = input<string>("9.3");

    readonly full = input<boolean>(true);

    readonly _form = input<ExportOrientatedBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ExportOrientatedBlockForm>>();

    emitPatch(patch: Partial<ExportOrientatedBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ExportOrientatedBlockForm = {
  exportOrientation: boolean;
  exportOrientationText: string;
};
