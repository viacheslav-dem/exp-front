import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {ExpertReview_8_13_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_13_NewFormContent";

@Component({
    selector: 'app-review-8-13-new-form',
    templateUrl: './expert-review-8-13-new-form.component.html',
    standalone: false
})
export class ExpertReview_8_13_NewFormComponent extends ExpertReviewForm<ExpertReview_8_13_NewFormContent> {

  createNewForm(): ExpertReview_8_13_NewFormContent {
    return new ExpertReview_8_13_NewFormContent();
  }

  isConclusionDisabled() {
    const f = this.formValue();
    const disabled = !f.prognosis
      || !f.programRequirements
      || !f.programSufficiency
      || !f.targetAnalysis
      || (f.selectedDirections?.length ?? 0) + (f.selectedSocialEconomicGoals?.length ?? 0) === 0;
    if (disabled) {
      this.patchForm({ conclusion: false });
    }
    return disabled;
  }

  validate() {
    // Инкрементальная миграция: required/minlength реализованы через template-driven validators в блоках,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }

  onConditionsChanged() {
    if (this.isConclusionDisabled()) {
      this.patchForm({ conclusion: false });
    }
  }
}
