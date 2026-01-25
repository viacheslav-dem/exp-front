import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
    selector: 'app-agenda-8-12IP-new-form',
    templateUrl: './agenda-8-12IP-new-form.component.html',
    standalone: false
})
export class Agenda_8_12IP_NewFormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '7.4';
  }

  onConditionsChanged() {
    this.markFormChanged();
  }

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
  }
}
