import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-product-name-block',
    template: `
    <div class="form-sub-group">
      <label>
        Наименование товаров (работ, услуг):
      </label>
      <textarea [(ngModel)]="_form.productName" rows="2" class="form-control"
                title="Наименование товаров"
                placeholder="наименование"></textarea>
    </div>
  `,
    standalone: false
})
export class ProductNameBlockComponent {

  @Input()
  _form: { productName: string };
}
