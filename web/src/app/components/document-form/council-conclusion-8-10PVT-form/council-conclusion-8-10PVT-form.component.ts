import {Component} from '@angular/core';
import {anyMatch} from "@app/support/utils";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {DecisionState} from "@app/pipes/decision.pipe";

@Component({
    selector: 'app-council-conclusion-8-10PVT-form',
    templateUrl: './council-conclusion-8-10PVT-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_10PVT_FormComponent extends CouncilConclusionForm {

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    // Проверка highTech оставлена через throw, так как это бизнес-логика, не связанная с template-driven валидацией
    // Ошибка должна выбрасываться только если highTech = false И заключение положительное (ACCEPTED)
    if (!this._form.highTech && this.group.finalAgendaState == DecisionState.ACCEPTED) {
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
