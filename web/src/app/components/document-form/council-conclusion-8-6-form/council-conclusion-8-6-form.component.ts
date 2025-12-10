import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {DecisionState} from "@app/pipes/decision.pipe";

@Component({
    selector: 'app-council-conclusion-8-6-form',
    templateUrl: './council-conclusion-8-6-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_6_FormComponent extends CouncilConclusionForm {

  validate() {
    super.validate();
    if ((!this._form.accordance || !this._form.effectAccordance)
      && this.group.finalAgendaState == DecisionState.ACCEPTED) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пункте 1 или 2.';
    }
  }
}
