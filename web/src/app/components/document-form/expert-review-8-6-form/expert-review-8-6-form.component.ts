import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";

@Component({
    selector: 'app-review-8-6-form',
    templateUrl: './expert-review-8-6-form.component.html',
    standalone: false
})
export class ExpertReview_8_6_FormComponent extends ExpertReviewForm<any> {

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }
}
