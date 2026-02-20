import {Component, input, output} from '@angular/core';

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
      <textarea [ngModel]="_form()?.industrialExpertiseText" (ngModelChange)="emitPatch({ industrialExpertiseText: $event })" name="industrialExpertiseText" rows="3" class="form-control mt-05"
      placeholder="Пояснительный текст (при необходимости)."></textarea>
    }
    `,
    standalone: false
})
export class CreationIndustrialExpertiseBlock {

    readonly num = input<string>("1.3");

    readonly full = input<boolean>(true);

    readonly _form = input<CreationIndustrialExpertiseBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<CreationIndustrialExpertiseBlockForm>>();

    emitPatch(patch: Partial<CreationIndustrialExpertiseBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type CreationIndustrialExpertiseBlockForm = {
  industrialExpertiseText: string;
};
