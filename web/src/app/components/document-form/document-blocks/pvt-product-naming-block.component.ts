import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-pvt-product-name-block',
    template: `
    <div class="form-sub-group">
      <label>
          {{num()}}. Наименование товаров (работ, услуг) (наименование товаров (работ, услуг)
          с указанием в отношении товаров кода общегосударственного классификатора 
          Республики Беларусь ОКРБ 007-2012 “Классификатор продукции по видам экономической деятельности”, 
          утверждённого постановлением Государственного комитета по стандартизации Республики Беларусь от 28 декабря 2012 г. № 83,
          и в отношении товаров (работ, услуг) когда единой Товарной номенклатуры внешнеэкономической деятельности Евразийского экономического союза (далее – ТН ВЭД ЕАЭС)).
      </label>
      <textarea [ngModel]="_form()?.productName" (ngModelChange)="emitPatch({ productName: $event })" name="productName" rows="2" class="form-control"
                title="Наименование товаров"
                placeholder="наименование"></textarea>
    </div>
  `,
    standalone: false
})
export class PvtProductNamingBlockComponent {

    readonly _form = input<PvtProductNamingBlockForm>(undefined);

    readonly num = input<string>("1");

    readonly onConditionsChanged = output<boolean>();
    readonly formPatch = output<Partial<PvtProductNamingBlockForm>>();

    emitPatch(patch: Partial<PvtProductNamingBlockForm>) {
      this.formPatch.emit(patch);
      this.onConditionsChanged.emit(true);
    }
}

type PvtProductNamingBlockForm = {
  productName: string;
};
