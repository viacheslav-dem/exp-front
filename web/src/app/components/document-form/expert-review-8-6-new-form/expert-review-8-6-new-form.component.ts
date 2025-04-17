import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {isEmptyOrNull} from "@app/support/utils";
import {ExpertReview_8_6_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_6_NewFormContent";

@Component({
  selector: 'app-review-8-6-new-form',
  templateUrl: './expert-review-8-6-new-form.component.html'
})
export class ExpertReview_8_6_NewFormComponent extends ExpertReviewForm<ExpertReview_8_6_NewFormContent> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.results)
      || isEmptyOrNull(this._form.effectiveness)
        || isEmptyOrNull(this._form.accordanceText)
        || isEmptyOrNull(this._form.effectAccordanceText)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
    if (this._form.results.length < 30
        || this._form.effectiveness.length < 30
        || this._form.accordanceText.length < 30
        || this._form.effectAccordanceText.length < 30
    ) {
      throw 'Длина сообщения меньше 30 символов';
    }
  }

  createNewForm(): ExpertReview_8_6_NewFormContent {
    return new ExpertReview_8_6_NewFormContent();
  }

  onConditionsChanged() {
  }
}
