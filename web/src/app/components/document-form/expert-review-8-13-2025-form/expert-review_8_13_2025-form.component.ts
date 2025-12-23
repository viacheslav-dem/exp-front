import { Component, OnInit } from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_13_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_13_2025FormContent";

@Component({
    selector: 'app-review-8-13-2025-form',
    templateUrl: './expert-review_8_13_2025-form.component.html',
    standalone: false
})
export class ExpertReview_8_13_2025FormComponent extends ExpertReviewForm<ExpertReview_8_13_2025FormContent> {

  isConclusionDisabled() {
    let disabled = !this._form.priorityAreas
        && !this._form.programRequirements
        && !this._form.prognosis
        && !this._form.targetAnalysis
        && !this._form.programSufficiency
       // || this._form.selectedDirections.length + this._form.selectedSocialEconomicGoals.length == 0;
    if (disabled) {
      this._form.conclusion = false;
    }
    return disabled;
  }

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }

  onConditionsChanged() {
    if (this.isConclusionDisabled()) {
      this._form.conclusion = false;
    }
  }

  createNewForm(): ExpertReview_8_13_2025FormContent {
    return new ExpertReview_8_13_2025FormContent();
  }

}

