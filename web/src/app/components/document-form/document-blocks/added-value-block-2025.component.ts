import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-added-value-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Уровень добавленной стоимости на одного работающего по инновационному проекту,
        соответствующий году, следующему за годом выхода на проектную мощность, евро:
      </label>
      <input [(ngModel)]="_form().addedValue" min="0" numberInput type="text" class="form-control"
        title="Уровень добавленной стоимости"
        placeholder="сумма в евро"
        name="addedValue"
        required
        (ngModelChange)="onConditionsChanged.emit(true)">
        @if (full()) {
          <textarea
            [(ngModel)]="_form().addedValueText"
            [attr.name]="'addedValueText_' + num().split('.').join('_')"
            required
            minlength="30"
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

    readonly _form = input<{
    addedValue: number;
    addedValueText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}