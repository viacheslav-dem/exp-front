import {Component} from '@angular/core';
import {anyMatch} from "@app/support/utils";
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
        // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
        // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
        super.validate();
        this.validateFinanceConclusion();
        this.validateFinanceSuggestion();
    }

    isFinanceConclusionDisabled() {
        const form = this.formValue();
        return !anyMatch(form.novelty, 'новый для Республики Беларусь', 'новый для стран СНГ', 'новизна мирового уровня')
            || !anyMatch(form.economicSignificance, 'средняя', 'высокая');
    }

    onConditionsChanged() {
        this.markFormChanged();
        if (this.isFinanceConclusionDisabled()) {
            this.patchForm({ financeConclusion: false });
        }
    }
}
