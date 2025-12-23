import { Component, OnInit } from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_11_14_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_11_14_NewFormContent";
import {
  ExpertReview_8_14_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_14_2025FormContent";

@Component({
    selector: 'app-expert-review_8_14_2025-form',
    templateUrl: './expert-review_8_14_2025-form.component.html',
    standalone: false
})
export class ExpertReview_8_14_2025FormComponent extends ExpertReviewForm<ExpertReview_8_14_2025FormContent> {

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }

  createNewForm(): ExpertReview_8_14_2025FormContent {
    return new ExpertReview_8_14_2025FormContent();
  }

  onConditionsChanged() {
  }

}