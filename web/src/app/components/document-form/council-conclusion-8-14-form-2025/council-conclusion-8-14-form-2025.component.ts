import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {isEmptyOrNull} from "@app/support/utils";

@Component({
    selector: 'app-council-conclusion-8-14-2025-form',
    templateUrl: './council-conclusion-8-14-form-2025.component.html'
})
export class CouncilConclusion_8_14_2025_FormComponent extends CouncilConclusionForm {

    constructor() {
        super();
        this.financeConclusionNum = '9';
    }

    validate() {
        super.validate();
        this.validateFinanceConclusion();
        if (isEmptyOrNull(this._form.marketingResearch)
            || isEmptyOrNull(this._form.privacyObjectsDescription)
            || isEmptyOrNull(this._form.stagesExist)
        ) {
            throw 'Пожалуйста, заполните все поля заключения.';
        }
    }
}
