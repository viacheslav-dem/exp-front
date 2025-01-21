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
    if (isEmptyOrNull(this._form.marketingResearch)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
  }
}
