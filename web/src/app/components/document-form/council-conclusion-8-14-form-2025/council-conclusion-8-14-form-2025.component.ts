import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
    selector: 'app-council-conclusion-8-14-2025-form',
    templateUrl: './council-conclusion-8-14-form-2025.component.html',
    standalone: false
})
export class CouncilConclusion_8_14_2025_FormComponent extends CouncilConclusionForm {

    constructor() {
        super();
        this.financeConclusionNum = '9';
    }

    validate() {
        // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
        // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
        super.validate();
        this.validateFinanceConclusion();
        // Проверка termsSuggestion и financeSuggestion оставлена через throw, так как это бизнес-логика
        this.validationCommentsOnConclusion();
    }

    private validationCommentsOnConclusion() {
        if (!this._form.termsAccordance && (this._form.termsSuggestion.start == undefined || this._form.termsSuggestion.end == undefined)) {
            throw "В пункте 'Соответствие сроков выполнения объекта государственной экспертизы необходимым.' не проставлены рекомендуемые сроки реализации."
        }
        if (!this._form.financeAccordance && (this._form.financeSuggestion < 0 || this._form.financeSuggestion == undefined)) {
            throw "В пункте 'Соответствие заявленного финансирования планируемому объему выполняемых работ.' рекомендуемый объем финансирования финансирования не может быть меньше нуля."
        }
    }
}
