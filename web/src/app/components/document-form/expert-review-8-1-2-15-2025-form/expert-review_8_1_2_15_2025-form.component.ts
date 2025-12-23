import { Component, OnInit } from '@angular/core';
import {anyMatch} from "@app/support/utils";
import {
  ExpertReview_8_1_2_15_NewFormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_NewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_1_2_15_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_1_2_15_2025FormContent";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-expert-review-8-1-2-15-2025-form',
    templateUrl: './expert-review_8_1_2_15_2025-form.component.html',
    standalone: false
})
export class ExpertReview_8_1_2_15_2025FormComponent extends ExpertReviewForm<ExpertReview_8_1_2_15_2025FormContent> {

  noveltyOptions: string[] = [];

  constructor(private _dataService: DataService) {
    super();
  }

  ngOnInit() {
    this._dataService.getCommercializationMethods().subscribe(res => {
      res.forEach(option => this.noveltyOptions.push(option.name))
    })
  }

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    // Проверка financeSuggestion < 0 оставлена через throw, так как это числовое поле и валидируется через min="0" в numberInput
    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.'
    }
  }




  createNewForm(): ExpertReview_8_1_2_15_2025FormContent {
    return new ExpertReview_8_1_2_15_2025FormContent();
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

  setForm(form: ExpertReview_8_1_2_15_2025FormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
  }
}

