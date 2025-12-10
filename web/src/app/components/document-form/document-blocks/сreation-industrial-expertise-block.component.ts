import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-creation-industrial-expertise-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Создание объекта права промышленной собственности при реализации объекта государственной
        экспертизы
      </label>
    </div>
    @if (full()) {
      <textarea [(ngModel)]="_form().industrialExpertiseText" rows="3" class="form-control mt-05"
      placeholder="Пояснительный текст (при необходимости)."></textarea>
    }
    `,
    standalone: false
})
export class CreationIndustrialExpertiseBlock {

    readonly num = input<string>("1.3");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    industrialExpertiseText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
