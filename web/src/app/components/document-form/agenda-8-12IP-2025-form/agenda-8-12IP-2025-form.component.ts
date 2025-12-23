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

    validate() {
        // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
        // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
        super.validate();
        this.validateFinanceConclusion();
        // Проверка nameSuggestion, termsSuggestion и financeSuggestion оставлена через throw, так как это бизнес-логика
        if (!this._form.nameAccordance && isEmptyOrNull(this._form.nameSuggestion)) {
            throw "В пункте 7.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено."
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 7.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 7.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля."
        }
    }
}
