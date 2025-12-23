import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {ExpertReview_8_11_14_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_11_14_NewFormContent";

@Component({
    selector: 'app-review-8-11-14-new-form',
    templateUrl: './expert-review-8-11-14-new-form.component.html',
    standalone: false
})
export class ExpertReview_8_11_14_NewFormComponent extends ExpertReviewForm<ExpertReview_8_11_14_NewFormContent> {

  validate() {
    // Инкрементальная миграция: required/minlength реализованы через template-driven validators в блоках,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }

  createNewForm(): ExpertReview_8_11_14_NewFormContent {
    return new ExpertReview_8_11_14_NewFormContent();
  }

  onConditionsChanged() {
  }
}
