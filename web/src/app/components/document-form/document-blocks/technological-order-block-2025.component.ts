import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-technological-order-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Уровень технологического уклада научно-технической продукции:
      </label>
      <app-dropdown [options]="targetOptions" [(ngModel)]="_form.technologicalOrder"
      (ngModelChange)="onConditionsChanged.emit(true)"></app-dropdown>
      @if (full) {
        <textarea [(ngModel)]="_form.technologicalOrderText" rows="3" class="form-control mt-05"
        placeholder="Обязательный текст"></textarea>
      }
      @if (full) {
        <div class="hint">
          <p>
            <b>Подсказка.</b>
            Эксперт указывает соответствие уровня технологического уклада научно-технической продукции V или VI технологическому укладу и
            кодам Международной патентной классификации, приведенным в Методических рекомендациях по отнесению технологий
            к V и VI технологическим укладам, утвержденных приказом Государственного комитета по науке и технологиям Республики Беларусь
            от 6 июня 2017 г. № 166, или другому технологическому укладу. Если в материалах по объекту государственной экспертизы
            отсутствует соответствующая информация, эксперт указывает в данном пункте заключения фразу: «Не представлено в материалах
            по объекту государственной экспертизы».
          </p>
        </div>
      }
    </div>
    `,
    standalone: false
})
export class TechnologicalOrderBlock2025Component {

    targetOptions: string[] = [
        'V технологический уклад ',
        'VI технологический уклад ',
        'проект другого технологического уклада'
    ];

    @Input()
    num: string = "2.1";

    @Input()
    full: boolean = true;

    @Input()
    _form: { technologicalOrder: string, technologicalOrderText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
