import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-correspondence-of-product-name',
    template: `
    <div class="form-sub-group">
      <label>
        {{num()}}. Наименование товара(ов) с указанием кода в соответствии
          с перечнем кодов продукции по видам экономической деятельности согласно приложению к Положению о порядке
          формирования перечня высокотехнологичных товаров, утвержденному постановлением Совета Министров Республики
          Беларусь от 1 июля 2022 г. № 435 (далее – Положение), шестизначного кода товара в соответствии с единой
          Товарной номенклатурой внешнеэкономической деятельности Евразийского экономического союза (далее – ТН ВЭД
          ЕАЭС), к которому относится товар:
      </label>
      <textarea [ngModel]="_form()?.correspondenceOfProductName" (ngModelChange)="emitPatch({ correspondenceOfProductName: $event })" name="correspondenceOfProductName" rows="3" class="form-control mt-05"
                placeholder="Пояснительный текст (при необходимости)."></textarea>
    </div>
  `,
    standalone: false
})
export class CorrespondenceOfProductNameComponent {

    readonly num = input<string>('9.2');

    readonly full = input<boolean>(true);

    readonly _form = input<CorrespondenceOfProductNameBlockForm>(undefined);

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<CorrespondenceOfProductNameBlockForm>>();

    emitPatch(patch: Partial<CorrespondenceOfProductNameBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type CorrespondenceOfProductNameBlockForm = {
  correspondenceOfProductName: string;
};
