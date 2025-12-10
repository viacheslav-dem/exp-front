import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-review-8-12NIOKTR-form',
    templateUrl: './expert-review-8-12NIOKTR-form.component.html',
    standalone: false
})
export class ExpertReview_8_12NIOKTR_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.significance) ||
      isEmptyOrNull(this._form.scientificLevel) ||
      isEmptyOrNull(this._form.expedience) ||
      isEmptyOrNull(this._form.efficiency) ||
      isEmptyOrNull(this._form.realization) ||
      isEmptyOrNull(this._form.socialEffects) ||
      isEmptyOrNull(this._form.economicEffects) ||
      isEmptyOrNull(this._form.ecologicEffects) ||
      isEmptyOrNull(this._form.marketing)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
