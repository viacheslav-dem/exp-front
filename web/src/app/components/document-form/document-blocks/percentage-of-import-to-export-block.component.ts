import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-percentage-of-import-to-export',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}.Импортозамещающая ориентированность товара (соотношение показателей импорта к экспорту):
      </label>
      <textarea [(ngModel)]="_form().percentageOfImportToExport" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class PercentageOfImportToExportBlockComponent {

    readonly num = input<string>('9.2');

    readonly full = input<boolean>(true);

    readonly _form = input<{
    percentageOfImportToExport: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
