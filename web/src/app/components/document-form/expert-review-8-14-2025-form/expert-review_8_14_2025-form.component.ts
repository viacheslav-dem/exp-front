import { Component, OnInit } from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_11_14_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_11_14_NewFormContent";
import {
  ExpertReview_8_14_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_14_2025FormContent";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-expert-review_8_14_2025-form',
  templateUrl: './expert-review_8_14_2025-form.component.html',
  standalone: false
})
export class ExpertReview_8_14_2025FormComponent extends ExpertReviewForm<ExpertReview_8_14_2025FormContent> {

  validate() {
    // Инкрементальная миграция: required/minlength/maxlength реализованы через template-driven validators в блоках,
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    this.validationConclusionAnalysisAndEvaluation();
  }

  createNewForm(): ExpertReview_8_14_2025FormContent {
    return new ExpertReview_8_14_2025FormContent();
  }

  onConditionsChanged() {
  }

  private validationConclusionAnalysisAndEvaluation() {
    const f = this.formValue();
    if (isEmptyOrNull(f.marketingResearch)) {
      throw "В пункте ' Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение."
    }
    if (isEmptyOrNull(f.privacyObjectsDescription)) {
      throw "В пункте '10. Создание объекта права промышленной собственности :' не выстановленно заключение."
    }
    if (isEmptyOrNull(f.stagesExist)) {
      throw "В пункте '12. Целесообразность государственной регистрации объекта государственной экспертизы в соответствии " +
      "с законодательством Республики Беларусь:' не выстановленно заключение."
    }
  }

}
