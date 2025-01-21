import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";

@Component({
  selector: 'app-agenda-8-1-2-new-form',
  templateUrl: './agenda-8-1-2-new-form.component.html'
})
export class Agenda_8_1_2_NewFormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '10.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
    if (isEmptyOrNull(this._form.novelty)
      || isEmptyOrNull(this._form.needs)
      || isEmptyOrNull(this._form.economicSignificance)
      || isEmptyOrNull(this._form.resourcesSufficiency)
      || isEmptyOrNull(this._form.competenceSufficiency)
      || isEmptyOrNull(this._form.risks)
      || isEmptyOrNull(this._form.privacyObjectsDescription)
      || isEmptyOrNull(this._form.stagesExist)
    ) {
      throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
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
