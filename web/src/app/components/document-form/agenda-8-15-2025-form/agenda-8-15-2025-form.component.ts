import {Component} from '@angular/core';
import {AgendaNewForm} from "@app/components/document-form/meeting-protocol-form/agenda-new-form.service";
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-agenda-8-15-2025-form',
    templateUrl: './agenda-8-15-2025-form.component.html'
})
export class Agenda_8_15_2025FormComponent extends AgendaNewForm {

    noveltyOptions: string[] = [];

    constructor(private _dataService: DataService) {
        super();
        this.financeConclusionNum = '11.4';
    }

    ngOnInit() {
        this._dataService.getCommercializationMethods().subscribe(res => {
            res.forEach(option => this.noveltyOptions.push(option.name))
        })
    }

    validate() {
        if (isEmptyOrNull(this._form.novelty)) {
            throw "В пункте 2: 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.noveltyText)) {
            throw "В пункте 2: 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.noveltyText.length < 30) {
            throw "В пункте 2: 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.economicSignificance)) {
            throw "В пункте 3: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.economicSignificanceText)) {
            throw "В пункте 3: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.economicSignificanceText.length < 30) {
            throw "В пункте 3: 'Экономическая и (или) социальная значимость объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.commerce)) {
            throw "В пункте 4: 'Способ коммерциализации результата (-ов) научно-технической деятельности.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.commerceText)) {
            throw "В пункте 4: 'Способ коммерциализации результата (-ов) научно-технической деятельности.' нет комментария к заключению.";
        } else if (this._form.commerceText.length < 30) {
            throw "В пункте 4: 'Способ коммерциализации результата (-ов) научно-технической деятельности.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.resourcesSufficiency)) {
            throw "В пункте 5: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.resourcesSufficiencyText)) {
            throw "В пункте 5: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.resourcesSufficiencyText.length < 30) {
            throw "В пункте 5: 'Достаточность материально-технической базы и кадрового потенциала исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiency)) {
            throw "В пункте 6: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.competenceSufficiencyText)) {
            throw "В пункте 6: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.competenceSufficiencyText.length < 30) {
            throw "В пункте 6: 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.marketingResearch)) {
            throw "В пункте 7: 'Проведение маркетинговых и патентных исследований, их результаты.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.marketingResearchText)) {
            throw "В пункте 7: 'Проведение маркетинговых и патентных исследований, их результаты.' нет комментария к заключению.";
        } else if (this._form.marketingResearchText.length < 30) {
            throw "В пункте 7: 'Проведение маркетинговых и патентных исследований, их результаты.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.risks)) {
            throw "В пункте 8: 'Риски реализации проекта.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.risksText)) {
            throw "В пункте 8: 'Риски реализации проекта.' нет комментария к заключению.";
        } else if (this._form.risksText.length < 30) {
            throw "В пункте 8: 'Риски реализации проекта.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescription)) {
            throw "В пункте 9: 'Создание объекта права промышленной собственности.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.privacyObjectsDescriptionText)) {
            throw "В пункте 9: 'Создание объекта права промышленной собственности.' нет комментария к заключению.";
        } else if (this._form.privacyObjectsDescriptionText.length < 30) {
            throw "В пункте 9: 'Создание объекта права промышленной собственности.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.stagesExist)) {
            throw "В пункте 10.1: 'Целесообразность государственной регистрации объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.stagesExistText)) {
            throw "В пункте 10.1: 'Целесообразность государственной регистрации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesExistText.length < 30) {
            throw "В пункте 10.1: 'Целесообразность государственной регистрации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.stagesText)) {
            throw "В пункте 10.2: 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.stagesText.length < 30) {
            throw "В пункте 10.2: 'Наличие в календарном плане этапов реализации объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
        }
        if (isEmptyOrNull(this._form.nameAccordanceText)) {
            throw "В пункте 11.1: 'Соответствие объекта государственной экспертизы своему наименованию.' нет комментария к заключению.";
        } else if (this._form.nameAccordanceText.length < 30) {
            throw "В пункте 11.1: 'Соответствие объекта государственной экспертизы своему наименованию.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.nameAccordance && isEmptyOrNull(this._form.nameSuggestion)) {
            throw "В пункте 11.1: 'Соответствие объекта государственной экспертизы своему наименованию.' рекомендуемый объем финансирования не может быть меньше нуля.";
        }
        if (isEmptyOrNull(this._form.termsAccordanceText)) {
            throw "В пункте 11.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' нет комментария к заключению.";
        } else if (this._form.termsAccordanceText.length < 30) {
            throw "В пункте 11.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 11.2: 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации.";
        }
        if (isEmptyOrNull(this._form.financeAccordanceText)) {
            throw "В пункте 11.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' нет комментария к заключению.";
        } else if (this._form.financeAccordanceText.length < 30) {
            throw "В пункте 11.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' комментарий должен быть не менее 30 символов.";
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 11.3: 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля.";
        }
        this.validateFinanceConclusion();
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
}
