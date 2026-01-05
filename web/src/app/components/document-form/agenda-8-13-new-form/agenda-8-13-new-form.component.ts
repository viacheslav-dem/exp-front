import {Component} from '@angular/core';
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
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
  }
}
