import {Component} from '@angular/core';
import {isEmptyOrNull} from "@app/support/utils";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
    selector: 'app-council-conclusion-8-11-14-form',
    templateUrl: './council-conclusion-8-11-14-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_11_14_FormComponent extends CouncilConclusionForm {

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
