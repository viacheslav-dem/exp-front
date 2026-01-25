import {Component, input, output} from '@angular/core';

@Component({
    selector: 'app-product-name-block',
    template: `
    <div class="form-sub-group">
      <label>
        Наименование товаров (работ, услуг):
      </label>
      <textarea
        [ngModel]="_form()?.productName"
        (ngModelChange)="emitPatch({ productName: $event })"
        name="productName"
        required
        rows="2"
        class="form-control"
        title="Наименование товаров"
        placeholder="наименование"
      ></textarea>
    </div>
  `,
    standalone: false
})
export class ProductNameBlockComponent {

  readonly _form = input<ProductNameBlockForm>(undefined);

  readonly onConditionsChanged = output<boolean>();
  readonly formPatch = output<Partial<ProductNameBlockForm>>();

  emitPatch(patch: Partial<ProductNameBlockForm>) {
    this.formPatch.emit(patch);
    this.onConditionsChanged.emit(true);
  }
}

type ProductNameBlockForm = {
  productName: string;
};
