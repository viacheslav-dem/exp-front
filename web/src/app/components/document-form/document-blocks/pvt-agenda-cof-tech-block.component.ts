import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-pvt-cof-tech-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Величина значения коэфициентп технологичности товара (работы, услуги):
      </label>
      <textarea *ngIf="full" [(ngModel)]="_form.cofTech" rows="3" class="form-control"
                placeholder="Пояснительный текст (при необходимости)." pattern="[0-9]+"></textarea>
    </div>
  `
})
export class PvtAgendaCofTechBlockComponent {

    @Input()
    num: string = "6";

    @Input()
    full: boolean = true;

    @Input()
    _form: {
        cofTech: string;
    };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
