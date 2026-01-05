import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-pvt-cof-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Величина значения коэффициента технологичности товара (работы, услуги):
      </label>
      @if (full()) {
        <textarea [(ngModel)]="_form().cofTech" name="cofTech" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class PvtAgendaCofTechBlockComponent {

    readonly num = input<string>("6");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    cofTech: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
