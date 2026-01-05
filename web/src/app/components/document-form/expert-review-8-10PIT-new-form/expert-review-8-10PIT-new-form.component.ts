import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
    ExpertReview_8_10PIT_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_10PIT_NewFormContent";

@Component({
    selector: 'app-review-8-10PIT-new-form',
    templateUrl: './expert-review-8-10PIT-new-form.component.html',
    standalone: false
})
export class ExpertReview_8_10PIT_NewFormComponent extends ExpertReviewForm<ExpertReview_8_10PIT_NewFormContent> {

    validate() {
        // Инкрементальная миграция: обязательность и мин.длина выражены template-driven валидаторами в блоках,
        // чтобы контейнер гарантированно находил .ng-invalid и скроллил без зависимости от throw.
        super.validate();
    }

    createNewForm(): ExpertReview_8_10PIT_NewFormContent {
        return new ExpertReview_8_10PIT_NewFormContent();
    }

    onConditionsChanged() {
    }
}
