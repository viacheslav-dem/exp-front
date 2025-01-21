import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
  selector: 'app-agenda-8-9-new-form',
  templateUrl: './agenda-8-9-new-form.component.html'
})
export class Agenda_8_9_NewFormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '5.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
  }
}
