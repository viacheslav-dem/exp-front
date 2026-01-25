import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
    selector: 'app-agenda-8-12IP-2025-form',
    templateUrl: './agenda-8-12IP-2025-form.component.html',
    standalone: false
})
export class Agenda_8_12IP_2025FormComponent extends AgendaNewForm {

    constructor() {
        super();
        this.financeConclusionNum = '7.4';
    }

    onConditionsChanged() {
        this.markFormChanged();
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        const form = this.formValue();
        if (!form.nameAccordance && isEmptyOrNull(form.nameSuggestion)) {
            throw "В пункте 7.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено."
        }
        if (!form.termsAccordance && (form.termsSuggestion?.start == undefined || form.termsSuggestion?.end == undefined)) {
            throw "В пункте 7.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }
        if (!form.financeAccordance && (form.financeSuggestion < 0 || form.financeSuggestion == undefined)) {
            throw "В пункте 7.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля."
        }
    }
}
