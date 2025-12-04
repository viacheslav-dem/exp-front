import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
    selector: 'app-review-8-6-form',
    templateUrl: './expert-review-8-6-form.component.html',
    standalone: false
})
export class ExpertReview_8_6_FormComponent extends ExpertReviewForm<any> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.results) ||
      isEmptyOrNull(this._form.effectiveness)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
