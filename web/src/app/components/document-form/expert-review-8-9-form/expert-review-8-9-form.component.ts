import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from "@app/services/data.service";

@Component({
  selector: 'app-review-8-9-form',
  templateUrl: './expert-review-8-9-form.component.html'
})
export class ExpertReview_8_9_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.marketing) ||
      isEmptyOrNull(this._form.investments) ||
      isEmptyOrNull(this._form.costJustification) ||
      isEmptyOrNull(this._form.application) ||
      isEmptyOrNull(this._form.optimality) ||
      isEmptyOrNull(this._form.technologyLevel) ||
      isEmptyOrNull(this._form.consequences)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
