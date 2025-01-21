import {Component} from '@angular/core';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
  selector: 'app-council-conclusion-8-1-2-form',
  templateUrl: './council-conclusion-8-1-2-form.component.html'
})
export class CouncilConclusion_8_1_2_FormComponent extends CouncilConclusionForm {

  constructor() {
    super();
    this.financeConclusionNum = '8.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
    if (isEmptyOrNull(this._form.novelty)
      || isEmptyOrNull(this._form.economicSignificance)
      || isEmptyOrNull(this._form.resourcesSufficiency)
      || isEmptyOrNull(this._form.competenceSufficiency)
      || isEmptyOrNull(this._form.risks)
      || isEmptyOrNull(this._form.privacyObjectsDescription)
      || isEmptyOrNull(this._form.stagesExist)
    ) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }

  isFinanceConclusionDisabled() {
    return !anyMatch(this._form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
      || !anyMatch(this._form.economicSignificance, 'средняя', 'высокая');
  }

  onConditionsChanged() {
    if (this.isFinanceConclusionDisabled()) {
      this._form.financeConclusion = false;
    }
  }
}
