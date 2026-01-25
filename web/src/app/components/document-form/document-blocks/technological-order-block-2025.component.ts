import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-technological-order-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Уровень технологического уклада научно-технической продукции:
      </label>
      <app-dropdown
        name="technologicalOrder"
        required
        [options]="targetOptions"
        [ngModel]="_form().technologicalOrder"
        (ngModelChange)="emitPatch({ technologicalOrder: $event })"
      ></app-dropdown>
      @if (full()) {
        <textarea
          [ngModel]="_form().technologicalOrderText"
          (ngModelChange)="emitPatch({ technologicalOrderText: $event })"
          name="technologicalOrderText"
          required
          minlength="30"
          maxlength="5000"
          rows="3"
          class="form-control mt-05"
          placeholder="Обязательный текст (не менее 30 символов)"
        ></textarea>
      }
      @if (full()) {
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

    readonly num = input<string>("2.1");

    readonly full = input<boolean>(true);

    readonly _form = input<TechnologicalOrderBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<TechnologicalOrderBlock2025Form>>();

    emitPatch(patch: Partial<TechnologicalOrderBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type TechnologicalOrderBlock2025Form = {
    technologicalOrder: string;
    technologicalOrderText: string;
};
