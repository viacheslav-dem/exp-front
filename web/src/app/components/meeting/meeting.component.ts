import {Component, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@app/services/auth.service";
import {Role} from "@app/pipes/role.pipe";
import {MeetingStateBadge} from "@app/pipes/meeting-state.pipe";
import {MeetingDto} from "@app/dto/MeetingDto";
import {AgendaDto} from "@app/dto/AgendaDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {MeetingService} from "@app/services/meeting.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {IdDto} from "@app/dto/IdDto";
import {ProjectService} from "@app/services/project.service";
import {AgendaService} from "@app/services/agenda.service";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {MeetingFormComponent} from "@app/components/meeting-form/meeting-form.component";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {LifecycleService} from "@app/services/lifecycle.service";
import {RemarksContainerDto} from "@app/dto/RemarksContainerDto";
import {MeetingProtocolFormComponent} from "@app/components/document-form/meeting-protocol-form/meeting-protocol-form.component";
import {Subscription} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-meeting',
    templateUrl: 'meeting.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.meetings)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class MeetingComponent implements OnInit, OnDestroy {

  MeetingStateBadge = MeetingStateBadge;
  Role = Role;

  meeting: MeetingDto;
  agendas: AgendaDto[] = [];
  role: string;
  remarks: RemarksContainerDto = new RemarksContainerDto();
  private subscriptions: Subscription[] = [];

  isCreatingProtocol = false;
  isFinishingMeeting = false;

  @ViewChild("protocolFormModal", { static: false }) protocolFormModal: ModalComponent;
  @ViewChild(MeetingFormComponent, { static: false }) createMeetingModal: MeetingFormComponent;
  @ViewChild("sectionRemarks", { static: false }) sectionRemarks: ModalComponent;
  @ViewChild("bureauRemarks", { static: false }) bureauRemarks: ModalComponent;
  @ViewChild("remarkResponseForSection", { static: false }) remarkResponseForSection: ModalComponent;
  @ViewChild("remarkResponseForBureau", { static: false }) remarkResponseForBureau: ModalComponent;
  @ViewChild(MeetingProtocolFormComponent, { static: false }) protocolForm: MeetingProtocolFormComponent;

  constructor(private _route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _authService: AuthService,
              private _agendaService: AgendaService,
              private _meetingService: MeetingService,
              private _projectService: ProjectService,
              private _dialogService: DialogService,
              private router: Router,
              private _lifecycleService: LifecycleService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this.subscriptions.push(
      this._route.params.subscribe(params => this.loadMeeting(new IdDto(params['id'])))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  loadMeeting(idDto: IdDto) {
    this.subscriptions.push(
      this._meetingService.getMeeting(idDto).subscribe(res => {
        this.meeting = res;
        this.agendas = this.meeting.agendas;
        this.cdr?.markForCheck?.();
      })
    );
  }

  editMeeting() {
    this.createMeetingModal.show(this.meeting);
  }

  onSave(meeting: MeetingDto) {
    this.meeting = meeting;
    this.agendas = meeting.agendas;
    this.cdr?.markForCheck?.();
  }

  saveAgendaDecisions() {
    this.subscriptions.push(
      this._dialogService.showConfirmDialog(
        'Завершить заседание?', this.meeting.description,
        'Пожалуйста, проверьте данные протокола, поскольку изменить их будет уже невозможно.'
      ).subscribe(() => {
        this.isFinishingMeeting = true;
        this.cdr?.markForCheck?.();
        this.subscriptions.push(
          this._meetingService.finishMeeting(this.meeting).subscribe({
            next: (res) => {
              this.isFinishingMeeting = false;
              this.meeting = res;
              this.agendas = this.meeting.agendas;
              this._toasty.success("Заседание завершено.");
              this.cdr?.markForCheck?.();
              this.router.navigateByUrl('/meetings');
            },
            error: () => {
              this.isFinishingMeeting = false;
              this._toasty.error('Ошибка при завершении заседания');
              this.cdr?.markForCheck?.();
            }
          })
        );
      })
    );
  }

  cancelAgendaDecisions() {
    this.subscriptions.push(
      this._dialogService.showConfirmDialogWithFields(
        [new ConfirmDialogField<string>('cancelReason', 'Причина отмены')],
        'Отменить заседание?', 'Вы действительно хотите отменить заседание?',
      ).subscribe((dlgResult: DialogResult<any>) => {
        let reason = "";
        if (dlgResult != null && dlgResult.value != null) {
          reason = dlgResult.value.cancelReason;
        }

        if (reason === null || reason === "") {
          throw "Необходимо указать причину отмены";
        }
        this.subscriptions.push(
          this._meetingService.cancelMeeting(this.meeting, reason).subscribe(res => {
            this.meeting = res;
            this.agendas = this.meeting.agendas;
            this._toasty.success("Заседание отменено.");
            this.cdr?.markForCheck?.();
          })
        );
      })
    );
  }

  generateMeetingProtocol(form) {
    this.isCreatingProtocol = true;
    this.cdr?.markForCheck?.();

    this.subscriptions.push(
      this._meetingService.generateCouncilMeetingProtocol(this.meeting, form)
        .subscribe({
          next: (res) => {
            this.isCreatingProtocol = false;
            this.meeting.report = res[0];
            this.meeting.paymentDocument = res[1];
            this.closeProtocolForm();
            this.loadMeeting(this.meeting);
            this.cdr?.markForCheck?.();
          },
          error: () => {
            this.isCreatingProtocol = false;
            this._toasty.error('Ошибка при создании документа');
            this.cdr?.markForCheck?.();
          }
        })
    );
  }

  generateSectionRemark(project: ProjectCodePlainDto) {
    const dto = new RemarksContainerDto();
    dto.project = project;
    dto.meeting = this.meeting;
    this.subscriptions.push(
      this._meetingService.getRemarks(dto).subscribe(value =>
        this.remarks = value
      )
    );
    this.sectionRemarks.show();
    this.cdr?.markForCheck?.();
  }

  generateBureauRemark(project: ProjectCodePlainDto) {
    const dto = new RemarksContainerDto();
    dto.project = project;
    dto.meeting = this.meeting;
    this.subscriptions.push(
      this._meetingService.getRemarks(dto).subscribe(value =>
        this.remarks = value
      )
    );
    this.bureauRemarks.show();
    this.cdr?.markForCheck?.();
  }

  showCustomerAnswer(agenda: AgendaDto) {
    const dto = new RemarksContainerDto();
    dto.project = agenda.project;
    dto.meeting = this.meeting;
    this.subscriptions.push(
      this._meetingService.getRemarks(dto).subscribe(value =>
        this.remarks = value
      )
    );
    if (this.role === Role.BUREAU_CHAIRMAN || this.role === Role.BUREAU_ASSESSOR) {
      this.remarkResponseForBureau.show();
    }
    if (this.role === Role.SECTION_CHAIRMAN || this.role === Role.SECTION_ASSESSOR) {
      this.remarkResponseForSection.show();
    }
    this.cdr?.markForCheck?.();
  }


  deleteProtocol() {
    this._meetingService.deleteMeetingProtocol(this.meeting.report, this.meeting, () =>
      this.meeting.report = null);
    this.cdr?.markForCheck?.();
  }

  deleteProtocolAppendix() {
    this._meetingService.deleteMeetingProtocolAppendix(this.meeting.paymentDocument, this.meeting, () =>
      this.meeting.paymentDocument = null);
    this.cdr?.markForCheck?.();
  }

  loadComments(agenda: AgendaDto) {
    this.subscriptions.push(
      this._agendaService.getCommentsByAgenda(agenda)
        .subscribe(res => {
          agenda.comments = res;
          this.cdr?.markForCheck?.();
        })
    );
  }

  loadDocuments(agenda: AgendaDto) {
    if (this.role === Role.BUREAU_CHAIRMAN) {
      this.subscriptions.push(
        this._agendaService.getSectionReportsByBureauAssessor(agenda)
          .subscribe(res => {
            agenda.sectionProtocols = res;
            this.cdr?.markForCheck?.();
          })
      );
    }
    this.subscriptions.push(
      this._agendaService.getAgendaExpertReviews(agenda)
        .subscribe(res => {
          agenda.expertReviews = res;
          this.cdr?.markForCheck?.();
        })
    );
  }

  loadAgendaData(agenda: AgendaDto) {
    if (!agenda.comments) {
      this.loadComments(agenda);
      this.loadDocuments(agenda);
    }
    agenda.isCollapsed = !agenda.isCollapsed;
    this.cdr?.markForCheck?.();
  }

  saveSectionRemarks(remarks: RemarksContainerDto) {
    this.subscriptions.push(
      this._meetingService.saveSectionRemarks(remarks).subscribe(value =>
        this.sectionRemarks.hide())
    );
    this.cdr?.markForCheck?.();
  }

  saveBureauRemarks(remarks: RemarksContainerDto) {
    this.subscriptions.push(
      this._meetingService.saveBureauRemarks(remarks).subscribe(value =>
        this.bureauRemarks.hide())
    );
    this.cdr?.markForCheck?.();
  }

  showProtocolForm() {
    this.protocolForm.prepareAgendaForms();
    this.protocolFormModal.show();
    this.protocolForm.startAutoSave();
    this.cdr?.markForCheck?.();
  }

  closeProtocolForm() {
    this.protocolForm.close();
  }
}
