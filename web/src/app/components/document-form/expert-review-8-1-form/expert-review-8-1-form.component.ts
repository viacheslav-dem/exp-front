import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {Catalog} from "@app/services/data.service";

@Component({
  selector: 'app-review-8-1-form',
  templateUrl: './expert-review-8-1-form.component.html'
})
export class ExpertReview_8_1_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.accordance) ||
      isEmptyOrNull(this._form.knowledgeLevel) ||
      isEmptyOrNull(this._form.methodsNovelty) ||
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
