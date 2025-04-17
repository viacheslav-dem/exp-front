import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {
  ExpertReview_8_5_7_8_12IP_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_5_7_8_12IP_NewFormContent";
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
            || isEmptyOrNull(this._form.noveltyText)
            || isEmptyOrNull(this._form.noveltyExistsText)
            || isEmptyOrNull(this._form.technologyTypeText)
            || isEmptyOrNull(this._form.economicSignificanceText)
            || isEmptyOrNull(this._form.sectionText)
            || isEmptyOrNull(this._form.addedValueText)
            || isEmptyOrNull(this._form.balanceText)
            || isEmptyOrNull(this._form.constructionWorksText)
            || isEmptyOrNull(this._form.projectDocsText)
            || isEmptyOrNull(this._form.neededProjectDocsText)
            || isEmptyOrNull(this._form.resourcesSufficiencyText)
            || isEmptyOrNull(this._form.competenceSufficiencyText)
            || isEmptyOrNull(this._form.analogText)
            || isEmptyOrNull(this._form.risksText)
            || isEmptyOrNull(this._form.privacyObjectsDescriptionText)
            || isEmptyOrNull(this._form.nameAccordanceText)
            || isEmptyOrNull(this._form.termsAccordanceText)
            || isEmptyOrNull(this._form.financeConclusionText)
            || isEmptyOrNull(this._form.targetAccordanceText)
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

        if (this._form.noveltyText.length < 30
            || this._form.noveltyExistsText.length < 30
            || this._form.technologyTypeText.length < 30
            || this._form.economicSignificanceText.length < 30
            || this._form.sectionText.length < 30
            || this._form.addedValueText.length < 30
            || this._form.balanceText.length < 30
            || this._form.constructionWorksText.length < 30
            || this._form.projectDocsText.length < 30
            || this._form.neededProjectDocsText.length < 30
            || this._form.resourcesSufficiencyText.length < 30
            || this._form.competenceSufficiencyText.length < 30
            || this._form.analogText.length < 30
            || this._form.risksText.length < 30
            || this._form.privacyObjectsDescriptionText.length < 30
            || this._form.nameAccordanceText.length < 30
            || this._form.termsAccordanceText.length < 30
            || this._form.financeConclusionText.length < 30
            || this._form.targetAccordanceText.length < 30
            || this._form.financeAccordanceText.length < 30
        ) {
            throw 'Длина сообщения меньше 30 символов';
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
