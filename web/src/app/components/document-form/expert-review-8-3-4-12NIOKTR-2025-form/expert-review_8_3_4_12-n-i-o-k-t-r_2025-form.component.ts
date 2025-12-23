import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ExpertReviewForm} from "@app/components/document-form/expert-review-form-container/expert-review-form";
import {
  ExpertReview_8_3_4_12NIOKTR_2025FormContent
} from "@app/components/document-form/form-model/ExpertReview_8_3_4_12NIOKTR_2025FormContent";
import {anyMatch} from "@app/support/utils";
import {PeriodDto} from "@app/dto/PeriodDto";
import {DataService} from "@app/services/data.service";
import {CatalogDto} from "@app/dto/CatalogDto";

@Component({
    selector: 'app-expert-review-8-3-4-12NIOKRT-2025-form',
    templateUrl: './expert-review_8_3_4_12-n-i-o-k-t-r_2025-form.component.html',
    standalone: false
})
export class ExpertReview_8_3_4_12NIOKTR_2025FormComponent extends ExpertReviewForm<ExpertReview_8_3_4_12NIOKTR_2025FormContent> {

  noveltyOptions: string[] = [];
  private _isFormInitialized: boolean = false;

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



  showTarget8_3() {
    return this.project.code.code.startsWith('8.3');
  }

  showTarget8_4() {
    return this.project.code.code.startsWith('8.4');
  }

  createNewForm(): ExpertReview_8_3_4_12NIOKTR_2025FormContent {
    return new ExpertReview_8_3_4_12NIOKTR_2025FormContent();
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

  setForm(form: ExpertReview_8_3_4_12NIOKTR_2025FormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    
    // Нормализуем boolean поля при первой загрузке: если они false и нет текстовых комментариев,
    // это означает, что они не были выбраны пользователем, устанавливаем в undefined
    if (!this._isFormInitialized) {
      if (this._form.nameAccordance === false && !this._form.nameAccordanceText) {
        this._form.nameAccordance = undefined;
      }
      if (this._form.termsAccordance === false && !this._form.termsAccordanceText) {
        this._form.termsAccordance = undefined;
      }
      if (this._form.socialOrSecurity === false && !this._form.socialOrSecurityText) {
        this._form.socialOrSecurity = undefined;
      }
      if (this._form.financeAccordance === false && !this._form.financeAccordanceText) {
        this._form.financeAccordance = undefined;
      }
      if (this._form.targetAccordance === false && !this._form.targetAccordanceText) {
        this._form.targetAccordance = undefined;
      }
      this._isFormInitialized = true;
    }
  }

}
