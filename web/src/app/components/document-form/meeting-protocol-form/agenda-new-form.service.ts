import {DocumentForm} from "app/components/document-form/document-form";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {computed, Injectable} from "@angular/core";
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

  // Аккордеон: раскрытие управляется родителем (MeetingProtocolFormComponent.openedAgendaProjectId)
  // и вычисляется реактивно (zoneless/OnPush friendly).
  readonly expanded = computed(() => {
    const parent = this.parent;
    const openedId = parent?.openedAgendaProjectId?.();
    const myId = this._project?.id;
    return openedId != null && myId != null && openedId === myId;
  });

  toggleExpanded() {
    this.parent?.toggleAgendaProject?.(this._project?.id);
  }

  createNewForm(): AgendaNewFormContent {
    return new AgendaNewFormContent();
  }

  validateFinanceConclusion() {
    const form = this.formValue();
    if (!form.financeConclusion && this.conclusion.isAccepted()) {
      throw 'Недопустимо положительное заключение при наличии отрицательной оценки ' +
      'в пункте ' + this.financeConclusionNum + '. Проект: ' + this.project.title;
    }
  }

  validateFinanceSuggestion() {
    if (this.formValue().financeSuggestion < 0) {
      throw 'Предложенная сумма финансирования не может быть меньше нуля. Проект: ' + this.project.title;
    }
  }

  get project() {
    return this._project;
  }

  set project(project: ProjectPlainDto) {
    this._project = project;
  }

  override setForm(form: AgendaNewFormContent) {
    if (!form) return;
    const normalized: AgendaNewFormContent = {
      ...form,
      termsSuggestion: form.termsSuggestion || new PeriodDto(),
      // clone to use NewVoteResults methods
      conclusion: NewVoteResults.clone(form.conclusion || new NewVoteResults()),
    };
    super.setForm(normalized);
  }

  getForm() {
    const form: AgendaNewFormContent = super.getForm();
    form.conclusion.notVoted = this.getAllParticipants() - this.conclusion.getVoted();
    return form;
  }

  getAllParticipants() {
    const parent = this.parent;
    const parentForm = parent?.formValue?.();
    return parentForm?.participants?.length ?? 0;
  }

  get conclusion() {
    return this.formValue().conclusion;
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
    // Блоки формы мутируют объект формы напрямую (через _form()/ngModel).
    // Для zoneless/OnPush важно явно триггерить signal-обновление.
    this.markFormChanged();
  }
}
