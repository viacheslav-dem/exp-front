import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {anyMatch} from "@app/support/utils";
import {
  ExpertReview_8_1_2_15_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
    selector: 'app-review-8-1-2-15-new-form',
    templateUrl: './expert-review-8-1-2-15-new-form.component.html',
    standalone: false
})
export class ExpertReview_8_1_2_15_NewFormComponent extends ExpertReviewForm<ExpertReview_8_1_2_15_NewFormContent> {

    validate() {
        // Инкрементальная миграция: обязательность/мин.длина/мин.значения выражены template-driven валидаторами в блоках
        // (включая min для input[numberInput]), чтобы контейнер гарантированно находил .ng-invalid и скроллил без throw.
        super.validate();
    }

    createNewForm(): ExpertReview_8_1_2_15_NewFormContent {
        return new ExpertReview_8_1_2_15_NewFormContent();
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

    setForm(form: ExpertReview_8_1_2_15_NewFormContent) {
        super.setForm(form);
        this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    }
}
