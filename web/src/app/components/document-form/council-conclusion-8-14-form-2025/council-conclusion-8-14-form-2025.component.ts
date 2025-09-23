import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
    selector: 'app-council-conclusion-8-14-2025-form',
    templateUrl: './council-conclusion-8-14-form-2025.component.html'
})
export class CouncilConclusion_8_14_2025_FormComponent extends CouncilConclusionForm {

    constructor() {
        super();
        this.financeConclusionNum = '9';
    }

    validate() {
        this.validationCommentsOnConclusion();
        super.validate();
        this.validateFinanceConclusion();
    }


    private validationCommentsOnConclusion() {
        if (this._form.workSignificance) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития, разработки новых технологических процессов, наукоемкой, конкурентоспособной продукции, формирования перспективных научных направлений:' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.workSignificanceText)) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития, разработки новых технологических процессов, наукоемкой, конкурентоспособной продукции, формирования перспективных научных направлений:' нет комментария к заключению.";
        } else if (this._form.workSignificanceText.length < 30) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития, разработки новых технологических процессов, наукоемкой, конкурентоспособной продукции, формирования перспективных научных направлений:' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.marketingResearch)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.marketingResearchText)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.marketingResearchText.length < 30) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }

        if (this._form.effect) {
            throw "В пункте 'Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия:' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.effectText)) {
            throw "В пункте 'Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия:' нет комментария к заключению.";
        } else if (this._form.effectText.length < 30) {
            throw "В пункте 'Возможный экономический и (или) социальный и (или) экологический эффект от реализации мероприятия:' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.deadlinesCompliance)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.deadlinesComplianceText)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.deadlinesComplianceText.length < 30) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.deadlinesCompliance)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.deadlinesComplianceText)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.deadlinesComplianceText.length < 30) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }

        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }
        if (isEmptyOrNull(this._form.financeAccordanceText)) {
            throw "В пункте  'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению.";
        } else if (this._form.financeAccordanceText.length < 30) {
            throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля."
        }

        if (isEmptyOrNull(this._form.stagesExist)) {
            throw "В пункте 'Целесообразность государственной регистрации объекта государственной экспертизы.' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.stagesExistText)) {
            throw "В пункте  'Целесообразность государственной регистрации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesExistText.length < 30) {
            throw "В пункте 'Целесообразность государственной регистрации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }

        if (this._form.stages) {
            throw "В пункте  'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' не выставлено заключение.";
        }
        if (isEmptyOrNull(this._form.stagesText)) {
            throw "В пункте  'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesText.length < 30) {
            throw "В пункте 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }


    }
}
