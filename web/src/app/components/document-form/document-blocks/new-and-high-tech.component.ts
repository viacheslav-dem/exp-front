import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-new-and-high-tech',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Новые и высокие технологии и (или) высокотехнологичные производства, используемые при производстве товаров :
      </label>
      <textarea [ngModel]="_form()?.correspondenceOfHighTechProduction" (ngModelChange)="emitPatch({ correspondenceOfHighTechProduction: $event })" name="correspondenceOfHighTechProduction" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class NewAndHighTechComponent {

    readonly num = input<string>('9.2');

    readonly full = input<boolean>(true);

    readonly _form = input<NewAndHighTechBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<NewAndHighTechBlockForm>>();

    emitPatch(patch: Partial<NewAndHighTechBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type NewAndHighTechBlockForm = {
  correspondenceOfHighTechProduction: string;
};
