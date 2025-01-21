import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {ExpertReview_8_10PIT_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_10PIT_NewFormContent";

@Component({
  selector: 'app-review-8-10PIT-new-form',
  templateUrl: './expert-review-8-10PIT-new-form.component.html'
})
export class ExpertReview_8_10PIT_NewFormComponent extends ExpertReviewForm<ExpertReview_8_10PIT_NewFormContent> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.productName)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }

  createNewForm(): ExpertReview_8_10PIT_NewFormContent {
    return new ExpertReview_8_10PIT_NewFormContent();
  }

  onConditionsChanged() {
  }
}
