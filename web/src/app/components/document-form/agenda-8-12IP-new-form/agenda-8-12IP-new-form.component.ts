import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
  selector: 'app-agenda-8-12IP-new-form',
  templateUrl: './agenda-8-12IP-new-form.component.html'
})
export class Agenda_8_12IP_NewFormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '7.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
    if (isEmptyOrNull(this._form.economicSignificance)
      || isEmptyOrNull(this._form.resourcesSufficiency)
      || isEmptyOrNull(this._form.competenceSufficiency)
      || isEmptyOrNull(this._form.marketingResearch)
      || isEmptyOrNull(this._form.risks)
      || isEmptyOrNull(this._form.privacyObjectsDescription)
    ) {
      throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
    }
  }
}
