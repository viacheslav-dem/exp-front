import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch} from "@app/support/utils";

@Component({
    selector: 'app-agenda-8-15-new-form',
    templateUrl: './agenda-8-15-new-form.component.html',
    standalone: false
})
export class Agenda_8_15_NewFormComponent extends AgendaNewForm {

  constructor() {
    super();
    this.financeConclusionNum = '10.4';
  }

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    this.validateFinanceConclusion();
    this.validateFinanceSuggestion();
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
