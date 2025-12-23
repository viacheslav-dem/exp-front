import {Component, Input} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from "@app/services/data.service";
import {DocumentService} from "@app/services/document.service";
import {HttpClientSecure} from "@app/services/http.client";
import {
    ExpertReview_8_8BIF_FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_8BIF_FormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {anyMatch} from "@app/support/utils";


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
        // Инкрементальная миграция: обязательность и мин.длина выражены template-driven валидаторами в блоках,
        // чтобы контейнер гарантированно находил .ng-invalid и скроллил без зависимости от throw.
        super.validate();
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
