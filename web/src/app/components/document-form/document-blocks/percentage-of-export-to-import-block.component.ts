import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-percentage-of-export-to-import',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}.Импортозамещающая ориентированность товара (соотношение показателей экспорта к импорту):
      </label>
      <textarea [ngModel]="_form()?.percentageOfExportToImport" (ngModelChange)="emitPatch({ percentageOfExportToImport: $event })" name="percentageOfExportToImport" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class PercentageOfExportToImportBlockComponent {

    readonly num = input<string>('9.2');

    readonly full = input<boolean>(true);

    readonly _form = input<PercentageOfExportToImportBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<PercentageOfExportToImportBlockForm>>();

    emitPatch(patch: Partial<PercentageOfExportToImportBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type PercentageOfExportToImportBlockForm = {
  percentageOfExportToImport: string;
};
