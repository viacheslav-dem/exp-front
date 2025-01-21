import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-percentage-of-export-to-import',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}.Импортозамещающая ориентированность товара (соотношение показателей экспорта к импорту):
      </label>
      <textarea [(ngModel)]="_form.percentageOfExportToImport" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class PercentageOfExportToImportBlockComponent {

    @Input()
    num: string = '9.2';

    @Input()
    full: boolean = true;

    @Input()
    _form: { percentageOfExportToImport: string};

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
