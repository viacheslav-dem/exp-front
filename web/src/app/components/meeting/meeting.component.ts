import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, computed, signal, viewChild, inject, DestroyRef} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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
import {AgendaService} from "@app/services/agenda.service";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {MeetingFormComponent} from "@app/components/meeting-form/meeting-form.component";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {LifecycleService} from "@app/services/lifecycle.service";
import {RemarksContainerDto} from "@app/dto/RemarksContainerDto";
import {MeetingProtocolFormComponent} from "@app/components/document-form/meeting-protocol-form/meeting-protocol-form.component";
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
export class MeetingComponent implements OnInit {

  MeetingStateBadge = MeetingStateBadge;
  Role = Role;

  readonly meeting = signal<MeetingDto | undefined>(undefined);
  readonly agendas = computed(() => this.meeting()?.agendas ?? []);
  role: string;
  readonly remarks = signal<RemarksContainerDto>(new RemarksContainerDto());

  readonly isCreatingProtocol = signal(false);
  readonly isFinishingMeeting = signal(false);

  protocolFormModal = viewChild<ModalComponent>("protocolFormModal");
  createMeetingModal = viewChild<MeetingFormComponent>(MeetingFormComponent);
  sectionRemarks = viewChild<ModalComponent>("sectionRemarks");
  bureauRemarks = viewChild<ModalComponent>("bureauRemarks");
  remarkResponseForSection = viewChild<ModalComponent>("remarkResponseForSection");
  remarkResponseForBureau = viewChild<ModalComponent>("remarkResponseForBureau");
  protocolForm = viewChild<MeetingProtocolFormComponent>(MeetingProtocolFormComponent);

  private readonly destroyRef = inject(DestroyRef);

  constructor(private _route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _authService: AuthService,
              private _agendaService: AgendaService,
              private _meetingService: MeetingService,
              private _dialogService: DialogService,
              private router: Router,
              private _lifecycleService: LifecycleService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this._route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.loadMeeting(new IdDto(params['id'])));
  }

  loadMeeting(idDto: IdDto) {
    this._meetingService.getMeeting(idDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.meeting.set(res);
          // agendas вычисляется автоматически через computed
        },
        error: () => {
          // Ошибка не меняет состояние, markForCheck не нужен
        }
      });
  }

  editMeeting() {
    const meeting = this.meeting();
    if (meeting) {
      this.createMeetingModal()?.show(meeting);
    }
  }

  onSave(meeting: MeetingDto) {
    this.meeting.set(meeting);
    // agendas вычисляется автоматически через computed
  }

  saveAgendaDecisions() {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    this._dialogService.showConfirmDialog(
      'Завершить заседание?', currentMeeting.description,
      'Пожалуйста, проверьте данные протокола, поскольку изменить их будет уже невозможно.'
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isFinishingMeeting.set(true);
          this._meetingService.finishMeeting(currentMeeting)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (res) => {
                this.isFinishingMeeting.set(false);
                this.meeting.set(res);
                // agendas вычисляется автоматически через computed
                this._toasty.success("Заседание завершено.");
                this.router.navigateByUrl('/meetings');
              },
              error: () => {
                this.isFinishingMeeting.set(false);
                this._toasty.error('Ошибка при завершении заседания');
              }
            });
        }
      });
  }

  cancelAgendaDecisions() {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('cancelReason', 'Причина отмены')],
      'Отменить заседание?', 'Вы действительно хотите отменить заседание?',
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (dlgResult: DialogResult<any>) => {
          let reason = "";
          if (dlgResult != null && dlgResult.value != null) {
            reason = dlgResult.value.cancelReason;
          }

          if (reason === null || reason === "") {
            throw "Необходимо указать причину отмены";
          }
          this._meetingService.cancelMeeting(currentMeeting, reason)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (res) => {
                this.meeting.set(res);
                // agendas вычисляется автоматически через computed
                this._toasty.success("Заседание отменено.");
              }
            });
        }
      });
  }

  generateMeetingProtocol(form) {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    this.isCreatingProtocol.set(true);
    // markForCheck не нужен - изменение сигнала автоматически триггерит change detection

    this._meetingService.generateCouncilMeetingProtocol(currentMeeting, form)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isCreatingProtocol.set(false);
          // Сначала закрываем модал, чтобы гарантировать его закрытие
          this.protocolFormModal()?.hide();
          this.protocolForm()?.close();
          // Затем обновляем meeting с новыми документами
          this.meeting.update(m => {
            if (!m) return m;
            return {
              ...m,
              report: res[0],
              paymentDocument: res[1]
            };
          });
          // Перезагружаем meeting для получения актуальных данных
          this.loadMeeting(new IdDto(currentMeeting.id));
        },
        error: () => {
          this.isCreatingProtocol.set(false);
          this._toasty.error('Ошибка при создании документа');
        }
      });
  }

  generateSectionRemark(project: ProjectCodePlainDto) {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    const dto = new RemarksContainerDto();
    dto.project = project;
    dto.meeting = currentMeeting;
    this._meetingService.getRemarks(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.remarks.set(value);
          this.sectionRemarks()?.show();
        }
      });
  }

  generateBureauRemark(project: ProjectCodePlainDto) {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    const dto = new RemarksContainerDto();
    dto.project = project;
    dto.meeting = currentMeeting;
    this._meetingService.getRemarks(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.remarks.set(value);
          this.bureauRemarks()?.show();
        }
      });
  }

  showCustomerAnswer(agenda: AgendaDto) {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    const dto = new RemarksContainerDto();
    dto.project = agenda.project;
    dto.meeting = currentMeeting;
    this._meetingService.getRemarks(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.remarks.set(value);
          if (this.role === Role.BUREAU_CHAIRMAN || this.role === Role.BUREAU_ASSESSOR) {
            this.remarkResponseForBureau()?.show();
          }
          if (this.role === Role.SECTION_CHAIRMAN || this.role === Role.SECTION_ASSESSOR) {
            this.remarkResponseForSection()?.show();
          }
        }
      });
  }


  deleteProtocol() {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    this._meetingService.deleteMeetingProtocol(currentMeeting.report, currentMeeting, () => {
      this.meeting.update(m => {
        if (!m) return m;
        return { ...m, report: null };
      });
    });
  }

  deleteProtocolAppendix() {
    const currentMeeting = this.meeting();
    if (!currentMeeting) {
      return;
    }
    this._meetingService.deleteMeetingProtocolAppendix(currentMeeting.paymentDocument, currentMeeting, () => {
      this.meeting.update(m => {
        if (!m) return m;
        return { ...m, paymentDocument: null };
      });
    });
  }

  loadComments(agenda: AgendaDto) {
    this._agendaService.getCommentsByAgenda(agenda)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          agenda.comments = res;
          this.cdr?.markForCheck?.();
        }
      });
  }

  loadDocuments(agenda: AgendaDto) {
    if (this.role === Role.BUREAU_CHAIRMAN) {
      this._agendaService.getSectionReportsByBureauAssessor(agenda)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            agenda.sectionProtocols = res;
            this.cdr?.markForCheck?.();
          }
        });
    }
    this._agendaService.getAgendaExpertReviews(agenda)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          agenda.expertReviews = res;
          this.cdr?.markForCheck?.();
        }
      });
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
    this._meetingService.saveSectionRemarks(remarks)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sectionRemarks()?.hide();
          this.cdr?.markForCheck?.();
        }
      });
  }

  saveBureauRemarks(remarks: RemarksContainerDto) {
    this._meetingService.saveBureauRemarks(remarks)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.bureauRemarks()?.hide();
          this.cdr?.markForCheck?.();
        }
      });
  }

  showProtocolForm() {
    const form = this.protocolForm();
    if (form) {
      form.prepareAgendaForms();
      form.startAutoSave();
    }
    this.protocolFormModal()?.show();
    // markForCheck не нужен - модал сам управляет своим состоянием
  }

  closeProtocolForm() {
    // Практичный вариант без рекурсии:
    // - НЕ вызываем `protocolForm.close()` (она эмитит onClose и может зациклить closeProtocolForm)
    // - но сохраняем черновик и останавливаем автосейв (поведение close() нам важно)
    const form = this.protocolForm();
    form?.saveDraft();
    form?.stopAutoSave();
    this.protocolFormModal()?.hide();
  }
}
