import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-correspondence-of-product-name',
    template: `
    <div class="form-sub-group">
      <label>
        {{num}}. Наименование товара(ов) с указанием кода в соответствии
          с перечнем кодов продукции по видам экономической деятельности согласно приложению к Положению о порядке
          формирования перечня высокотехнологичных товаров, утвержденному постановлением Совета Министров Республики
          Беларусь от 1 июля 2022 г. № 435 (далее – Положение), шестизначного кода товара в соответствии с единой
          Товарной номенклатурой внешнеэкономической деятельности Евразийского экономического союза (далее – ТН ВЭД
          ЕАЭС), к которому относится товар:
      </label>
      <textarea [(ngModel)]="_form.correspondenceOfProductName" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `
})
export class CorrespondenceOfProductNameComponent {

    @Input()
    num: string = '9.2';

    @Input()
    full: boolean = true;

    @Input()
    _form: { correspondenceOfProductName: string};

    @Output()
    onConditionsChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
}
