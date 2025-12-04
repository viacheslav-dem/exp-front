import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {ExpertReview_8_13_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_13_NewFormContent";
import {isEmptyOrNull} from "@app/support/utils";

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
    let disabled = !this._form.prognosis
      || !this._form.programRequirements
      || !this._form.programSufficiency
      || !this._form.targetAnalysis
      || this._form.selectedDirections.length + this._form.selectedSocialEconomicGoals.length == 0;
    if (disabled) {
      this._form.conclusion = false;
    }
    return disabled;
  }

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.programRequirementsText)
        || isEmptyOrNull(this._form.prognosisText)
        || isEmptyOrNull(this._form.programSufficiencyText)
        || isEmptyOrNull(this._form.conclusionText)
        || isEmptyOrNull(this._form.targetAnalysisText)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
    if (this._form.programRequirementsText.length < 30
        || this._form.prognosisText.length < 30
        || this._form.targetAnalysisText.length < 30
        || this._form.programSufficiencyText.length < 30
        || this._form.conclusionText.length < 30
    ) {
      throw 'Длина сообщения меньше 30 символов';
    }
  }

  onConditionsChanged() {
    if (this.isConclusionDisabled()) {
      this._form.conclusion = false;
    }
  }
}
