import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {PeriodDto} from "@app/dto/PeriodDto";

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
        if (isEmptyOrNull(this._form.economicSignificance)) {
            throw "В пункте 1: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.economicSignificanceText)) {
            throw "В пункте 1: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.economicSignificanceText.length < 30) {
            throw "В пункте 1: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.resourcesSufficiency)) {
            throw "В пункте 2: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
            throw "В пункте 2: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.resourcesSufficiencyText.length < 30) {
            throw "В пункте 2: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiency)) {
            throw "В пункте 3: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
            throw "В пункте 3: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.competenceSufficiencyText.length < 30) {
            throw "В пункте 3: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.marketingResearch)) {
            throw "В пункте 4: 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.marketingResearchText)) {
            throw "В пункте 4: 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.marketingResearchText.length < 30) {
            throw "В пункте 4: 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.risks)) {
            throw "В пункте 5: 'Риски реализации проекта.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.risksText)) {
            throw "В пункте 5: 'Риски реализации проекта.' нет комментария к заключению.";
        } else if (this._form.risksText.length < 30) {
            throw "В пункте 5: 'Риски реализации проекта.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
            throw "В пункте 6: 'Создание объекта права промышленной собственности.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
            throw "В пункте 6: 'Создание объекта права промышленной собственности.' нет комментария к заключению.";
        } else if (this._form.privacyObjectsDescriptionText.length < 30) {
            throw "В пункте 6: 'Создание объекта права промышленной собственности.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.nameAccordanceText)) {
            throw "В пункте 7.1: 'Соответствие объекта государственной экспертизы своему наименованию.' нет комментария к заключению.";
        } else if (this._form.nameAccordanceText.length < 30) {
            throw "В пункте 7.1: 'Соответствие объекта государственной экспертизы своему наименованию.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.nameAccordance && isEmptyOrNull(this._form.nameSuggestion)) {
            throw "В пункте 7.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено."
        }
        if (isEmptyOrNull(this._form.termsAccordanceText)) {
            throw "В пункте 7.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' нет комментария к заключению.";
        } else if (this._form.termsAccordanceText.length < 30) {
            throw "В пункте 7.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 7.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }
        if (isEmptyOrNull(this._form.financeAccordanceText)) {
            throw "В пункте 7.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению.";
        } else if (this._form.financeAccordanceText.length < 30) {
            throw "В пункте 7.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 7.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля."
        }
        this.validateFinanceConclusion();
    }
}
