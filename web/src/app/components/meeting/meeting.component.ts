import {Component, OnInit, ViewChild} from "@angular/core";
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

@Component({
  selector: 'app-meeting',
  templateUrl: 'meeting.component.html'
})
export class MeetingComponent implements OnInit {

  MeetingStateBadge = MeetingStateBadge;
  Role = Role;

  meeting: MeetingDto;
  agendas: AgendaDto[] = [];
  role: string;
  remarks: RemarksContainerDto = new RemarksContainerDto();

  @ViewChild("protocolFormModal") protocolFormModal: ModalComponent;
  @ViewChild(MeetingFormComponent) createMeetingModal: MeetingFormComponent;
  @ViewChild("sectionRemarks") sectionRemarks: ModalComponent;
  @ViewChild("bureauRemarks") bureauRemarks: ModalComponent;
  @ViewChild("remarkResponseForSection") remarkResponseForSection: ModalComponent;
  @ViewChild("remarkResponseForBureau") remarkResponseForBureau: ModalComponent;
  @ViewChild(MeetingProtocolFormComponent) protocolForm: MeetingProtocolFormComponent;

  constructor(private _route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _authService: AuthService,
              private _agendaService: AgendaService,
              public _meetingService: MeetingService,
              private _projectService: ProjectService,
              private _dialogService: DialogService,
              private router: Router,
              private _lifecycleService: LifecycleService) {
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this._route.params.subscribe(params => this.loadMeeting(new IdDto(params['id'])));
  }

  loadMeeting(idDto: IdDto) {
    this._meetingService.getMeeting(idDto).subscribe(res => {
      this.meeting = res;
      this.agendas = this.meeting.agendas;
    });
  }

  editMeeting() {
    this.createMeetingModal.show(this.meeting);
  }

  onSave(meeting: MeetingDto) {
    this.meeting = meeting;
    this.agendas = meeting.agendas;
  }

  saveAgendaDecisions() {
    this._dialogService.showConfirmDialog(
      'Завершить заседание?', this.meeting.description,
      'Пожалуйста, проверьте данные протокола, поскольку изменить их будет уже невозможно.'
    ).subscribe(() => {
      this._meetingService.finishMeeting(this.meeting).subscribe(res => {
        this.meeting = res;
        this.agendas = this.meeting.agendas;
        this._toasty.success("Заседание завершено.");
        this.router.navigateByUrl('/meetings');
      });
    });
  }

  cancelAgendaDecisions() {
    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('cancelReason', 'Причина отмены')],
      'Отменить заседание?', 'Вы действительно хотите отменить заседание?',
    ).subscribe((dlgResult: DialogResult<any>) => {
      let reason = "";
      if (dlgResult != null && dlgResult.value != null)
        reason = dlgResult.value.cancelReason;

      if (reason == null || reason == "")
        throw "Необходимо указать причину отмены";
      this._meetingService.cancelMeeting(this.meeting, reason).subscribe(res => {
        this.meeting = res;
        this.agendas = this.meeting.agendas;
        this._toasty.success("Заседание отменено.");
      });
    });
  }

  generateMeetingProtocol(form) {
    this._meetingService.generateCouncilMeetingProtocol(this.meeting, form)
      .subscribe(res => {
        this.meeting.report = res[0];
        this.meeting.paymentDocument = res[1];
        this.closeProtocolForm();
        this.loadMeeting(this.meeting);
      });
  }

  generateSectionRemark(project: ProjectCodePlainDto) {
    let dto = new RemarksContainerDto();
    dto.project = project;
    dto.meeting = this.meeting;
    this._meetingService.getRemarks(dto).subscribe(value =>
      this.remarks = value
    );
    this.sectionRemarks.show();
  }

  generateBureauRemark(project: ProjectCodePlainDto) {
    let dto = new RemarksContainerDto();
    dto.project = project;
    dto.meeting = this.meeting;
    this._meetingService.getRemarks(dto).subscribe(value =>
      this.remarks = value
    );
    this.bureauRemarks.show();

  }

  showCustomerAnswer(agenda: AgendaDto) {
    let dto = new RemarksContainerDto();
    dto.project = agenda.project;
    dto.meeting = this.meeting;
    this._meetingService.getRemarks(dto).subscribe(value =>
      this.remarks = value
    );
    if (this.role == Role.BUREAU_CHAIRMAN || this.role == Role.BUREAU_ASSESSOR) {
      this.remarkResponseForBureau.show()
    }
    if (this.role == Role.SECTION_CHAIRMAN || this.role == Role.SECTION_ASSESSOR) {
      this.remarkResponseForSection.show()
    }
  }


  deleteProtocol() {
    this._meetingService.deleteMeetingProtocol(this.meeting.report, this.meeting, () =>
      this.meeting.report = null);
  }

  deleteProtocolAppendix() {
    this._meetingService.deleteMeetingProtocolAppendix(this.meeting.paymentDocument, this.meeting, () =>
      this.meeting.paymentDocument = null);
  }

  loadComments(agenda: AgendaDto) {
    this._agendaService.getCommentsByAgenda(agenda)
      .subscribe(res => agenda.comments = res);
  }

  loadDocuments(agenda: AgendaDto) {
    if (this.role == Role.BUREAU_CHAIRMAN) {
      this._agendaService.getSectionReportsByBureauAssessor(agenda)
        .subscribe(res => agenda.sectionProtocols = res)
    }
    this._agendaService.getAgendaExpertReviews(agenda)
      .subscribe(res => agenda.expertReviews = res)
  }

  loadAgendaData(agenda: AgendaDto) {
    if (!agenda.comments) {
      this.loadComments(agenda);
      this.loadDocuments(agenda);
    }
    agenda.isCollapsed = !agenda.isCollapsed;
  }

  saveSectionRemarks(remarks: RemarksContainerDto) {
    this._meetingService.saveSectionRemarks(remarks).subscribe(value =>
      this.sectionRemarks.hide());

  }

  saveBureauRemarks(remarks: RemarksContainerDto) {
    this._meetingService.saveBureauRemarks(remarks).subscribe(value =>
      this.bureauRemarks.hide());
  }

  showProtocolForm() {
    this.protocolForm.prepareAgendaForms();
    this.protocolFormModal.show();
    this.protocolForm.startAutoSave();
  }

  closeProtocolForm() {
    this.protocolForm.close();
  }
}
