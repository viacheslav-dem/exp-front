import {Component, EventEmitter, Output, input} from "@angular/core";

@Component({
    selector: 'app-balance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Сальдо потока денежных средств в свободно-конвертируемой валюте
        от текущей (операционной) деятельности, евро:
      </label>
      <input [(ngModel)]="_form().balance" min="0" numberInput type="text" class="form-control"
        title="Сальдо потока денежных средств"
        placeholder="сумма в евро"
        name="balance"
        required
        (ngModelChange)="onConditionsChanged.emit(true)">
        @if (full()) {
          <textarea
            [(ngModel)]="_form().balanceText"
            [attr.name]="'balanceText_' + num().split('.').join('_')"
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
              Эксперт должен проверить расчет сальдо потока денежных средств и указать его значение в евро по объекту государственной
              экспертизы с обязательным указанием ссылок на наименования документов и номера страниц, в которых приводится соответствующая
              информация по представленным материалам объекта государственной экспертизы; если в материалах по объекту государственной
              экспертизы отсутствует соответствующая информация, эксперт должен указать в данном пункте заключения фразу: «не представлено
              в материалах по объекту государственной экспертизы» и дать свою экспертную оценку по данному вопросу.
            </p>
          </div>
        }
      </div>
    `,
    standalone: false
})
export class BalanceBlock2025Component {

    readonly num = input<string>("2.4");

    readonly full = input<boolean>(true);

    readonly _form = input<{
    balance: number;
    balanceText: string;
}>(undefined);

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
