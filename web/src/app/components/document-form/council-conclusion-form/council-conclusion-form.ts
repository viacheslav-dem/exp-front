import {DocumentForm} from "app/components/document-form/document-form";
import {Injectable} from "@angular/core";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {CouncilConclusionFormContainerComponent} from "@app/components/document-form/council-conclusion-form/council-conclusion-form-container.component";
import {ProjectDto} from "@app/dto/ProjectDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {DecisionState} from "@app/pipes/decision.pipe";

@Injectable()
export abstract class CouncilConclusionForm extends DocumentForm<AgendaNewFormContent> {

  parent: CouncilConclusionFormContainerComponent;
  project: ProjectDto;
  group: LifecycleGroupDto;
  financeConclusionNum;

  createNewForm(): AgendaNewFormContent {
    return new AgendaNewFormContent();
  }

  validateFinanceConclusion() {
    if (!this._form.financeConclusion && this.group.finalAgendaState == DecisionState.ACCEPTED) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пункте ' + this.financeConclusionNum + '.';
    }
  }

  validateFinanceSuggestion() {
    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля.';
    }
  }

  setForm(form: AgendaNewFormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
  }

  onConditionsChanged() {
  }
}
