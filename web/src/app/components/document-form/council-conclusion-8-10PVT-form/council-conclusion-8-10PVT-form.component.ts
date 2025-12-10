import {Component} from '@angular/core';
import {anyMatch, isEmptyOrNull} from "@app/support/utils";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {DecisionState} from "@app/pipes/decision.pipe";

@Component({
    selector: 'app-council-conclusion-8-10PVT-form',
    templateUrl: './council-conclusion-8-10PVT-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_10PVT_FormComponent extends CouncilConclusionForm {

  validate() {
    super.validate();
    if (isEmptyOrNull(this._form.productName)) {
      throw 'Пожалуйста, заполните все поля заключения.';
    }
    if (!this._form.highTech) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пункте 7. Проект: ' + this.project.title;
    }
  }

  onConditionsChanged() {
    if (this._form.highTech) {
      this.group.finalAgendaState = DecisionState.ACCEPTED;
    }
    if (!this._form.highTech) {
      this.group.finalAgendaState = DecisionState.REJECTED;
    }
  }
  ngOnInit() {
    this.group.finalAgendaState = DecisionState.REJECTED
  }
}
