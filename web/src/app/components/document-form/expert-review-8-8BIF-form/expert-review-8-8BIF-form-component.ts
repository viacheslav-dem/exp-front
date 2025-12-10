import {Component, Input} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from "@app/services/data.service";
import {DocumentService} from "@app/services/document.service";
import {HttpClientSecure} from "@app/services/http.client";
import {
    ExpertReview_8_8BIF_FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_8BIF_FormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";


@Component({
    selector: 'app-review-8-8BIF-form',
    templateUrl: './expert-review-8-8BIF-form.component.html',
    standalone: false
})
export class ExpertReview_8_8BIF_FormComponent extends ExpertReviewForm<ExpertReview_8_8BIF_FormContent> {
    constructor(
        private _documentService: DocumentService,
        private _http: HttpClientSecure
    ) {
        super();
    }

    Catalog = Catalog;
    validate() {
        if (isEmptyOrNull(this._form.noveltyText)
            || isEmptyOrNull(this._form.scientificLevel)
            || isEmptyOrNull(this._form.noveltyExistsText)
            || isEmptyOrNull(this._form.technologyTypeText)
            || isEmptyOrNull(this._form.economicSignificanceText)
            || isEmptyOrNull(this._form.balanceText)
            || isEmptyOrNull(this._form.consequences)
            || isEmptyOrNull(this._form.resourcesSufficiencyText)
            || isEmptyOrNull(this._form.competenceSufficiencyText)
            || isEmptyOrNull(this._form.marketingResearchText)
            || isEmptyOrNull(this._form.analogText)
            || isEmptyOrNull(this._form.analogParamsText)
            || isEmptyOrNull(this._form.risksText)
            || isEmptyOrNull(this._form.privacyObjectsDescriptionText)
            || isEmptyOrNull(this._form.nameAccordanceText)
            || isEmptyOrNull(this._form.termsAccordanceText)
            || isEmptyOrNull(this._form.financeConclusionText)
        ) {
            throw 'Пожалуйста, заполните все поля заключения.';
        }
        if (this._form.noveltyText.length < 30
            || this._form.scientificLevel.length < 30
            || this._form.noveltyExistsText.length < 30
            || this._form.technologyTypeText.length < 30
            || this._form.economicSignificanceText.length < 30
            || this._form.balanceText.length < 30
            || this._form.consequences.length < 30
            || this._form.resourcesSufficiencyText.length < 30
            || this._form.competenceSufficiencyText.length < 30
            || this._form.marketingResearchText.length < 30
            || this._form.analogText.length < 30
            || this._form.analogParamsText.length < 30
            || this._form.risksText.length < 30
            || this._form.privacyObjectsDescriptionText.length < 30
            || this._form.nameAccordanceText.length < 30
            || this._form.termsAccordanceText.length < 30
            || this._form.financeConclusionText.length < 30) {
            throw 'Длина сообщения меньше 30 символов';
        }
    }
    onConditionsChanged() {
        if (this.isFinanceConclusionDisabled()) {
            this._form.financeConclusion = false;
        }
        this._form.conclusion = this._form.financeConclusion;
    }
    isFinanceConclusionDisabled() {
        return !anyMatch(this._form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
            || !anyMatch(this._form.economicSignificance, 'средняя', 'высокая');
    }
    ngOnInit() {
        super.ngOnInit();
        this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    }

}
