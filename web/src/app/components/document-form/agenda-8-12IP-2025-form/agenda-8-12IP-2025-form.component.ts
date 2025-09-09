import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
    selector: 'app-agenda-8-12IP-2025-form',
    templateUrl: './agenda-8-12IP-2025-form.component.html'
})
export class Agenda_8_12IP_2025FormComponent extends AgendaNewForm {

    constructor() {
        super();
        this.financeConclusionNum = '7.4';
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        this.validateFinanceSuggestion();
        if (isEmptyOrNull(this._form.economicSignificance)
            || isEmptyOrNull(this._form.economicSignificanceText)
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
        ) {
            throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
        }
        this.validateSuggestion(this._form.nameAccordance, this._form.nameSuggestion, this._form.nameAccordanceText);
        this.validateSuggestion(this._form.termsAccordance, this._form.termsSuggestion, this._form.termsAccordanceText);
    }
}
