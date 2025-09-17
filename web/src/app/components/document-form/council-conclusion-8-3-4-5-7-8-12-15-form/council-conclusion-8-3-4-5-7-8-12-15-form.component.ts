import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {CouncilConclusion_8_1_2_FormComponent} from "@app/components/document-form/council-conclusion-8-1-2-form/council-conclusion-8-1-2-form.component";

@Component({
  selector: 'app-council-conclusion-8-3-4-5-7-8-12-15-form',
  templateUrl: './council-conclusion-8-3-4-5-7-8-12-15-form.component.html'
})
export class CouncilConclusion_8_3_4_5_7_8_12_15_FormComponent extends CouncilConclusion_8_1_2_FormComponent {

  constructor() {
    super();
    this.financeConclusionNum = '9.4';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
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


    showTarget8_8() {
        return this.project.code.code.startsWith('8.8');
    }

    showTarget8_2() {
        return this.project.code.code.startsWith('8.2');
    }

    showTarget8_15() {
        return this.project.code.code.startsWith('8.15');
    }

    private validationCommentsOnConclusion() {
        if (isEmptyOrNull(this._form.novelty)) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
        }

        if (isEmptyOrNull(this._form.noveltyText)) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению."
        }

        if (isEmptyOrNull(this._form.economicSignificance)) {
            throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение."
        }

        if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
            throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению."
        }

        if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
            throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению."
        }

        if (this._form.competenceSufficiencyText.length < 30) {
            throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ' нет комментария к заключению."
        }

        if (isEmptyOrNull(this._form.marketingResearch)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение."
        }

        if (isEmptyOrNull(this._form.marketingResearchText)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению."
        }

        if (this._form.marketingResearchText.length < 30) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению."
        }
        if (this._form.risksText.length < 30) {
            throw "В пункте 'Риски реализации проекта.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение."
        }

        if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению."
        }

        if (this._form.privacyObjectsDescriptionText.length < 30) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.stagesExist)) {
            throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
            "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' не выстановленно заключение."
        }

        if (isEmptyOrNull(this._form.stagesExistText)) {
            throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
            "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.' нет комментария к заключению."
        }

        if (this._form.stagesExistText.length < 30) {
            throw "В пункте 'Льготирование реализации объекта государственной экспертизы. Целесообразность государственной " +
            "регистрации объекта государственной экспертизы в соответствии с законодательством Республики Беларусь.'  комментарий должен быть не менее 30 символов."
        }

        if (this._form.nameAccordanceText.length < 30) {
            throw "В пункте 'Соответствие объекта государственной экспертизы своему наименованию.' комментарий должен быть не менее 30 символов."
        }

        if (this._form.termsAccordanceText.length < 30) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.financeConclusionText)) {
            throw "В пункте 'Целесообразность реализации объекта государственной экспертизы и его финансирования за счет средств республиканского бюджета и (или) других источников финансирования.' нет комментария к заключению."
        }

        if (this._form.commerceText.length < 30) {
            throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' комментарий должен быть не менее 30 символов."
        }

        if (this._form.competitivenessText.length < 30) {
            throw "В пункте 'Обоснование конкурентоспособности разработки.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.analogParamsText)) {
            throw "В пункте 'Основные технико-экономические и социально-экономические параметры планируемых новшеств " +
            "(аналога импортируемой продукции), анализ аналогов (прототипов) продукции, а также возможности использования " +
            "промежуточных результатов исследований для других разработок (модификаций, а также в иных сферах экономики).' " +
            "нет комментария к заключению."
        }
    }
}
