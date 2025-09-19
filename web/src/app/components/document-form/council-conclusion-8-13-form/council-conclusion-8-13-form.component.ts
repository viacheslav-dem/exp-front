import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
    selector: 'app-council-conclusion-8-13-form',
    templateUrl: './council-conclusion-8-13-form.component.html'
})
export class CouncilConclusion_8_13_FormComponent extends CouncilConclusionForm {

    constructor() {
        super();
        this.financeConclusionNum = '6';
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        this.validationCommentsOnConclusion();
    }


    private validationCommentsOnConclusion() {
        if (isEmptyOrNull(this._form.directionsAndGoalsText)) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития.' нет комментария к заключению."
        }

        if (this._form.directionsAndGoalsText.length < 30) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.programRequirementsText)) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития.' нет комментария к заключению."
        }

        if (this._form.programRequirementsText.length < 30) {
            throw "В пункте 'Значение работы для реализации приоритетов социально-экономического развития.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.programRequirementsText)) {
            throw "В пункте 'Соответствие требованиям, указанным в Положении о порядке реализации государственных программ:' нет комментария к заключению."
        }

        if (this._form.programRequirementsText.length < 30) {
            throw "В пункте 'Соответствие требованиям, указанным в Положении о порядке реализации государственных программ:' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.prognosisText)) {
            throw "В пункте 'Оценка анализа текущего состояния и прогноза научно-технического развития соответствующей сферы планирования:' нет комментария к заключению."
        }

        if (this._form.prognosisText.length < 30) {
            throw "В пункте 'Оценка анализа текущего состояния и прогноза научно-технического развития соответствующей сферы планирования:' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.targetAnalysisText)) {
            throw "В пункте 'Анализ целевых показателей:' нет комментария к заключению."
        }

        if (this._form.targetAnalysisText.length < 30) {
            throw "В пункте 'Анализ целевых показателей:' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.programSufficiencyText)) {
            throw "В пункте 'Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий государственной научно-технической программы для достижения запланированных программой целевых показателей:' нет комментария к заключению."
        }

        if (this._form.programSufficiencyText.length < 30) {
            throw "В пункте 'Достаточность перечня мероприятий по научному обеспечению государственной программы / перечня заданий государственной научно-технической программы для достижения запланированных программой целевых показателей:' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.financeConclusionText)) {
            throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств республиканского бюджета и (или) других источников финансирования:' нет комментария к заключению."
        }

        if (this._form.financeConclusionText.length < 30) {
            throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств республиканского бюджета и (или) других источников финансирования:' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.conclusionText)) {
            throw "В пункте 'Заключение государственного экспертного совета по объекту государственной экспертизы' нет комментария к заключению."
        }

        if (this._form.conclusionText.length < 30) {
            throw "В пункте 'Заключение государственного экспертного совета по объекту государственной экспертизы' комментарий должен быть не менее 30 символов."
        }
    }
}
