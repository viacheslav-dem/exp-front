import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from "@app/services/data.service";

@Component({
  selector: 'app-review-8-11-14-form',
  templateUrl: './expert-review-8-11-14-form.component.html'
})
export class ExpertReview_8_11_14_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.significance) ||
      isEmptyOrNull(this._form.marketing) ||
      isEmptyOrNull(this._form.effect) ||
      isEmptyOrNull(this._form.users) ||
      isEmptyOrNull(this._form.characteristics) ||
      isEmptyOrNull(this._form.executorRequirements) ||
      isEmptyOrNull(this._form.assessment)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
