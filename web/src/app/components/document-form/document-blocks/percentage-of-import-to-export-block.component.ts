import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-percentage-of-import-to-export',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}.Импортозамещающая ориентированность товара (соотношение показателей импорта к экспорту):
      </label>
      <textarea [(ngModel)]="_form.percentageOfImportToExport" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class PercentageOfImportToExportBlockComponent {

    @Input()
    num: string = '9.2';

    @Input()
    full: boolean = true;

    @Input()
    _form: { percentageOfImportToExport: string};

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
