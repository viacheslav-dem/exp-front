import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch} from "@app/support/utils";

@Component({
    selector: 'app-agenda-8-1-2-new-form',
    templateUrl: './agenda-8-1-2-new-form.component.html',
    standalone: false
})
export class Agenda_8_1_2_NewFormComponent extends AgendaNewForm {

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
    const form = this.formValue();
    return !anyMatch(form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
      || !anyMatch(form.economicSignificance, 'средняя', 'высокая');
  }

  onConditionsChanged() {
    this.markFormChanged();
    if (this.isFinanceConclusionDisabled()) {
      this.patchForm({ financeConclusion: false });
    }
  }
}
