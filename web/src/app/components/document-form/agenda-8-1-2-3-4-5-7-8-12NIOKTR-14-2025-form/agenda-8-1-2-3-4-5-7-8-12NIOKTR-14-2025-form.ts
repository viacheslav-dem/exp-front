import {Component} from '@angular/core';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";

@Component({
    selector: 'app-agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form',
    templateUrl: './agenda-8-1-2-3-4-5-7-8-12NIOKTR-14-2025-form.html'
})
export class Agenda_8_1_2_3_4_5_7_8_12NIOKTR_14_2025_FormComponent extends AgendaNewForm {

    constructor() {
        super();
        this.financeConclusionNum = '19.6';
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        this.validateFinanceSuggestion();

        //Валидация полей, общих для подпунктов 8.1_2_3_4_5_7_8_12NIOKTR_14
        this.validateCommon()

        // Поле, которое общее для всех, кроме 8.4
        if (this.showTargetNot8_4()) {
            if (isEmptyOrNull(this._form.rbNeeds) || isEmptyOrNull(this._form.rbNeedsText)) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
        }

        if (this.showTarget8_1()) {
            if (isEmptyOrNull(this._form.scientificResearch) ||
                isEmptyOrNull(this._form.scientificResearchText) ||
                isEmptyOrNull(this._form.commerce) ||
                isEmptyOrNull(this._form.commerceText)
            ) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
            this.validateSoftwareTool()
        }

        if (this.showTarget8_3()) {
            if (isEmptyOrNull(this._form.technologicalOrder) ||
                isEmptyOrNull(this._form.technologicalOrderText) ||
                isEmptyOrNull(this._form.scientificResearch) ||
                isEmptyOrNull(this._form.scientificResearchText) ||
                isEmptyOrNull(this._form.commerce) ||
                isEmptyOrNull(this._form.commerceText)
            ) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
            this.validateSoftwareTool()
        }

        if (this.showTarget8_4()) {
            if (isEmptyOrNull(this._form.technologicalOrder) ||
                isEmptyOrNull(this._form.technologicalOrderText) ||
                isEmptyOrNull(this._form.scientificResearch) ||
                isEmptyOrNull(this._form.scientificResearchText) ||
                isEmptyOrNull(this._form.commerce) ||
                isEmptyOrNull(this._form.commerceText)
            ) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
        }

        if (this.showTarget8_5() || this.showTarget8_7() || this.showTarget8_12()) {
            if (isEmptyOrNull(this._form.neededProjectDocsText)) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
        }

        if (this.showTarget8_8()) {
            if (isEmptyOrNull(this._form.technologicalOrder) ||
                isEmptyOrNull(this._form.technologicalOrderText)
            ) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
        }

        if (this.showTarget8_14()) {
            if (isEmptyOrNull(this._form.workAccordanceText) ||
                isEmptyOrNull(this._form.assessmentText)
            ) {
                throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
            }
            this.validateSuggestion(this._form.sufficiency, this._form.sufficiencySuggestion, this._form.sufficiencyText)
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

    //Валидация полей, общих для подпунктов 8.1_2_3_4_5_7_8_12NIOKTR_14
    validateCommon() {
        if (
            isEmptyOrNull(this._form.novelty) ||
            isEmptyOrNull(this._form.noveltyText) ||
            isEmptyOrNull(this._form.economicSignificance) ||
            isEmptyOrNull(this._form.economicSignificanceText) ||
            isEmptyOrNull(this._form.resourcesSufficiency) ||
            isEmptyOrNull(this._form.resourcesSufficiencyText) ||
            isEmptyOrNull(this._form.competenceSufficiency) ||
            isEmptyOrNull(this._form.competenceSufficiencyText) ||
            isEmptyOrNull(this._form.marketingResearch) ||
            isEmptyOrNull(this._form.marketingResearchText) ||
            isEmptyOrNull(this._form.competitivenessText) ||
            isEmptyOrNull(this._form.analog) ||
            isEmptyOrNull(this._form.analogText) ||
            isEmptyOrNull(this._form.analogParams) ||
            isEmptyOrNull(this._form.analogParamsText) ||
            isEmptyOrNull(this._form.needs) ||
            isEmptyOrNull(this._form.needsText) ||
            isEmptyOrNull(this._form.risks) ||
            isEmptyOrNull(this._form.risksText) ||
            isEmptyOrNull(this._form.privacyObjectsDescription) ||
            isEmptyOrNull(this._form.privacyObjectsDescriptionText) ||
            isEmptyOrNull(this._form.stagesExist) ||
            isEmptyOrNull(this._form.stagesExistText) ||
            isEmptyOrNull(this._form.stagesText) ||
            isEmptyOrNull(this._form.socialOrSecurityText)
        ) {
            throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
        }
        this.validateSuggestion(this._form.nameAccordance, this._form.nameSuggestion, this._form.nameAccordanceText)
        this.validateSuggestion(this._form.termsAccordance, this._form.termsSuggestion, this._form.termsAccordanceText)
        this.validateSuggestion(this._form.financeAccordance, this._form.financeSuggestion, this._form.financeAccordanceText)
    }

    // Отдельная валидация для этого подпункта, т.к. тут значение кнопки определяется не по boolean значению, а по числовому
    validateSoftwareTool() {
        if (isEmptyOrNull(this._form.softwareToolText)) {
            throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
        }
        if (this._form.softwareTool == 2 && isEmptyOrNull(this._form.softwareToolSuggestion)) {
            throw 'Пожалуйста, заполните все поля протокола. Проект: ' + this.project.title;
        }
    }

    showTarget8_1() {
        let is8_1 = false;
        // Использовал регулярные выражения, т.к. проверка возвращала true для 8.1 и 8.11, 8.12 и т.д.
        const str = /8.1(.*)/;
        const isDigit = /\d/
        let code = this.project.code.code
        if (code.startsWith('8.1')) {
            let testReg1 = code.match(str);
            if (testReg1 && testReg1[1]) {
                is8_1 = !isDigit.test(testReg1[1]);
            } else {
                is8_1 = true;
            }
        }
        return is8_1;
    }

    showTarget8_3() {
        return this.project.code.code.startsWith('8.3');
    }

    showTarget8_4() {
        return this.project.code.code.startsWith('8.4');
    }

    showTargetNot8_4() {
        return !this.project.code.code.startsWith('8.4');
    }

    showTarget8_5() {
        return this.project.code.code.startsWith('8.5');
    }

    showTarget8_7() {
        return this.project.code.code.startsWith('8.7');
    }

    showTarget8_8() {
        return this.project.code.code.startsWith('8.8');
    }

    showTarget8_12() {
        return this.project.code.code.startsWith('8.12');
    }

    showTarget8_14() {
        return this.project.code.code.startsWith('8.14');
    }
}
