import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
    selector: 'app-council-conclusion-8-13-form',
    templateUrl: './council-conclusion-8-13-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_13_FormComponent extends CouncilConclusionForm {

    constructor() {
        super();
        this.financeConclusionNum = '6';
    }

    validate() {
        // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
        // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
        super.validate();
        this.validateFinanceConclusion();
    }

}
