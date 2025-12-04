import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-review-8-2-form',
    templateUrl: './expert-review-8-2-form.component.html',
    standalone: false
})
export class ExpertReview_8_2_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.significance) ||
      isEmptyOrNull(this._form.plansSignificance) ||
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
