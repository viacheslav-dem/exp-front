import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-creation-industrial-expertise-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Создание объекта права промышленной собственности при реализации объекта государственной
          экспертизы
      </label>
      </div>
      <textarea *ngIf="full" [(ngModel)]="_form.industrialExpertiseText" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
  `
})
export class CreationIndustrialExpertiseBlock {

    @Input()
    num: string = "1.3";

    @Input()
    full: boolean = true;

    @Input()
    _form: { industrialExpertiseText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
