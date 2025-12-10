import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
    selector: 'app-agenda-8-13-new-form',
    templateUrl: './agenda-8-13-new-form.component.html',
    standalone: false
})
export class Agenda_8_13_NewFormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '4.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
    if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
      throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
    }
  }
}
