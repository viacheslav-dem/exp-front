import {Component, Input} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {Catalog} from "@app/services/data.service";
import {
  ExpertReview_8_8EAC_FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_8EAC_FormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {anyMatch} from "@app/support/utils";


@Component({
    selector: 'app-review-8-8EAC-form',
    templateUrl: './expert-review-8-8EAC-form.component.html',
    standalone: false
})
export class ExpertReview_8_8EAC_FormComponent extends ExpertReviewForm<ExpertReview_8_8EAC_FormContent> {

  validate() {
    // Инкрементальная миграция: обязательность и мин.длина выражены template-driven валидаторами в блоках,
    // чтобы контейнер гарантированно находил .ng-invalid и скроллил без зависимости от throw.
    super.validate();
  }

  override setForm(form: ExpertReview_8_8EAC_FormContent) {
    super.setForm(form);
    this.updateForm(f => ({ ...f, termsSuggestion: f.termsSuggestion || new PeriodDto() }));
  }
  Catalog = Catalog;

  onConditionsChanged() {
    if (this.isFinanceConclusionDisabled()) {
      this.patchForm({ financeConclusion: false });
    }
    this.patchForm({ conclusion: this.formValue().financeConclusion });
  }
  isFinanceConclusionDisabled() {
    const f = this.formValue();
    return !anyMatch(f.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
        || !anyMatch(f.economicSignificance, 'средняя', 'высокая');
  }
  ngOnInit() {
    super.ngOnInit();
    this.updateForm(f => ({ ...f, termsSuggestion: f.termsSuggestion || new PeriodDto() }));
  }
}
