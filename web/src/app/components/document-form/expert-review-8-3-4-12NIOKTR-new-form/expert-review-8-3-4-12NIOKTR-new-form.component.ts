import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {ExpertReview_8_3_4_12NIOKTR_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_3_4_12NIOKTR_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
  selector: 'app-review-8-3-4-12NIOKTR-new-form',
  templateUrl: './expert-review-8-3-4-12NIOKTR-new-form.component.html'
})
export class ExpertReview_8_3_4_12NIOKTR_NewFormComponent extends ExpertReviewForm<ExpertReview_8_3_4_12NIOKTR_NewFormContent> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.novelty)
      || isEmptyOrNull(this._form.economicSignificance)
      || isEmptyOrNull(this._form.resourcesSufficiency)
      || isEmptyOrNull(this._form.competenceSufficiency)
      || isEmptyOrNull(this._form.marketingResearch)
      || isEmptyOrNull(this._form.risks)
      || isEmptyOrNull(this._form.privacyObjectsDescription)
      || isEmptyOrNull(this._form.stagesExist)
      || this.showTarget() && isEmptyOrNull(this._form.target)
      || isEmptyOrNull(this._form.competitiveness)
      || isEmptyOrNull(this._form.analog)
      || isEmptyOrNull(this._form.analogParams)
      || isEmptyOrNull(this._form.needs)
      || isEmptyOrNull(this._form.financeAccordanceText)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
    }
  }

  showTarget() {
    return this.project.code.code.startsWith('8.3');
  }

  createNewForm(): ExpertReview_8_3_4_12NIOKTR_NewFormContent {
    return new ExpertReview_8_3_4_12NIOKTR_NewFormContent();
  }

  isFinanceConclusionDisabled() {
    return !anyMatch(this._form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
      || !anyMatch(this._form.economicSignificance, 'средняя', 'высокая');
  }

  isConclusionDisabled() {
    return !this._form.financeConclusion;
  }

  onConditionsChanged() {
    if (this.isFinanceConclusionDisabled()) {
      this._form.financeConclusion = false;
    }
    if (this.isConclusionDisabled()) {
      this._form.conclusion = false;
    }
  }

  setForm(form: ExpertReview_8_3_4_12NIOKTR_NewFormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
  }
}
