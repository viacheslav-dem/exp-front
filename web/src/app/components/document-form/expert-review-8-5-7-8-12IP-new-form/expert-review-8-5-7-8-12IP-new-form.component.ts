import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {anyMatch} from "@app/support/utils";
import {
  ExpertReview_8_5_7_8_12IP_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_5_7_8_12IP_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
    selector: 'app-review-8-5-7-8-12IP-new-form',
    templateUrl: './expert-review-8-5-7-8-12IP-new-form.component.html',
    standalone: false
})
export class ExpertReview_8_5_7_8_12IP_NewFormComponent extends ExpertReviewForm<ExpertReview_8_5_7_8_12IP_NewFormContent> {

    validate() {
        // Инкрементальная миграция: обязательность/мин.длина/мин.значения выражены template-driven валидаторами в блоках
        // (включая min для input[numberInput]), чтобы контейнер гарантированно находил .ng-invalid и скроллил без throw.
        super.validate();
    }

    createNewForm(): ExpertReview_8_5_7_8_12IP_NewFormContent {
        return new ExpertReview_8_5_7_8_12IP_NewFormContent();
    }

    isFinanceConclusionDisabled() {
        const f = this.formValue();
        return !anyMatch(f.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
            || !anyMatch(f.economicSignificance, 'средняя', 'высокая');
    }

    isConclusionDisabled() {
        return !this.formValue().financeConclusion;
    }

    onConditionsChanged() {
        if (this.isFinanceConclusionDisabled()) {
            this.patchForm({ financeConclusion: false });
        }
        if (this.isConclusionDisabled()) {
            this.patchForm({ conclusion: false });
        }
    }

    override setForm(form: ExpertReview_8_5_7_8_12IP_NewFormContent) {
        super.setForm(form);
        this.updateForm(f => ({
            ...f,
            termsSuggestion: f.termsSuggestion || new PeriodDto(),
            scientificLevelItems: f.scientificLevelItems || [],
        }));
    }
}
