import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";

@Component({
  selector: 'app-council-conclusion-8-13-form',
  templateUrl: './council-conclusion-8-13-form.component.html'
})
export class CouncilConclusion_8_13_FormComponent extends CouncilConclusionForm {

  constructor() {
    super();
    this.financeConclusionNum = '6';
  }

  validate() {
    super.validate();
    this.validateFinanceConclusion();
  }
}
