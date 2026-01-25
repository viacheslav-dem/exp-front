import {Component} from '@angular/core';
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {DecisionState} from "@app/pipes/decision.pipe";

@Component({
    selector: 'app-council-conclusion-8-10PIT-form',
    templateUrl: './council-conclusion-8-10PIT-form.component.html',
    standalone: false
})
export class CouncilConclusion_8_10PIT_FormComponent extends CouncilConclusionForm {

  validate() {
    // Инкрементальная миграция: обязательность/мин.длина выражаются через template-driven validators (required/minlength),
    // чтобы контейнер мог гарантированно найти .ng-invalid и проскроллить без зависимости от throw.
    super.validate();
    // Проверка patents/advantage/competitiveness оставлена через throw, так как это бизнес-логика, не связанная с template-driven валидацией
    const form = this.formValue();
    if ((!form.patents || !form.advantage || !form.competitiveness)
      && this.group.finalAgendaState == DecisionState.ACCEPTED) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пунктах 1, 2, 3.';
    }
  }
}
