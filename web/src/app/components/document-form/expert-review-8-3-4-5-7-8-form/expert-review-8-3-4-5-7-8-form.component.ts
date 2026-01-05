import {Component} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from '@app/services/data.service';

@Component({
    selector: 'app-review-8-3-4-5-7-8-form',
    templateUrl: './expert-review-8-3-4-5-7-8-form.component.html',
    standalone: false
})
export class ExpertReview_8_3_4_5_7_8_FormComponent extends ExpertReviewForm<any> {

  Catalog = Catalog;

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
  }
}
