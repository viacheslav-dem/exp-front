import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-pvt-product-name-block',
    template: `
    <div class="form-sub-group">
      <label>
          {{num}}. Наименование товаров (работ, услуг) (наименование товаров (работ, услуг)
          с указанием в отношении товаров кода общегосударственного классификатора 
          Республики Беларусь ОКРБ 007-2012 “Классификатор продукции по видам экономической деятельности”, 
          утверждённого постановлением Государственного комитета по стандартизации Республики Беларусь от 28 декабря 2012 г. № 83,
          и в отношении товаров (работ, услуг) когда единой Товарной номенклатуры внешнеэкономической деятельности Евразийского экономического союза (далее – ТН ВЭД ЕАЭС)).
      </label>
      <textarea [(ngModel)]="_form.productName" rows="2" class="form-control"
                title="Наименование товаров"
                placeholder="наименование"></textarea>
    </div>
  `
})
export class PvtProductNamingBlockComponent {

    @Input()
    _form: { productName: string };

    @Input()
    num: string = "1";
}
