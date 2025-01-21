import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from '@app/services/data.service';

@Component({
  selector: 'app-review-8-3-4-5-7-8-form',
  templateUrl: './expert-review-8-3-4-5-7-8-form.component.html'
})
export class ExpertReview_8_3_4_5_7_8_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.significance) ||
      isEmptyOrNull(this._form.marketing) ||
      isEmptyOrNull(this._form.novelty) ||
      isEmptyOrNull(this._form.need) ||
      isEmptyOrNull(this._form.methods) ||
      isEmptyOrNull(this._form.potential) ||
      isEmptyOrNull(this._form.experience) ||
      isEmptyOrNull(this._form.financeBase) ||
      isEmptyOrNull(this._form.monitoring)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
