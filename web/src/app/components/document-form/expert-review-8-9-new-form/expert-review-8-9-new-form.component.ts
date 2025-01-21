import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {ExpertReview_8_9_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_9_NewFormContent";

@Component({
  selector: 'app-review-8-9-new-form',
  templateUrl: './expert-review-8-9-new-form.component.html'
})
export class ExpertReview_8_9_NewFormComponent extends ExpertReviewForm<ExpertReview_8_9_NewFormContent> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.scientificLevel)
      || isEmptyOrNull(this._form.priorityAccordance)
      || isEmptyOrNull(this._form.consequences)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }

  createNewForm(): ExpertReview_8_9_NewFormContent {
    return new ExpertReview_8_9_NewFormContent();
  }

  onConditionsChanged() {
  }
}
