import {Component} from '@angular/core';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
    selector: 'app-council-conclusion-8-1-2-form',
    templateUrl: './council-conclusion-8-1-2-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_1_2_FormComponent extends CouncilConclusionForm {

    constructor() {
        super();
        this.financeConclusionNum = '8.4';
    }

    validate() {
        this.validationCommentsConclusion();
        super.validate();
        this.validateFinanceConclusion();
        this.validateFinanceSuggestion();
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

    private validationCommentsConclusion() {
        if (isEmptyOrNull(this._form.novelty)) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' не выстановленно заключение.";
        }
        if (isEmptyOrNull(this._form.noveltyText)) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' нет комментария к заключению.";
        } else if (this._form.noveltyText.length < 30) {
            throw "В пункте 'Новизна (инновационность) объекта государственной экспертизы.' комментарий должен быть не менее 30 символов.";
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
            throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' нет комментария к заключению.";
        } else if (this._form.competenceSufficiencyText.length < 30) {
            throw "В пункте 'Достаточность компетенции кадрового состава потенциального исполнителя работ.' комментарий должен быть не менее 30 символов.";
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
    }
}
