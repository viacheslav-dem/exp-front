import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-new-and-high-tech',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Новые и высокие технологии и (или) высокотехнологичные производства, используемые при производстве товаров :
      </label>
      <textarea [(ngModel)]="_form.correspondenceOfHighTechProduction" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class NewAndHighTechComponent {

    @Input()
    num: string = '9.2';

    @Input()
    full: boolean = true;

    @Input()
    _form: { correspondenceOfHighTechProduction: string};

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
