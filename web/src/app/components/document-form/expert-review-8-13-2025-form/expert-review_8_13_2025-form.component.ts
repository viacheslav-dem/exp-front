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
    const form = this.formValue();
    const disabled = !form.priorityAreas
        && !form.programRequirements
        && !form.prognosis
        && !form.targetAnalysis
        && !form.programSufficiency;
    if (disabled) {
      this.patchForm({ conclusion: false } as Partial<ExpertReview_8_13_2025FormContent>);
    }
    return disabled;
  }

  validate() {
    // Инкрементальная миграция: required/minlength/maxlength реализованы через template-driven validators в блоках,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }

  onConditionsChanged() {
    this.markFormChanged();
    if (this.isConclusionDisabled()) {
      this.patchForm({ conclusion: false } as Partial<ExpertReview_8_13_2025FormContent>);
    }
  }

  createNewForm(): ExpertReview_8_13_2025FormContent {
    return new ExpertReview_8_13_2025FormContent();
  }
}

