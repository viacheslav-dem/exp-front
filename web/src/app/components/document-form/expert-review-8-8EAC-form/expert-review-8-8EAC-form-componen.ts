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
  templateUrl: './expert-review-8-8EAC-form.component.html'
})
export class ExpertReview_8_8EAC_FormComponent extends ExpertReviewForm<ExpertReview_8_8EAC_FormContent> {

  validate() {
    super.validate();
  }

  setForm(form: ExpertReview_8_8EAC_FormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
  }
  Catalog = Catalog;

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
