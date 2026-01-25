import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-import-orientation-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Импортозамещающая ориентированность товара:
      </label><br>
      <input type="hidden" [ngModel]="_form()?.importOrientation" name="importOrientation" required>
      <app-boolean-button [ngModel]="_form()?.importOrientation" [trueLabel]="'соответствует'"
        [falseLabel]="'не соответствует'"
      (ngModelChange)="emitPatch({ importOrientation: $event })"></app-boolean-button>
      @if (full() || _form()?.importOrientation) {
        <textarea
          [ngModel]="_form()?.importOrientationText"
          (ngModelChange)="emitPatch({ importOrientationText: $event })"
          [attr.name]="'importOrientationText_' + num().split('.').join('_')"
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
export class ImportOrientationBlockComponent {

    readonly num = input<string>("9.4");

    readonly full = input<boolean>(true);

    readonly _form = input<ImportOrientationBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<ImportOrientationBlockForm>>();

    emitPatch(patch: Partial<ImportOrientationBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type ImportOrientationBlockForm = {
  importOrientation: boolean;
  importOrientationText: string;
};
