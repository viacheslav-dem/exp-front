import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-pvt-cof-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Величина значения коэффициента технологичности товара (работы, услуги):
      </label>
      @if (full()) {
        <textarea [ngModel]="_form()?.cofTech" (ngModelChange)="emitPatch({ cofTech: $event })" name="cofTech" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class PvtAgendaCofTechBlockComponent {

    readonly num = input<string>("6");

    readonly full = input<boolean>(true);

    readonly _form = input<PvtAgendaCofTechBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<PvtAgendaCofTechBlockForm>>();

    emitPatch(patch: Partial<PvtAgendaCofTechBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type PvtAgendaCofTechBlockForm = {
  cofTech: string;
};
