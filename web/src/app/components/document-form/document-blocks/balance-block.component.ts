import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-balance-block',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сальдо потока денежных средств в свободно-конвертируемой валюте
        от текущей (операционной) деятельности, евро:
      </label>
      <input [(ngModel)]="_form().balance"
        [attr.name]="'balance_' + num().split('.').join('_')"
        required
        min="0" numberInput type="text" class="form-control"
        title="Сальдо потока денежных средств"
        placeholder="сумма в евро"
        (ngModelChange)="onConditionsChanged.emit(true)">
        @if (full()) {
          <textarea
            [(ngModel)]="_form().balanceText"
            [attr.name]="'balanceText_' + num().split('.').join('_')"
            required
            minlength="30"
            rows="3"
            class="form-control mt-05"
            placeholder="Обязательный текст (не менее 30 символов)."
          ></textarea>
        }
        @if (full()) {
          <div class="hint">
            <p>
              <b>Подсказка.</b>
              Проверьте расчет сальдо потока денежных средств и укажите его значение в евро по объекту государственной экспертизы.
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
export class BalanceBlockComponent {

  readonly num = input<string>("2.4");

  readonly full = input<boolean>(true);

  readonly _form = input<{
    balance: number;
    balanceText: string;
}>(undefined);

  readonly onConditionsChanged = output<boolean>();
}
