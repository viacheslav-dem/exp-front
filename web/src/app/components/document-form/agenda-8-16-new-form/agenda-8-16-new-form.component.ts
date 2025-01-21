import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";

@Component({
    selector: 'app-agenda-8-16-new-form',
    templateUrl: './agenda-8-16-new-form.component.html'
})
export class Agenda_8_16_NewFormComponent extends AgendaNewForm {

    constructor() {
        super();
        this.financeConclusionNum = '10.4';
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        this.validateFinanceSuggestion();
        if (isEmptyOrNull(this._form.percentageOfImportToExport)
            || isEmptyOrNull(this._form.percentageOfExportToImport)
            || isEmptyOrNull(this._form.correspondenceOfProductName)
            || isEmptyOrNull(this._form.correspondenceOfHighTechProduction)
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
