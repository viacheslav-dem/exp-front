import {Component, EventEmitter, Output, input} from '@angular/core';

@Component({
    selector: 'app-added-value-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Уровень добавленной стоимости на одного работающего по инновационному проекту,
        соответствующий году, следующему за годом выхода на проектную мощность, евро:
      </label>
      <input [(ngModel)]="_form().addedValue" min="0" numberInput type="text" class="form-control"
        title="Уровень добавленной стоимости"
        placeholder="сумма в евро"
        (ngModelChange)="onConditionsChanged.emit(true)">
        @if (full()) {
          <textarea [(ngModel)]="_form().addedValueText" rows="3" class="form-control mt-05"
          placeholder="Обязательный текст"></textarea>
        }
        @if (full()) {
          <div class="hint">
            <p>
              <b>Подсказка.</b>
              Проверьте расчет уровня добавленной стоимости и укажите его значение в евро по объекту государственной
              экспертизы.
            </p>
            <p>
              Укажите ссылки на наименования документов и номера страниц, в которых приводится соответствующая информация,
              или сделайте пометку "не представлено в материалах по объекту государственной экспертизы".
              Если информация отсутствует, дайте свою экспертную оценку по данному вопросу.
            </p>
          </div>
        }
      </div>
    `,
    standalone: false
})
export class AddedValueBlockComponent {

  readonly num = input<string>("2.2");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    addedValue: number;
    addedValueText: string;
}>(undefined);

  @Output()
  onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
