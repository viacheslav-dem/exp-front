import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-review-8-10PIT-form',
  templateUrl: './expert-review-8-10PIT-form.component.html'
})
export class ExpertReview_8_10PIT_FormComponent extends ExpertReviewForm<any> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.privacy) ||
      isEmptyOrNull(this._form.advantage) ||
      isEmptyOrNull(this._form.competitiveness)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
