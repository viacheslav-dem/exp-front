import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {ExpertReview_8_5_7_8_12IP_NewFormContent} from "@app/components/document-form/form-model/ExpertReview_8_5_7_8_12IP_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
  selector: 'app-review-8-5-7-8-12IP-new-form',
  templateUrl: './expert-review-8-5-7-8-12IP-new-form.component.html'
})
export class ExpertReview_8_5_7_8_12IP_NewFormComponent extends ExpertReviewForm<ExpertReview_8_5_7_8_12IP_NewFormContent> {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.novelty)
      || isEmptyOrNull(this._form.scientificLevel)
      || isEmptyOrNull(this._form.economicSignificance)
      || this._form.section == null
      || this._form.balance == null
      || isEmptyOrNull(this._form.consequences)
      || isEmptyOrNull(this._form.resourcesSufficiency)
      || isEmptyOrNull(this._form.competenceSufficiency)
      || isEmptyOrNull(this._form.marketingResearch)
      || isEmptyOrNull(this._form.marketingResearchText)
      || isEmptyOrNull(this._form.analog)
      || isEmptyOrNull(this._form.analogParamsText)
      || isEmptyOrNull(this._form.risks)
      || isEmptyOrNull(this._form.privacyObjectsDescription)
      || isEmptyOrNull(this._form.financeAccordanceText)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
    if (this._form.addedValue < 0) {
      throw 'Добавленная стоимость не может быть меньше нуля.'
    }
    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
    }
  }

  createNewForm(): ExpertReview_8_5_7_8_12IP_NewFormContent {
    return new ExpertReview_8_5_7_8_12IP_NewFormContent();
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

  setForm(form: ExpertReview_8_5_7_8_12IP_NewFormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    this._form.scientificLevelItems = this._form.scientificLevelItems || [];
  }
}
