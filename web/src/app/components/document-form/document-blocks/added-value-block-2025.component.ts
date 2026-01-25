import {Component, input, output} from "@angular/core";

@Component({
    selector: 'app-added-value-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Уровень добавленной стоимости на одного работающего по инновационному проекту,
        соответствующий году, следующему за годом выхода на проектную мощность, евро:
      </label>
      <input
        [ngModel]="_form()?.addedValue"
        (ngModelChange)="emitPatch({ addedValue: $event })"
        min="0"
        numberInput
        type="text"
        class="form-control"
        title="Уровень добавленной стоимости"
        placeholder="сумма в евро"
        name="addedValue"
        required
      >
        @if (full()) {
          <textarea
            [ngModel]="_form()?.addedValueText"
            (ngModelChange)="emitPatch({ addedValueText: $event })"
            [name]="'addedValueText_' + num().split('.').join('_')"
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
              Эксперт должен проверить расчет уровня добавленной стоимости и указать его значение в евро по объекту государственной экспертизы
              с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится соответствующая информация
              по представленным материалам объекта государственной экспертизы; если в материалах по объекту государственной экспертизы
              отсутствует соответствующая информация, эксперт должен однозначно указать в данном пункте заключения фразу: «не представлено
              в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
            </p>
          </div>
        }
      </div>
    `,
    standalone: false
})
export class AddedValueBlock2025Component {

    readonly num = input<string>("2.2");

    readonly full = input<boolean>(true);

    readonly _form = input<AddedValueBlock2025Form>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<AddedValueBlock2025Form>>();

    emitPatch(patch: Partial<AddedValueBlock2025Form>) {
        // Иммутабельный путь: не мутируем input-форму, а просим контейнер применить patch.
        this.formPatch.emit(patch);
        // Оставляем событие для обратной совместимости (часть форм привязана к нему).
        this.onConditionsChanged.emit(true);
    }
}

type AddedValueBlock2025Form = {
    addedValue: number;
    addedValueText: string;
};