import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-cof-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Значение коэффициента технологичности товара (работы, услуги), рассчитанного по формуле, указанной в пункте 5 Инструкции):
      </label>
      @if (full()) {
        <textarea [(ngModel)]="_form().cofTech" name="cofTech" rows="3" class="form-control"
        placeholder="Пояснительный текст (при необходимости)."></textarea>
      }
    </div>
    `,
    standalone: false
})
export class CofTechBlockComponent {

    readonly num = input<string>("6");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    cofTech: string;
}>(undefined);

    readonly onConditionsChanged = output<boolean>();
}
