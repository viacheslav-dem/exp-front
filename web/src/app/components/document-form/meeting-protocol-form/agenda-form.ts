import {Directive, viewChild, viewChildren} from "@angular/core";
import {DocumentForm} from "app/components/document-form/document-form";
import {ProjectPlainDto} from "@app/dto/ProjectPlainDto";
import {AgendaOldFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaOldFormContent";
import {isEmptyOrNull} from "@app/support/utils";
import {MeetingProtocolFormComponent} from "@app/components/document-form/meeting-protocol-form/meeting-protocol-form.component";
import {VoteResultsComponent} from "@app/components/document-form/vote-results/vote-results.component";
import {VoteResults} from "@app/components/document-form/meeting-protocol-form/VoteResults";

@Directive()
export abstract class AgendaForm extends DocumentForm<AgendaOldFormContent> {

  ind: number;
  project: ProjectPlainDto;
  parent: MeetingProtocolFormComponent;
  customerReplies: boolean = false;
  stages: { name: string }[] = [];
  privacyObjects: { name: string }[] = [];
  readonly voteComponents = viewChildren(VoteResultsComponent);

  readonly singleVoteComponent = viewChild<VoteResultsComponent>('singleVote');
  readonly rescheduled = viewChild<VoteResultsComponent>('rescheduled');

  singleVoteResult: VoteResults = new VoteResults();

  canRescheduled: boolean = false;
  singleVoteMode: boolean = true;
  isRescheduledForm: boolean = false;

  constructor() {
    super();
  }

  createNewForm(): AgendaOldFormContent {
    return new AgendaOldFormContent();
  }

  abstract isAccepted(): boolean;

  abstract getVoted(): number;

  abstract isRescheduled(): boolean;

  getForm() {
    let form: AgendaOldFormContent = super.getForm();
    form.stages = this.isAccepted() ? this.stages.map(obj => obj.name).filter(str => !isEmptyOrNull(str)) : [];
    form.privacyObjects = this.privacyObjects.map(obj => obj.name).filter(str => !isEmptyOrNull(str));
    form.accepted = this.isAccepted();
    form.voted = this.getVoted();
    form.customerReplies = this.customerReplies ? "представленных" : "непредставленных";
    form.isRescheduled = this.isRescheduled();
    return form;
  }

  validate() {
    if (this.singleVoteMode && !this.isRescheduledForm) {
      const single = this.singleVoteComponent();
      // В проде возможны временные рассинхронизации viewChild (особенно при zoneless/async рендере).
      // Не падаем, если single ещё не доступен.
      if (single) {
        this.voteComponents().forEach(item => {
          item.value.accepted = single.value.accepted;
          item.value.rejected = single.value.rejected;
          item.value.isAcceptedByChairman = single.value.isAcceptedByChairman;
        });
      }
    }
    super.validate();
    const participantsCount = this.parent?.formValue?.()?.participants?.length ?? 0;
    if (this.getVoted() > participantsCount) {
      throw 'Количество проголосовавших превышает число участников заседания.';
    }
    if (this.isRescheduledForm && !this.isRescheduled()) {
      throw 'Решение по переносу заседания не может быть отрицательным.';
    }

  }

  toggleVote(enable: boolean) {
    if (!this.isRescheduledForm) {
      this.voteComponents().forEach(item => {
        item.display = !enable;
      });
      const single = this.singleVoteComponent();
      if (single) {
        single.display = enable;
      }
    }
  }
}
