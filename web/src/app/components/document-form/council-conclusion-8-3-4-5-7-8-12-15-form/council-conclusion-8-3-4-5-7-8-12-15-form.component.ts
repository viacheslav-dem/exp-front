import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {
    CouncilConclusion_8_1_2_FormComponent
} from "@app/components/document-form/council-conclusion-8-1-2-form/council-conclusion-8-1-2-form.component";

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
        this.validationCommentsOnConclusion();
        super.validate();
        this.validateFinanceConclusion();
    }

    showTarget8_1() {
        let is8_1 = false;
        // Использовал регулярные выражения, т.к. проверка возвращала true для 8.1 и 8.11, 8.12 и т.д.
        const regExp = /8.1(.*)/;
        const isDigit = /\d/;
        let code = this.project.code.code;
        if (code.startsWith('8.1')) {
            let regExpMatchArray = code.match(regExp);
            if (regExpMatchArray && regExpMatchArray[1]) {
                is8_1 = !isDigit.test(regExpMatchArray[1]);
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

        if (this._form.noveltyText.length < 30) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов."
        }

        if (isEmptyOrNull(this._form.economicSignificance)) {
            throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.economicSignificanceText)) {
            throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.economicSignificanceText.length < 30) {
            throw "В пункте 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.resourcesSufficiency)) {
            throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
            throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.resourcesSufficiencyText.length < 30) {
            throw "В пункте 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.competenceSufficiency)) {
            throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
            throw "В пункте  'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.competenceSufficiencyText.length < 30) {
            throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.marketingResearch)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.marketingResearchText)) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.marketingResearchText.length < 30) {
            throw "В пункте 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.risks)) {
            throw "В пункте 'Риски реализации проекта.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.risksText)) {
            throw "В пункте 'Риски реализации проекта.' нет комментария к заключению.";
        } else if (this._form.risksText.length < 30) {
            throw "В пункте 'Риски реализации проекта.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
            throw "В пункте 'Создание объекта права промышленной собственности.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
            throw "В пункте 'Создание объекта права промышленной собственности.' нет комментария к заключению.";
        } else if (this._form.privacyObjectsDescriptionText.length < 30) {
            throw "В пункте 'Создание объекта права промышленной собственности.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.stagesExist)) {
            throw "В пункте 'Целесообразность государственной регистрации объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.stagesExistText)) {
            throw "В пункте 'Целесообразность государственной регистрации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesExistText.length < 30) {
            throw "В пункте 'Целесообразность государственной регистрации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.stagesText)) {
            throw "В пункте 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesText.length < 30) {
            throw "В пункте 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.termsAccordanceText)) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' нет комментария к заключению.";
        } else if (this._form.termsAccordanceText.length < 30) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }

        if (isEmptyOrNull(this._form.financeAccordanceText)) {
            throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению.";
        } else if (this._form.financeAccordanceText.length < 30) {
            throw "В пункте'Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
        }

        if (this.showTarget8_1() || this.showTarget8_2() || this.showTarget8_3() || this.showTarget8_4() || this.showTarget8_15()) {
            if (isEmptyOrNull(this._form.commerce)) {
                throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' не выстановленно заключение.";
            }
            if (isEmptyOrNull(this._form.commerceText)) {
                throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' нет комментария к заключению.";
            } else if (this._form.commerceText.length < 30) {
                throw "В пункте 'Способ коммерциализации результата (-ов) научно-технической деятельности.' комментарий должен быть не менее 30 символов.";
            }
        }

        if (isEmptyOrNull(this._form.competitivenessText)) {
            throw "В пункте 'Обоснование конкурентоспособности разработки.' нет комментария к заключению.";
        } else if (this._form.competitivenessText.length < 30) {
            throw "В пункте 'Обоснование конкурентоспособности разработки.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.competitivenessText)) {
            throw "В пункте 'Обоснование конкурентоспособности разработки.' нет комментария к заключению.";
        } else if (this._form.competitivenessText.length < 30) {
            throw "В пункте 'Обоснование конкурентоспособности разработки.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.analogParamsText)) {
            throw "В пункте 'Основные технико-экономические и социально-экономические параметры планируемых новшеств.' нет комментария к заключению.";
        } else if (this._form.analogParamsText.length < 30) {
            throw "В пункте 'Основные технико-экономические и социально-экономические параметры планируемых новшеств.' комментарий должен быть не менее 30 символов.";
        }

        if (isEmptyOrNull(this._form.needs)) {
            throw "В пункте 'Обоснование прогнозируемой потребности в разрабатываемой продукции' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.needsText)) {
            throw "В пункте 'Обоснование прогнозируемой потребности в разрабатываемой продукции.' нет комментария к заключению.' нет комментария к заключению.";
        } else if (this._form.needsText.length < 30) {
            throw "В пункте 'Обоснование прогнозируемой потребности в разрабатываемой продукции.' комментарий должен быть не менее 30 символов.";
        }

        if (this.showTarget8_8() || this.showTarget8_3() || this.showTarget8_4()) {
            if (isEmptyOrNull(this._form.technologicalOrder)) {
                throw "В пункте 'Уровень технологического уклада научно-технической продукции.' не выстановленно заключение.";
            }
            if (isEmptyOrNull(this._form.technologicalOrderText)) {
                throw "В пункте 'Уровень технологического уклада научно-технической продукции.' нет комментария к заключению.";
            } else if (this._form.technologicalOrderText.length < 30) {
                throw "В пункте 'Уровень технологического уклада научно-технической продукции.' комментарий должен быть не менее 30 символов.";
            }
        }

        if (isEmptyOrNull(this._form.socialOrSecurityText)) {
            throw "В пункте  'Объект государственной экспертизы является социально значимым или направленным на обеспечение национальной безопасности.' нет комментария к заключению.";
        } else if (this._form.socialOrSecurityText.length < 30) {
            throw "В пункте 'Объект государственной экспертизы является социально значимым или направленным на обеспечение национальной безопасности.' комментарий должен быть не менее 30 символов.";
        }

    }
}
