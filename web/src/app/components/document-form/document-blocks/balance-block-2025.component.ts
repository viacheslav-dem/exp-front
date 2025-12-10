import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-balance-block-2025',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Сальдо потока денежных средств в свободно-конвертируемой валюте
        от текущей (операционной) деятельности, евро:
      </label>
      <input [(ngModel)]="_form.balance" min="0" numberInput type="text" class="form-control"
        title="Сальдо потока денежных средств"
        placeholder="сумма в евро"
        (ngModelChange)="onConditionsChanged.emit(true)">
        @if (full) {
          <textarea [(ngModel)]="_form.balanceText" rows="3" class="form-control mt-05"
          placeholder="Обязательный текст"></textarea>
        }
        @if (full) {
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

    @Input()
    num: string = "2.4";

    @Input()
    full: boolean = true;

    @Input()
    _form: { balance: number, balanceText: string };

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
