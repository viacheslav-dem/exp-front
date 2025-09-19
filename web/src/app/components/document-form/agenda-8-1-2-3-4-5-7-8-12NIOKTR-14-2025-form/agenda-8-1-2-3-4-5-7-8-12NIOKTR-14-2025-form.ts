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
        this.financeConclusionNum = '19.5';
    }

    validate() {
        if (isEmptyOrNull(this._form.novelty)) {
            throw "В пункте 1: 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.noveltyText)) {
            throw "В пункте 1: 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.noveltyText.length < 30) {
            throw "В пункте 1: 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (this.showTarget8_8() || this.showTarget8_3() || this.showTarget8_4()) {
            if (isEmptyOrNull(this._form.technologicalOrder)) {
                throw "В пункте 2: 'Уровень технологического уклада научно-технической продукции.' не выстановленно заключение.";
            }
            if (isEmptyOrNull(this._form.technologicalOrderText)) {
                throw "В пункте 2: 'Уровень технологического уклада научно-технической продукции.' нет комментария к заключению.";
            } else if (this._form.technologicalOrderText.length < 30) {
                throw "В пункте 2: 'Уровень технологического уклада научно-технической продукции.' комментарий должен быть не менее 30 символов.";
            }
        }
        if (this.showTarget8_4()) {
            if (isEmptyOrNull(this._form.multilateralDirectionsText)) {
                throw "В пункте 3: 'Выберите приоритетные направления научной, научно-технической и инновационной деятельности в Республике Беларусь.' нет комментария к заключению.";
            } else if (this._form.multilateralDirectionsText.length < 30) {
                throw "В пункте 3: 'Выберите приоритетные направления научной, научно-технической и инновационной деятельности в Республике Беларусь.' комментарий должен быть не менее 30 символов.";
            }
        }
        if (this.showTargetNot8_4()) {
            if (isEmptyOrNull(this._form.rbNeeds)) {
                throw "В пункте 4: 'Потребность республики в результатах.' не выстановленно заключение.";
            }
            if (isEmptyOrNull(this._form.rbNeedsText)) {
                throw "В пункте 4: 'Потребность республики в результатах.' нет комментария к заключению.";
            } else if (this._form.rbNeedsText.length < 30) {
                throw "В пункте 4: 'Потребность республики в результатах.' комментарий должен быть не менее 30 символов.";
            }
        }
        if (this.showTarget8_1() || this.showTarget8_3() || this.showTarget8_4()) {
            if (isEmptyOrNull(this._form.scientificResearch)) {
                throw "В пункте 5: 'Вид научного исследования.' не выстановленно заключение.";
            }
            if (isEmptyOrNull(this._form.scientificResearchText)) {
                throw "В пункте 5: 'Вид научного исследования.' нет комментария к заключению.";
            } else if (this._form.scientificResearchText.length < 30) {
                throw "В пункте 5: 'Вид научного исследования.' комментарий должен быть не менее 30 символов.";
            }
        }
        if (isEmptyOrNull(this._form.economicSignificance)) {
            throw "В пункте 6: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.economicSignificanceText)) {
            throw "В пункте 6: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.economicSignificanceText.length < 30) {
            throw "В пункте 6: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (this.showTarget8_5() || this.showTarget8_7() || this.showTarget8_12()) {
            if (isEmptyOrNull(this._form.neededProjectDocsText)) {
                throw "В пункте 7: 'Разработка проектной (предпроектной) документации.' нет комментария к заключению.";
            } else if (this._form.neededProjectDocsText.length < 30) {
                throw "В пункте 7: 'Разработка проектной (предпроектной) документации.' комментарий должен быть не менее 30 символов.";
            }
        }
        if (this.showTarget8_1() || this.showTarget8_3() || this.showTarget8_4()) {
            if (isEmptyOrNull(this._form.commerce)) {
                throw "В пункте 8: 'Способ коммерциализации результата (-ов) научно-технической деятельности.' не выстановленно заключение.";
            }
            if (isEmptyOrNull(this._form.commerceText)) {
                throw "В пункте 8: 'Способ коммерциализации результата (-ов) научно-технической деятельности.' нет комментария к заключению.";
            } else if (this._form.commerceText.length < 30) {
                throw "В пункте 8: 'Способ коммерциализации результата (-ов) научно-технической деятельности.' комментарий должен быть не менее 30 символов.";
            }
        }
        if (isEmptyOrNull(this._form.resourcesSufficiency)) {
            throw "В пункте 9: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
            throw "В пункте 9: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.resourcesSufficiencyText.length < 30) {
            throw "В пункте 9: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiency)) {
            throw "В пункте 10: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
            throw "В пункте 10: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.competenceSufficiencyText.length < 30) {
            throw "В пункте 10: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.marketingResearch)) {
            throw "В пункте 11: 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.marketingResearchText)) {
            throw "В пункте 11: 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.marketingResearchText.length < 30) {
            throw "В пункте 11: 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.competitivenessText)) {
            throw "В пункте 12: 'Обоснование конкурентоспособности разработки.' нет комментария к заключению.";
        } else if (this._form.competitivenessText.length < 30) {
            throw "В пункте 12: 'Обоснование конкурентоспособности разработки.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.analog)) {
            throw "В пункте 13: 'Направленность объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.analogText)) {
            throw "В пункте 13: 'Направленность объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.analogText.length < 30) {
            throw "В пункте 13: 'Направленность объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.analogParams)) {
            throw "В пункте 14: 'Основные технико-экономические и социально-экономические параметры планируемых новшеств.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.analogParamsText)) {
            throw "В пункте 14: 'Основные технико-экономические и социально-экономические параметры планируемых новшеств.' нет комментария к заключению.";
        } else if (this._form.analogParamsText.length < 30) {
            throw "В пункте 14: 'Основные технико-экономические и социально-экономические параметры планируемых новшеств.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.needs)) {
            throw "В пункте 15: 'Обоснование прогнозируемой потребности в разрабатываемой продукции' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.needsText)) {
            throw "В пункте 15: 'Обоснование прогнозируемой потребности в разрабатываемой продукции.' нет комментария к заключению.' нет комментария к заключению.";
        } else if (this._form.needsText.length < 30) {
            throw "В пункте 15: 'Обоснование прогнозируемой потребности в разрабатываемой продукции.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.risks)) {
            throw "В пункте 16: 'Риски реализации проекта.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.risksText)) {
            throw "В пункте 16: 'Риски реализации проекта.' нет комментария к заключению.";
        } else if (this._form.risksText.length < 30) {
            throw "В пункте 16: 'Риски реализации проекта.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
            throw "В пункте 17: 'Создание объекта права промышленной собственности.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
            throw "В пункте 17: 'Создание объекта права промышленной собственности.' нет комментария к заключению.";
        } else if (this._form.privacyObjectsDescriptionText.length < 30) {
            throw "В пункте 17: 'Создание объекта права промышленной собственности.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.stagesExist)) {
            throw "В пункте 18.1: 'Целесообразность государственной регистрации объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.stagesExistText)) {
            throw "В пункте 18.1: 'Целесообразность государственной регистрации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesExistText.length < 30) {
            throw "В пункте 18.1: 'Целесообразность государственной регистрации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.stagesText)) {
            throw "В пункте 18.2: 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesText.length < 30) {
            throw "В пункте 18.2: 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.nameAccordanceText)) {
            throw "В пункте 19.1: 'Соответствие объекта государственной экспертизы своему наименованию.' нет комментария к заключению.";
        } else if (this._form.nameAccordanceText.length < 30) {
            throw "В пункте 19.1: 'Соответствие объекта государственной экспертизы своему наименованию.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.nameAccordance && isEmptyOrNull(this._form.nameSuggestion)) {
            throw "В пункте 19.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемое наименование не введено.";
        }
        if (isEmptyOrNull(this._form.termsAccordanceText)) {
            throw "В пункте 19.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' нет комментария к заключению.";
        } else if (this._form.termsAccordanceText.length < 30) {
            throw "В пункте 19.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 19.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации.";
        }
        if (isEmptyOrNull(this._form.socialOrSecurityText)) {
            throw "В пункте 19.3: 'Объект государственной экспертизы является социально значимым или направленным на обеспечение национальной безопасности.' нет комментария к заключению.";
        } else if (this._form.socialOrSecurityText.length < 30) {
            throw "В пункте 19.3: 'Объект государственной экспертизы является социально значимым или направленным на обеспечение национальной безопасности.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.financeAccordanceText)) {
            throw "В пункте 19.4: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению.";
        } else if (this._form.financeAccordanceText.length < 30) {
            throw "В пункте 19.4: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 19.4: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
        }
        this.validateFinanceConclusion();
        if (this.showTarget8_14()) {
            if (isEmptyOrNull(this._form.workAccordanceText)) {
                throw "В пункте 20.1: 'Достаточность запланированных этапов работ (услуг), создаваемого и приобретаемого программного обеспечения, технических средств и (или) комплексов программно-технических средств.' нет комментария к заключению.";
            } else if (this._form.workAccordanceText.length < 30) {
                throw "В пункте 20.1: 'Достаточность запланированных этапов работ (услуг), создаваемого и приобретаемого программного обеспечения, технических средств и (или) комплексов программно-технических средств.' комментарий должен быть не менее 30 символов.";
            }
            if (!this._form.sufficiency && isEmptyOrNull(this._form.sufficiencySuggestion)) {
                throw "В пункте 20.1: 'Достаточность запланированных этапов работ (услуг), создаваемого и приобретаемого программного обеспечения, технических средств и (или) комплексов программно-технических средств.' рекомендуемые добавления не введены."
            }
            if (isEmptyOrNull(this._form.workAccordanceText)) {
                throw "В пункте 20.2: 'Соответствие объемов выполняемых работ (оказываемых услуг), включая работы (услуги) по технической поддержке и сопровождению программно-технических средств, информационных ресурсов, информационных систем и информационных сетей, заявленным объемам финансирования.' нет комментария к заключению.";
            } else if (this._form.workAccordanceText.length < 30) {
                throw "В пункте 20.2: 'Соответствие объемов выполняемых работ (оказываемых услуг), включая работы (услуги) по технической поддержке и сопровождению программно-технических средств, информационных ресурсов, информационных систем и информационных сетей, заявленным объемам финансирования.' комментарий должен быть не менее 30 символов.";
            }
            if (isEmptyOrNull(this._form.assessmentText)) {
                throw "В пункте 20.3: 'Оценка соответствия предложений поставщиков (подрядчиков, исполнителей), претендующих на участие в реализации мероприятий, целям названных мероприятий.' нет комментария к заключению.";
            } else if (this._form.assessmentText.length < 30) {
                throw "В пункте 20.3: 'Оценка соответствия предложений поставщиков (подрядчиков, исполнителей), претендующих на участие в реализации мероприятий, целям названных мероприятий.' комментарий должен быть не менее 30 символов.";
            }
        }
        super.validate();
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
