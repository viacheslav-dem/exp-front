import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-agenda-8-15-2025-form',
  templateUrl: './agenda-8-15-2025-form.component.html'
})
export class Agenda_8_15_2025FormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '11.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
    if (isEmptyOrNull(this._form.novelty)
      || isEmptyOrNull(this._form.noveltyText)
      || isEmptyOrNull(this._form.economicSignificance)
      || isEmptyOrNull(this._form.economicSignificanceText)
      || isEmptyOrNull(this._form.commerce)
      || isEmptyOrNull(this._form.commerceText)
      || isEmptyOrNull(this._form.resourcesSufficiency)
      || isEmptyOrNull(this._form.resourcesSufficiencyText)
      || isEmptyOrNull(this._form.competenceSufficiency)
      || isEmptyOrNull(this._form.competenceSufficiencyText)
      || isEmptyOrNull(this._form.marketingResearch)
      || isEmptyOrNull(this._form.marketingResearchText)
      || isEmptyOrNull(this._form.risks)
      || isEmptyOrNull(this._form.risksText)
      || isEmptyOrNull(this._form.privacyObjectsDescription)
      || isEmptyOrNull(this._form.privacyObjectsDescriptionText)
      || isEmptyOrNull(this._form.stagesExist)
      || isEmptyOrNull(this._form.stagesExistText)
      || isEmptyOrNull(this._form.stagesText)
    ) {
      throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
    }
    this.validateSuggestion(this._form.nameAccordance, this._form.nameSuggestion, this._form.nameAccordanceText);
    this.validateSuggestion(this._form.termsAccordance, this._form.termsSuggestion, this._form.termsAccordanceText);
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
