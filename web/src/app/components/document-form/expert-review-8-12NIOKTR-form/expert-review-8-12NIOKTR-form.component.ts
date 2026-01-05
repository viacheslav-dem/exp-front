import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from "@app/services/data.service";

@Component({
    selector: 'app-review-8-12NIOKTR-form',
    templateUrl: './expert-review-8-12NIOKTR-form.component.html',
    standalone: false
})
export class ExpertReview_8_12NIOKTR_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }
}
