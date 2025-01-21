import {DocumentForm} from "app/components/document-form/document-form";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {Injectable} from "@angular/core";
import {MeetingProtocolFormComponent} from "@app/components/document-form/meeting-protocol-form/meeting-protocol-form.component";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";
import {PeriodDto} from "@app/dto/PeriodDto";
import {NewVoteResults} from "@app/components/document-form/meeting-protocol-form/NewVoteResults";

@Injectable()
export abstract class AgendaNewForm extends DocumentForm<AgendaNewFormContent> {

  ind: number;
  parent: MeetingProtocolFormComponent;
  canRescheduled: boolean;
  _project: ProjectPlainDto;
  financeConclusionNum;

  createNewForm(): AgendaNewFormContent {
    return new AgendaNewFormContent();
  }

  validateFinanceConclusion() {
    if (!this._form.financeConclusion && this.conclusion.isAccepted()) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пункте ' + this.financeConclusionNum + '. Проект: ' + this.project.title;
    }
  }

  validateFinanceSuggestion() {
    if (this._form.financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля. Проект: ' + this.project.title;
    }
  }

  get project() {
    return this._project;
  }

  set project(project: ProjectPlainDto) {
    this._project = project;
  }

  setForm(form: AgendaNewFormContent) {
    super.setForm(form);
    this._form.termsSuggestion = this._form.termsSuggestion || new PeriodDto();
    this._form.conclusion = this._form.conclusion || new NewVoteResults();
    // clone to use NewVoteResults methods
    this._form.conclusion = NewVoteResults.clone(this._form.conclusion);
  }

  getForm() {
    let form: AgendaNewFormContent = super.getForm();
    form.conclusion.notVoted = this.getAllParticipants() - this.conclusion.getVoted();
    return form;
  }

  getAllParticipants() {
    return this.parent._form.participants.length;
  }

  get conclusion() {
    return this._form.conclusion;
  }

  validate() {
    super.validate();
    if (this.conclusion.getVoted() > this.getAllParticipants()) {
      throw 'Количество проголосовавших превышает число участников заседания. Проект: ' + this._project.title;
    }
    if (this.conclusion.needChairmanDecision()) {
      throw 'Необходимо решение Председателя заседания. Проект: ' + this._project.title;
    }
    if (this.conclusion.isRescheduled() && !this.canRescheduled) {
      throw 'Недопустимо отправление проекта на доработку, так как замечания не сформированы или ответы на них уже получены. ' +
      'Проект: ' + this._project.title;
    }
  }

  onConditionsChanged() {
  }
}
