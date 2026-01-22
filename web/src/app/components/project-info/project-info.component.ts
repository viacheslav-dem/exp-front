import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, signal, computed} from "@angular/core";
import {finalize} from "rxjs";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "@app/services/auth.service";
import {SearchExpertComponent} from "../search/search-person/search-expert/search-expert.component";
import {PersonService} from "@app/services/person.service";
import {Role} from "@app/pipes/role.pipe";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {CryptoService} from "@app/crypto/crypto.service";
import {ProgressService} from "@app/components/common-components/progress/progress.service";
import {ProjectState} from "@app/pipes/project-state.pipe";
import {SearchGkntWorkerComponent} from "@app/components/search/search-person/search-gknt-worker.component";
import {anyMatch} from "@app/support/utils";
import {MeetingService} from "@app/services/meeting.service";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectLifecycleState} from "@app/pipes/lifecycle-state.pipe";
import {ExpertReviewState} from "@app/pipes/review-state.pipe";
import {IdDto} from "@app/dto/IdDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PersonFullNamePipe} from "@app/pipes/person-full-name.pipe";
import * as _ from "lodash";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ConfirmDialogField} from "@app/components/dialogs/confirm-dialog/ConfirmDialogField";
import {DialogResult} from "@app/components/dialogs/dialog-result";
import {ProjectService} from "@app/services/project.service";
import {ExpertReviewService} from "@app/services/expert-review.service";
import {LifecycleGroupService} from "@app/services/lifecycle-group.service";
import {LifecycleService} from "@app/services/lifecycle.service";
import {AgendaService} from "@app/services/agenda.service";
import {ExpertReviewDto} from "@app/dto/ExpertReviewDto";
import {LifecycleGroupState} from "@app/pipes/lifecycle-group-state.pipe";
import {ProjectCopyDto} from "@app/dto/ProjectCopyDto";
import {SameProjectListComponent} from "@app/components/same-project-list/same-project-list.component";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {ReturnFromCouncilWithoutExpertiseFormContent} from "@app/components/document-form/form-model/ReturnFromCouncilWithoutExpertiseFormContent";
import {DocumentDto} from "@app/dto/DocumentDto";
import {DocumentService} from "@app/services/document.service";
import {ActionButtonMetadata} from "./action-button-metadata";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-project-info',
    templateUrl: 'project-info.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectDetail) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class ProjectInfoComponent implements OnInit, OnDestroy {

  Role = Role; // enum for template

  agreement: boolean = false;

  currentUser: any;
  role: string;
  project: ProjectDto;
  editedProject: ProjectDto;
  copiedProject: ProjectCopyDto;
  listSameProjects: ProjectDto[] = [];
  lifecycleRemark: ProjectLifecycleDto = new ProjectLifecycleDto();

  // for assessors
  agenda: IdDto;
  sectionReports: any[];
  reviews: any[];

  // for bureau chairman
  lifecycleGroup: LifecycleGroupDto;

  // for section chairman
  lifecycle: any;

  // Signals для computed values
  private readonly _roleSignal = signal<string | undefined>(undefined);
  private readonly _lifecycleGroupSignal = signal<LifecycleGroupDto | undefined>(undefined);
  private readonly _lifecycleSignal = signal<any | undefined>(undefined);
  private readonly _projectSignal = signal<ProjectDto | undefined>(undefined);
  private readonly _lifecycleGroupsSignal = signal<any[]>([]);
  private readonly _expertReviewSignal = signal<ExpertReviewDto | undefined>(undefined);
  readonly sameProjectsLoading = signal<boolean>(false);

  // for gknt, customer and belisa
  lifecycleGroups: any[] = [];

  // for expert
  expertReview: ExpertReviewDto;
  visibleDocsForExpert: boolean = false;

  @ViewChild(SearchExpertComponent, { static: false }) public searchExpertComponent: SearchExpertComponent;
  @ViewChild(SearchGkntWorkerComponent, { static: false }) searchGkntWorkerComponent: SearchGkntWorkerComponent;
  @ViewChild('editProjectModal', { static: false }) editProjectModal: ModalComponent;
  @ViewChild('returnFromCouncilWithoutExpertiseModal', { static: false }) returnFromCouncilWithoutExpertiseModal: ModalComponent;
  @ViewChild('copyProjectModal', { static: false }) copyProjectModal: ModalComponent;
  @ViewChild('expertRejectProject', { static: false }) expertRejectProject: ModalComponent;
  @ViewChild('expertAgreement', { static: false }) expertAgreement: ModalComponent;
  @ViewChild('listProjects', { static: false }) listProjects: ModalComponent;
  @ViewChild(SameProjectListComponent, { static: false }) sameProjectList: SameProjectListComponent;

  constructor(private route: ActivatedRoute,
              private _toasty: GlobalToastyService,
              private _projectService: ProjectService,
              private router: Router,
              private _authService: AuthService,
              private _personService: PersonService,
              private _service: PersonService,
              private _cryptoService: CryptoService,
              private _groupService: LifecycleGroupService,
              private _lifecycleService: LifecycleService,
              private _progress: ProgressService,
              private _agendaService: AgendaService,
              private _meetingService: MeetingService,
              private _reviewService: ExpertReviewService,
              private _dialogService: DialogService,
              private _personPipe: PersonFullNamePipe,
              private _documentService: DocumentService,
              private cdr: ChangeDetectorRef) {
  }

  private paramsSubscription: any;
  private _lastLoadedProjectId: number | undefined;

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this._roleSignal.set(this.role);
    this._personService.getCurrentPerson().subscribe(res => {
      this.currentUser = res;
      this.cdr?.markForCheck?.();
    });
    this.paramsSubscription = this.route.params.subscribe(params => {
      const projectId = parseInt(params['id'], 10);
      // Защита от повторных вызовов loadProject с тем же id
      if (this._lastLoadedProjectId === projectId && this.project && this.project.id === projectId) {
        return;
      }
      this._lastLoadedProjectId = projectId;
      this.agenda = params['agendaId'] ? new IdDto(params['agendaId']) : null;
      this.loadProject(new IdDto(params['id']), params['group']);
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  loadLifecycle() {
    this._projectService.getLifecycle(this.project).subscribe(res => {
      this.updateLifecycleSignal(res);
      // markForCheck не нужен: computed signal visibleForSection автоматически триггерит change detection
    });
  }

  loadLifecycleGroups() {
    this._projectService.getLifecycleGroups(this.project).subscribe(res => {
      this.updateLifecycleGroupsSignal(res);
      // computed signal buttons пересчитается автоматически
    });
  }

  loadLifecycleGroup() {
    this._projectService.getLifecycleGroup(this.project).subscribe(res => {
      this.updateLifecycleGroupSignal(res);
      // markForCheck не нужен: computed signal visibleForBureau автоматически триггерит change detection
    });
  }

  loadProject(idDto: IdDto, group: string) {
    this._projectService.getProject(idDto).subscribe({
      next: (res) => {
        // Проверяем, действительно ли объект изменился, чтобы избежать ненужных обновлений
        if (this.project && this.project.id === res.id && this.project === res) {
          return;
        }
        this.updateProjectSignal(res);
        if (group != null && group != 'null' && typeof group === 'string' && !group.includes('=>')) {
          this._projectService.markViewed(this.project, group).subscribe();
        }
        this.showProjectDocuments();
        if (this.role == Role.BUREAU_ASSESSOR) {
          this.loadAnonymousExpertReviews();
          this.loadLifecycleGroup();
          // Протоколы заседаний будут загружены из lifecycleGroup в updateLifecycleGroupSignal
          if (this.agenda) {
            this.loadSectionReports();
          }
        } else if (this.role == Role.SECTION_ASSESSOR) {
          this.loadAnonymousExpertReviews();
        } else if (this.role == Role.BUREAU_CHAIRMAN) {
          this.loadLifecycleGroup();
        } else if (this.role == Role.SECTION_CHAIRMAN) {
          this.loadLifecycle();
        } else if (anyMatch(this.role,
          Role.GKNT_WORKER, Role.GKNT_CHAIRMAN, Role.GKNT_DEPARTMENT_CHAIRMAN,
          Role.BELISA_READ, Role.BELISA_EDIT, Role.CUSTOMER)
        ) {
          this.loadLifecycleGroups();
          if (this.role == Role.CUSTOMER) {
            this.loadAnonymousExpertReviews();
          }
        } else if (this.role == Role.EXPERT) {
          this.loadExpertReview();
        }
        // computed signal buttons пересчитается автоматически после загрузки данных
      },
      error: (err) => {
        // Error is already handled by HttpClientSecure.handleError which shows toast
        // Just prevent it from propagating to global error handler
        console.error('Error loading project:', err);
        this.cdr?.markForCheck?.();
      }
    })
  }

  loadExpertReview() {
    this._projectService.getReview(this.project).subscribe(res => {
      this.updateExpertReviewSignal(res);
      this.showProjectDocuments();
    });
  }

  loadSectionReports() {
    this._agendaService.getSectionReportsByBureauAssessor(this.agenda).subscribe(res => {
      this.sectionReports = res;
      this.cdr?.markForCheck?.();
    });
  }

  loadAnonymousExpertReviews() {
    this._projectService.getAnonymousReviews(this.project).subscribe(res => {
      this.reviews = res;
      this.cdr?.markForCheck?.();
    });
  }

  // Computed signals для видимости блоков
  readonly visibleForBureau = computed(() => {
    const role = this._roleSignal();
    const lifecycleGroup = this._lifecycleGroupSignal();
    return (anyMatch(role, Role.BUREAU_CHAIRMAN, Role.BUREAU_ASSESSOR) && lifecycleGroup != null
      && lifecycleGroup.state == ProjectLifecycleState.RETURNED) ||
      (anyMatch(role, Role.BUREAU_CHAIRMAN, Role.BUREAU_ASSESSOR) && lifecycleGroup == null);
  });

  readonly visibleForSection = computed(() => {
    const role = this._roleSignal();
    const lifecycle = this._lifecycleSignal();
    const notSection: boolean = !anyMatch(role, Role.SECTION_CHAIRMAN, Role.SECTION_ASSESSOR);
    const isLifecycleState: boolean = lifecycle != null && lifecycle.state != ProjectLifecycleState.RETURNED_WITHOUT_EXPERTISE;
    return notSection || isLifecycleState;
  });

  readonly canChooseExperts = computed(() => {
    const project = this._projectSignal();
    const role = this._roleSignal();
    const lifecycle = this._lifecycleSignal();
    return project != null && (
      (project.state == ProjectState.ON_EXPERT_EXAMINATION &&
        anyMatch(role, Role.GKNT_DEPARTMENT_CHAIRMAN, Role.BUREAU_CHAIRMAN)) ||
      (lifecycle && lifecycle.state == ProjectLifecycleState.ON_EXPERT_EXAMINATION &&
        role == Role.SECTION_CHAIRMAN)
    );
  });

  // Computed signal для кнопок действий
  readonly buttons = computed(() => {
    // Читаем все зависимости для установления реактивных связей
    const project = this._projectSignal();
    const role = this._roleSignal();
    const lifecycleGroup = this._lifecycleGroupSignal();
    const lifecycle = this._lifecycleSignal();
    const lifecycleGroups = this._lifecycleGroupsSignal();
    const expertReview = this._expertReviewSignal();
    if (!project) return [];

    const buttons: ActionButtonMetadata[] = [];

    // Схожие объекты для BELISA и GKNT ролей
    if (role == Role.BELISA_EDIT || role == Role.BELISA_READ || role == Role.GKNT_CHAIRMAN
      || role == Role.GKNT_DEPARTMENT_CHAIRMAN || role == Role.GKNT_WORKER) {
      buttons.push(new ActionButtonMetadata(
        'Схожие объекты',
        () => this.findTheSameProjects(project.title),
        'btn-primary',
        {
          key: 'same-projects',
          isLoading: () => this.sameProjectsLoading(),
          isDisabled: () => this.sameProjectsLoading()
        }
      ));
    }

    // CUSTOMER и SUB_CUSTOMER
    if (role == Role.CUSTOMER || role == Role.SUB_CUSTOMER) {
      buttons.push(new ActionButtonMetadata('Копировать', () => this.copyProject(), 'btn-primary'));
    }

    if ((role == Role.CUSTOMER || role == Role.SUB_CUSTOMER) && project.state == ProjectState.ROUGH) {
      buttons.push(new ActionButtonMetadata('Редактировать', () => this.editProject(), 'btn-primary'));
      if (project.documents.length != 0 && role == Role.CUSTOMER) {
        buttons.push(new ActionButtonMetadata('На экспертизу', () => this.sendOnExamination(), 'btn-primary'));
      }
      if (project.documents.length != 0 && role == Role.SUB_CUSTOMER) {
        buttons.push(new ActionButtonMetadata('На утверждение', () => this.sendToHeadOrg(), 'btn-primary'));
      }
      buttons.push(new ActionButtonMetadata('Удалить', () => this.deleteProject(), 'btn-danger'));
    }

    if (project.documents.length != 0 && role == Role.CUSTOMER && project.state == ProjectState.FOR_APPROVAL) {
      buttons.push(new ActionButtonMetadata('На экспертизу', () => this.sendOnExamination(), 'btn-primary'));
      buttons.push(new ActionButtonMetadata('Вернуть инициатору экспертизы', () => this.sendToSubCustomer(), 'btn-danger'));
    }

    // BUREAU_CHAIRMAN
    if (lifecycleGroup && role == Role.BUREAU_CHAIRMAN) {
      if (lifecycleGroup.state == 'ON_CHECKING' && lifecycleGroup.lifecycles.length > 0) {
        buttons.push(new ActionButtonMetadata('Отправить в секции', () => this.sendBySections(), 'btn-primary'));
      }
      if (lifecycleGroup.state == 'ON_CONCLUSION') {
        buttons.push(new ActionButtonMetadata('Завершить экспертизу', () => this.finishLifecycleGroup(), 'btn-primary'));
      }
      if (project.state == ProjectState.ON_EXPERT_EXAMINATION && project.expertReviews.length == 0) {
        buttons.push(new ActionButtonMetadata('Вернуть в ГКНТ', () => this.showReturnFromCouncilModal(), 'btn-secondary'));
      }
      if (this.checkPossibleToReturnToGKNT(lifecycleGroup, project, role)) {
        buttons.push(new ActionButtonMetadata('Вернуть в ГКНТ без рассмотрения', () => this.returnFromBureauToGKNTWithoutExamination(), 'btn-secondary'));
      }
    }

    // SECTION_CHAIRMAN
    if (role == Role.SECTION_CHAIRMAN && lifecycle && lifecycle.state == ProjectLifecycleState.ON_EXPERT_EXAMINATION) {
      buttons.push(new ActionButtonMetadata('Перейти к рассмотрению в секции', () => this.finishChoosingExperts(), 'btn-primary'));
      buttons.push(new ActionButtonMetadata('Вернуть в бюро ГЭС', () => this.returnFromSectionToCouncil(), 'btn-secondary'));
    }

    if (role == Role.SECTION_CHAIRMAN && lifecycle
      && lifecycle.state == ProjectLifecycleState.ON_WAITING_RESPONSE
      && !lifecycle.isAnswerReceived && project.isRescheduleSection
      && project.isSectionRemarksExpired) {
      buttons.push(new ActionButtonMetadata('Вернуть в бюро ГЭС без рассмотрения', () => this.returnFromSectionToCouncilWithoutExamination(), 'btn-secondary'));
    }

    // EXPERT
    if (expertReview && role == Role.EXPERT) {
      if (expertReview.state == 'ON_EXPERT_CONFIRMATION') {
        buttons.push(new ActionButtonMetadata('Принять', () => this.acceptProject(), 'btn-primary'));
        buttons.push(new ActionButtonMetadata('Отклонить', () => this.expertRejectProject.show(), 'btn-secondary'));
      }
      if (expertReview.state == 'ON_EXAMINATION' && expertReview.documents.length > 0) {
        buttons.push(new ActionButtonMetadata('Завершить', () => this.finishExpertExamination(), 'btn-primary'));
      }
    }

    // GKNT_CHAIRMAN
    if (role == Role.GKNT_CHAIRMAN) {
      if (project.state == 'ON_SIGNING') {
        buttons.push(new ActionButtonMetadata('Вернуть в подразделение', () => this.returnOnDepartmentSigning(), 'btn-primary'));

        if (project.decisionDocument) {
          buttons.push(new ActionButtonMetadata('Подписать и отправить письмо заказчику', () => this.returnProjectWithSign(), 'btn-primary'));
          buttons.push(new ActionButtonMetadata('Отправить письмо заказчику без ЭЦП', () => this.returnProjectWithoutSign(), 'btn-warning'));
        }
        if (this.hasReferralsForAllActiveGroups(lifecycleGroups)) {
          buttons.push(new ActionButtonMetadata('Подписать и отправить в ГЭС', () => this.sendOnExaminationToCouncilsWithSign(), 'btn-primary'));
          buttons.push(new ActionButtonMetadata('Отправить в ГЭС без ЭЦП', () => this.sendOnExaminationToCouncilsWithoutSign(), 'btn-warning'));
        }
      }
      if (project.state == 'ON_FINAL_SIGNING') {
        buttons.push(new ActionButtonMetadata('Вернуть в подразделение', () => this.returnOnDepartmentFinalSigning(), 'btn-primary'));
        buttons.push(new ActionButtonMetadata('Подписать и отправить письма заказчику', () => this.finishProjectWithSign(), 'btn-primary'));
        buttons.push(new ActionButtonMetadata('Отправить письма заказчику без ЭЦП', () => this.finishProjectWithoutSign(), 'btn-warning'));
      }
    }

    // GKNT_DEPARTMENT_CHAIRMAN
    if (role == Role.GKNT_DEPARTMENT_CHAIRMAN) {
      if (!anyMatch(project.state, ProjectState.ACCEPTED, ProjectState.REJECTED, ProjectState.RETURNED)) {
        buttons.push(new ActionButtonMetadata('Назначить сотрудника', () => this.searchGkntWorkerComponent.show(), 'btn-primary'));
      }
      if (project.state == 'ON_DEPARTMENT_SIGNING') {
        buttons.push(new ActionButtonMetadata('Вернуть назначенному сотруднику', () => this.returnOnChecking(), 'btn-primary'));

        if (this.hasReferralsForAllActiveGroups(lifecycleGroups)) {
          buttons.push(new ActionButtonMetadata('Подписать направления в ГЭС', () => this.sendOnSigningWithSignReferrals(), 'btn-primary'));
          buttons.push(new ActionButtonMetadata('Отправить направления в ГЭС без ЭЦП', () => this.sendOnSigningWithoutSign(), 'btn-warning'));
        }
        if (project.decisionDocument) {
          buttons.push(new ActionButtonMetadata('Подписать письмо заказчику', () => this.sendOnSigningWithSignDecision(), 'btn-primary'));
          buttons.push(new ActionButtonMetadata('Передать письмо на визирование без ЭЦП', () => this.sendOnSigningWithoutSign(), 'btn-warning'));
        }
      }
      if (project.state == 'ON_DEPARTMENT_FINAL_SIGNING' && this.hasAllLifecycleGroupDecisions(lifecycleGroups)) {
        buttons.push(new ActionButtonMetadata('Подписать письма заказчику', () => this.sendOnFinalSigningWithSign(), 'btn-primary'));
        buttons.push(new ActionButtonMetadata('Передать письма на визирование без ЭЦП', () => this.sendOnFinalSigningWithoutSign(), 'btn-warning'));
      }
    }

    // GKNT_WORKER
    if (role == Role.GKNT_WORKER && project.state == 'ON_CHECKING') {
      if (this.hasReferralsForAllActiveGroups(lifecycleGroups)) {
        buttons.push(new ActionButtonMetadata('Отправить на визирование направлений в ГЭС', () => this.sendOnDepartmentSigning(), 'btn-primary'));
      }
      if (project.decisionDocument) {
        buttons.push(new ActionButtonMetadata('Вернуть без рассмотрения', () => this.sendOnDepartmentSigning(), 'btn-primary'));
      }
    }

    return buttons;
  });

  // Вспомогательные методы для обновления signals
  // Signals отслеживают изменения по ссылкам (reference equality).
  // Копирование необходимо только там, где объекты/массивы могут быть мутированы.
  
  private updateProjectSignal(project: ProjectDto) {
    // Объект приходит из API или дочерних компонентов, уже новый - копирование не требуется
    this.project = project;
    this._projectSignal.set(project);
  }

  private updateLifecycleGroupSignal(lifecycleGroup: LifecycleGroupDto) {
    // ВАЖНО: lifecycle-group.component мутирует _group.lifecycles.push(res) перед эмитом
    // Поэтому создаем новый объект с новым массивом lifecycles для триггера обновления signal
    const updatedGroup = { ...lifecycleGroup, lifecycles: [...(lifecycleGroup.lifecycles ?? [])] };
    this.lifecycleGroup = updatedGroup;
    this._lifecycleGroupSignal.set(updatedGroup);
    
    // Для BUREAU_ASSESSOR собираем протоколы заседаний секций из lifecycle'ов
    if (this.role == Role.BUREAU_ASSESSOR && !this.agenda) {
      this.sectionReports = (lifecycleGroup.lifecycles ?? [])
        .flatMap(lifecycle => lifecycle.meetingProtocol ?? [])
        .filter(protocol => protocol != null);
      this.cdr?.markForCheck?.();
    }
  }

  private updateLifecycleSignal(lifecycle: any) {
    // Объект приходит из API или дочерних компонентов, уже новый - копирование не требуется
    this.lifecycle = lifecycle;
    this._lifecycleSignal.set(lifecycle);
  }

  private updateLifecycleGroupsSignal(groups: any[]) {
    // ВАЖНО: lifecycle-group-list.component может мутировать массив перед эмитом
    // Поэтому создаем новый массив для триггера обновления signal
    const updatedGroups = [...(groups ?? [])];
    this.lifecycleGroups = updatedGroups;
    this._lifecycleGroupsSignal.set(updatedGroups);
  }

  private updateExpertReviewSignal(review: ExpertReviewDto) {
    // Объект приходит из API или дочерних компонентов, уже новый - копирование не требуется
    this.expertReview = review;
    this._expertReviewSignal.set(review);
  }

  showProjectDocuments() {
    // Члены секции и бюро (assessors) видят документы сразу после отправки объекта на заседание
    if (this.role == Role.SECTION_ASSESSOR || this.role == Role.BUREAU_ASSESSOR) {
      this.visibleDocsForExpert = true;
    } else if ((this.role == Role.EXPERT && this.expertReview == null) || this.role == Role.EXPERT && (this.expertReview.state == ExpertReviewState.ON_EXPERT_CONFIRMATION ||
      this.expertReview.state == ExpertReviewState.REJECTED)) {
      this.visibleDocsForExpert = false;
    } else {
      this.visibleDocsForExpert = true;
    }
    this.cdr?.markForCheck?.();
  }


  finishChoosingExperts() {
    this._dialogService.showConfirmDialog(
      'Утверждение экспертных заключений',
      `Утвердить текущий список экспертных заключений для объекта "${this.project.title}" и перейти к рассмотрению в секции?`
    ).subscribe(() => {
      this._lifecycleService.finishExpertExamination(this.lifecycle).subscribe({
        next: (res) => {
          this.updateLifecycleSignal(res);
          this.loadProject(new IdDto(this.project.id), null);
          this._toasty.success("Эксперты утверждены.");
          this.cdr?.markForCheck?.();
        },
        error: () => {
          // Ошибка уже обработана в HttpClientSecure.handleError, который показывает toast
          this.cdr?.markForCheck?.();
        }
      });
    });
  }

  returnFromSectionToCouncil() {
    this._dialogService.showConfirmDialog(
        'Возврат в бюро ГЭС',
        `Вернуть обьект в бюро ГЭС?`,
        'Это действие будет необратимо')
      .subscribe(() => {
        let reason = "";
        this._lifecycleService.returnFromSectionToCouncil(this.lifecycle, reason)
          .subscribe((res) => {
            this._toasty.success("Вы вернули объект экспертизы.");
            this.updateLifecycleSignal(res);
            // this.loadProject(this.project, null);
            this.cdr?.markForCheck?.();
            this.router.navigateByUrl('/projects');
          });
      });
  }

  returnFromSectionToCouncilWithoutExamination() {
    this._dialogService.showConfirmDialog(
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${this.project.title}" в бюро ГЭС?`)
      .subscribe(() => {
        this._lifecycleService.returnFromSectionToCouncilWithoutExamination(this.lifecycle).subscribe((res) => {
          this._toasty.success('Вы вернули объект экспертизы');
          this.updateLifecycleSignal(res);
          this.loadProject(new IdDto(this.project.id), null);
          this.cdr?.markForCheck?.();
        })
      })
  }

  returnFromBureauToGKNTWithoutExamination() {
    this._dialogService.showConfirmDialog(
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${this.project.title}" в ГКНТ ?`)
      .subscribe(() => {
        this._groupService.returnFromBureauToGKNTlWithoutExamination(this.lifecycleGroup).subscribe((res) => {
          this._toasty.success('Вы вернули объект экспертизы');
          this.updateLifecycleGroupSignal(res);
          this.loadProject(new IdDto(this.project.id), null);
          this.cdr?.markForCheck?.();
        })
      })
  }

  sendBySections() {
    this._dialogService.showConfirmDialog('Утверждение секций',
      `Утвердить текущий список секций для объекта экспертизы "${this.project.title}"?`).subscribe(() => {
      this._groupService.sendBySections(this.lifecycleGroup).subscribe(res => {
        this.updateLifecycleGroupSignal(res);
        this._toasty.success('Отправлен в секции.');
      });
    });
  }

  acceptProject() {
    this._dialogService.showMethRecPDF(
      'Принятие объекта экспертизы',
      `Вы согласны провести экспертизу объекта "${this.project.title}"?`,
      'Вы соглашаетесь с методическими рекомендациями и будете обязаны завершить экспертизу в течение установленного нормативными актами срока.'
    ).subscribe(() => {
      this._reviewService.acceptProject(this.expertReview).subscribe(res => {
        this.updateExpertReviewSignal(res);
        this._toasty.success("Вы приняли объект на экспертизу.");
        this.showProjectDocuments();
      });
    });
  }

  rejectProject(reason: string) {
    this._reviewService.rejectProject(this.expertReview, reason).subscribe(res => {
      this.updateExpertReviewSignal(res);
      this._toasty.success("Вы отклонили экспертизу объекта.");
      this.router.navigateByUrl('projects');
    });
  }

  finishExpertExamination() {
    this._dialogService.showConfirmDialog(
      'Завершение экспертизы',
      `Завершить экспертизу объекта "${this.project.title}"?`
    ).subscribe(() => {
      this._reviewService.finishReview(this.expertReview).subscribe(res => {
        this.updateExpertReviewSignal(res);
        this._toasty.success("Вы завершили экспертизу объекта.");
      })
    });
  }

  sendOnExamination() {
    this._dialogService.showConfirmDialog(
      null,
      `Отправить на экспертизу объект "${this.project.title}"?`,
      'После выполнения операции редактировать данные станет невозможно.'
    ).subscribe(() => {
      this._projectService.sendOnExaminationToGknt(this.project).subscribe((res) => {
        this.updateProjectSignal(res);
        this._toasty.success("Отправлен на экспертизу.");
      });
    });
  }

  sendToSubCustomer() {
    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('reason', 'Причина возврата')],
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${this.project.title}" инциатору экспертизы?`)
      .subscribe((dlgResult: DialogResult<any>) => {
        let reason = "";
        if (dlgResult != null && dlgResult.value != null) {
          reason = dlgResult.value.reason;
        }
        this._projectService.returnToSubCustomer(this.project, reason)
          .subscribe(() => {
            this._toasty.success("Вы вернули объект экспертизы.");
            this.router.navigateByUrl('/projects');
          });
      });
  }

  sendToHeadOrg() {
    this._dialogService.showConfirmDialog(null,
      `Отправить на утверждение объект "${this.project.title}"?`,
      'После выполнения операции редактировать данные станет невозможно.'
    ).subscribe(() => {
      this._projectService.sendForApproval(this.project).subscribe((res) => {
        this.updateProjectSignal(res);
        this._toasty.success("Отправлен на утверждение.");
      })
    })
  }

  sendOnDepartmentSigning() {
    if (this.project.decisionDocument && this.getActiveGroups().length > 0) {
      throw 'Пожалуйста, приведите документы и данные о ГЭСах в соответствие с принятым решением по объекту экспертизы.';
    }
    this._dialogService.showConfirmDialog(
      null,
      `Отправить документы по объекту экспертизы "${this.project.title}" на подпись начальнику подразделения?`,
      ''
    ).subscribe(() => {
      this._projectService.sendOnDepartmentSigning(this.project).subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Вы отправили документы начальнику подраделения.");
      });
    });
  }

  returnOnChecking() {
    this._dialogService.showConfirmDialog(
      null,
      `Вернуть объект экспертизы "${this.project.title}" назначенному ответственному сотруднику подразделения 
      ГКНТ для дополнительного рассмотрения?`,
      ''
    ).subscribe(() => {
      this._projectService.returnOnChecking(this.project).subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Объект экспертизы возвращён на доработку.");
      });
    });
  }

  returnOnDepartmentSigning() {
    this.returnOnDepartmentSigningConfirmDialog().subscribe(() => {
      this._projectService.returnOnDepartmentSigning(this.project).subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Объект экспертизы возвращён на доработку.");
      });
    });
  }

  returnOnDepartmentFinalSigning() {
    this.returnOnDepartmentSigningConfirmDialog().subscribe(() => {
      this._projectService.returnOnDepartmentFinalSigning(this.project).subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Объект экспертизы возвращён на доработку.");
      });
    });
  }

  private returnOnDepartmentSigningConfirmDialog() {
    return this._dialogService.showConfirmDialog(
      null,
      `Вернуть объект экспертизы "${this.project.title}" в подразделение ГКНТ для дополнительного рассмотрения?`,
      ''
    )
  }

  private finishProject() {
    this._projectService.finishProject(this.project).subscribe(res => {
      this.updateProjectSignal(res);
      this._toasty.success("Вы завершили экспертизу объекта.");
    });
  }

  private finishProjectConfirmDialog() {
    return this._dialogService.showConfirmDialog('Завершение экспертизы объекта',
      `Утвердить документы (письмо или письма заказчику) и завершить экспертизу объекта "${this.project.title}"?`);
  }

  finishProjectWithoutSign() {
    this.finishProjectConfirmDialog().subscribe(() => this.finishProject());
  }

  finishProjectWithSign() {
    this.finishProjectConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signLifecycleGroupDecisions(this.project).subscribe(res => {
        console.log('complete sign decision');
        if (res) {
          this.finishProject();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private returnProject() {
    this._projectService.returnProject(this.project).subscribe(res => {
      this.updateProjectSignal(res);
      this._toasty.success("Вы вернули объект экспертизы заказчику без дальнейшего рассмотрения.");
    });
  }

  private returnProjectConfirmDialog() {
    return this._dialogService.showConfirmDialog('Возврат объекта экспертизы',
      `Утвердить письмо заказчику и вернуть объект экспертизы "${this.project.title}" без дальнейшего рассмотрения?`);
  }

  returnProjectWithoutSign() {
    this.returnProjectConfirmDialog().subscribe(() => this.returnProject());
  }

  returnProjectWithSign() {
    this.returnProjectConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signDoc(this.project.decisionDocument).subscribe(res => {
        console.log('complete sign decision');
        if (res) {
          this.returnProject();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private sendOnSigning() {
    this._projectService.sendOnSigning(this.project).subscribe(res => {
      this.updateProjectSignal(res);
      this._toasty.success("Вы отправили документы зам. Председателя ГКНТ.");
    });
  }

  private sendOnSigningConfirmDialog() {
    if (this.project.decisionDocument && this.getActiveGroups().length > 0) {
      throw 'Пожалуйста, приведите документы и данные о ГЭСах в соответствие с принятым решением по объекту экспертизы.';
    }
    return this._dialogService.showConfirmDialog(
      null,
      `Отправить документы по объекту экспертизы "${this.project.title}" на подпись зам. Председателя ГКНТ?`,
      '');
  }

  sendOnSigningWithoutSign() {
    this.sendOnSigningConfirmDialog().subscribe(() => this.sendOnSigning());
  }

  sendOnSigningWithSignDecision() {
    this.sendOnSigningConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signDoc(this.project.decisionDocument).subscribe(res => {
        console.log('complete sign decision');
        if (res) {
          this.sendOnSigning();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  sendOnSigningWithSignReferrals() {
    this.sendOnSigningConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signReferrals(this.project).subscribe(res => {
        console.log('get sign result');
        if (res) {
          this.sendOnSigning();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private sendOnFinalSigning() {
    this._projectService.sendOnFinalSigning(this.project).subscribe((dto) => {
      this.updateProjectSignal(dto);
      this._toasty.success("Вы отправили документы зам. Председателя ГКНТ.");
    });
  }

  sendOnFinalSigningWithoutSign() {
    this.sendOnSigningConfirmDialog().subscribe(() => this.sendOnFinalSigning());
  }

  sendOnFinalSigningWithSign() {
    this.sendOnSigningConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signLifecycleGroupDecisions(this.project).subscribe(res => {
        console.log('get sign result');
        if (res) {
          this.sendOnFinalSigning();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  private sendOnExaminationToCouncils() {
    this._projectService.sendOnExaminationToCouncils(this.project).subscribe((res) => {
      this.updateProjectSignal(res);
      this.loadLifecycleGroups();
      this._toasty.success("Отправлен на экспертизу в ГЭС.");
    })
  }

  private sendOnExaminationToCouncilsConfirmDialog() {
    return this._dialogService.showConfirmDialog('Утверждение документов',
      `Утвердить направления и отправить на экспертизу в ГЭС объект "${this.project.title}"?`);
  }

  sendOnExaminationToCouncilsWithoutSign() {
    this.sendOnExaminationToCouncilsConfirmDialog().subscribe(() => this.sendOnExaminationToCouncils());
  }

  sendOnExaminationToCouncilsWithSign() {
    this.sendOnExaminationToCouncilsConfirmDialog().subscribe(() => {
      this._progress.show();
      this._cryptoService.signReferrals(this.project).subscribe(res => {
        console.log('get sign result');
        if (res) {
          this.sendOnExaminationToCouncils();
        } else {
          this._toasty.error('Ошибка подписи.');
        }
        this._progress.hide();
      }, () => this._progress.hide());
    });
  }

  onGwSelected(person) {
    this.searchGkntWorkerComponent.hide();
    this._dialogService.showConfirmDialog(
      'Назначение сотрудника на объект экспертизы',
      `Назначить сотрудника "${this._personPipe.transform(person)}" на объект экспертизы "${this.project.title}"?`
    ).subscribe(() => {
      this._projectService.attachWorker(this.project, person.id).subscribe((res) => {
        this.updateProjectSignal(res);
        this._toasty.success(`На этот объект экспертизы назначен ${this._personPipe.transform(person)}.`);
      });
    });
  }

  copyProject() {
    this.editedProject = _.cloneDeep(this.project);
    this.copyProjectModal.show();
  }

  findTheSameProjects(title: string) {
    if (this.sameProjectsLoading()) {
      return;
    }
    this.sameProjectsLoading.set(true);
    this.sameProjectList.titleValue = title;
    this._projectService.getTheSameProjectsByTitle(title)
      .pipe(finalize(() => this.sameProjectsLoading.set(false)))
      .subscribe({
        next: (value) => {
          this.listSameProjects = value;
          this.listProjects.show();
          this.cdr?.markForCheck?.();
        },
        error: () => {
          this.cdr?.markForCheck?.();
        }
      });
  }


  deleteProject() {
    this._dialogService.showConfirmDialog('Удаление объекта экспертизы')
      .subscribe(() => {
        this._projectService.deleteProject(this.project)
          .subscribe(() => {
            this._toasty.success("Объект экспертизы удален");
            this.router.navigateByUrl('/projects');
          });
      })
  }

  editProject() {
    this.editedProject = _.cloneDeep(this.project);
    this.editProjectModal.show();
  }


  finishLifecycleGroup() {
    this._dialogService.showConfirmDialog(
      'Утверждение заключения ГЭС',
      `Утвердить заключение ГЭС и завершить экспертизу объекта "${this.project.title}"?`
    ).subscribe(() => {
      this._groupService.finishLifecycleGroup(this.lifecycleGroup).subscribe(res => {
        this.updateLifecycleGroupSignal(res);
        this.loadProject(this.project, null);
        this._toasty.success("Вы завершили экспертизу объекта.");
      });
    });
  }

  showReturnFromCouncilModal() {
    this.returnFromCouncilWithoutExpertiseModal.show();
  }

  returnFromCouncil(formContent: ReturnFromCouncilWithoutExpertiseFormContent) {
      this._groupService.returnToGknt(this.lifecycleGroup, formContent)
        .subscribe(res => {
          this.updateLifecycleGroupSignal(res);
          this.returnFromCouncilWithoutExpertiseModal.hide();
          this.loadProject(new IdDto(this.project.id), null);
          this._toasty.success("Вы отклонили экспертизу объекта.");
        });
  }

  onUpdate(project) {
    this._projectService.updateProject(this.project, project)
      .subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Сохранено.");
        this.editProjectModal.hide();
      });
  }

  onCopy(project) {
    this.editedProject = project;
    this.editedProject.id = this.project.id;
    this.copiedProject = new ProjectCopyDto();
    this.copiedProject.title = this.editedProject.title;
    // Преобразуем DocumentDto[] в number[] (ID документов) для ProjectCopyDto
    this.copiedProject.documents = (this.editedProject.documents || []).map(doc => doc.id).filter(id => id != null);
    this.copiedProject.id = this.editedProject.id;
    // 1) Создаём копию (контракт ProjectCopyDto определяет, что можно редактировать при копировании)
    // 2) Сразу "докидываем" остальные поля из project-form через update/{newId}
    // Это позволяет копировать ВСЕ поля без изменений бэкенда.
    this._projectService.saveCopyProject(this.copiedProject)
      .subscribe(res => {
        const newId = res?.id;
        if (!newId) {
          this.copyProjectModal.hide();
          this.router.navigate(['/projects', res?.id]);
          return;
        }

        // Берём полную модель из формы (editedProject — это cloneDeep исходного проекта),
        // но фиксируем id нового проекта и оставляем title/documents как выбраны в модалке.
        const fullProjectToSave: any = _.cloneDeep(this.editedProject);
        fullProjectToSave.id = newId;
        fullProjectToSave.title = this.editedProject.title;
        fullProjectToSave.documents = this.editedProject.documents;
        // Используем финансирование из созданной копии, чтобы оно не потерялось при обновлении
        // Финансирование уже скопировано на бэкенде в saveCopyProject, поэтому используем его из результата
        if (res?.financing) {
          fullProjectToSave.financing = res.financing;
        }

        this._projectService.updateProject({ id: newId } as any, fullProjectToSave)
          .subscribe({
            next: (updated) => {
              this.copyProjectModal.hide();
              this.router.navigate(['/projects', updated?.id || newId]);
            },
            error: () => {
              // Если update по какой-то причине не прошёл (валидации/права/состояние),
              // всё равно оставляем созданную копию, чтобы операция была обратимой.
              this.copyProjectModal.hide();
              this._toasty?.warn?.("Копия создана, но часть полей не удалось перенести автоматически. Проверьте данные в созданном объекте.");
              this.router.navigate(['/projects', newId]);
            }
          });
      });
  }

  getAllReferrals() {
    return this.lifecycleGroups.map(group => group.referral).filter(doc => doc);
  }

  private hasReferralsForAllActiveGroups(groups?: any[]): boolean {
    const activeGroups = this.getActiveGroups(groups);
    return activeGroups.length > 0 && activeGroups.every(g => !!g.referral);
  }

  hasAllLifecycleGroupDecisions(groups?: any[]) {
    if (this.project.isSectionRemarksExpired || this.project.isBureauRemarksExpired) {
      return this.project.decisionDocument != null;
    } else
      return !this.getActiveGroups(groups).find(group => !group.decisionDocument);
  }

  getActiveGroups(groups?: any[]) {
    const source = groups ?? this.lifecycleGroups;
    return source.filter(group => group.state != LifecycleGroupState.RETURNED_WITHOUT_EXPERTISE);
  }

  onLifecycleGroupsChanged(groups: any) {
    // LifecycleGroupListComponent эмитит свой внутренний массив (groupsState).
    // Обновляем signal — computed buttons пересчитается автоматически.
    this.updateLifecycleGroupsSignal((groups ?? []) as any);
  }

  onExpertReviewsChanged(reviews: ExpertReviewDto[]) {
    if (!this.project) {
      return;
    }
    // Создаем новый объект проекта с новым массивом expertReviews для триггера обновления computed signal
    // (signals отслеживают изменения по ссылкам, поэтому мутации объекта не видны)
    const updatedProject = { ...this.project, expertReviews: [...reviews] };
    this.project = updatedProject;
    this._projectSignal.set(updatedProject);
  }

  // Обработчики событий от дочерних компонентов для обновления signals
  onProjectChanged(project: ProjectDto) {
    this.updateProjectSignal(project);
  }

  onLifecycleGroupChanged(group: LifecycleGroupDto) {
    this.updateLifecycleGroupSignal(group);
  }

  onLifecycleChanged(lifecycle: any) {
    this.updateLifecycleSignal(lifecycle);
  }

  onExpertReviewChanged(review: ExpertReviewDto) {
    this.updateExpertReviewSignal(review);
  }


  reloadProject(project: ProjectDto) {
    this._projectService.getProject(project).subscribe(value => {
      this.updateProjectSignal(value);
      // Перезагружаем lifecycleGroups для CUSTOMER, чтобы обновить состояние lifecycle'ов после ответа на замечания
      if (this.role == Role.CUSTOMER) {
        this.loadLifecycleGroups();
      }
      this.cdr?.markForCheck?.();
    });
  }

  checkPossibleToReturnToGKNT(lifecycleGroup?: LifecycleGroupDto, project?: ProjectDto, role?: string): boolean {
    if (!lifecycleGroup || !project || !role) {
      return false;
    }
    let returnFromSection: boolean = false;
    for (const lc of lifecycleGroup.lifecycles) {
      if (lc.state == ProjectLifecycleState.RETURNED_WITHOUT_EXPERTISE) {
        returnFromSection = true;
      }
    }
    return (role == Role.BUREAU_CHAIRMAN && lifecycleGroup
      && lifecycleGroup.state == LifecycleGroupState.ON_WAITING_RESPONSE
      && !lifecycleGroup.isAnswerReceived && project.isRescheduleBureau
      && project.isBureauRemarksExpired)
      || (role == Role.BUREAU_CHAIRMAN && returnFromSection
        && lifecycleGroup.state != LifecycleGroupState.RETURNED_WITHOUT_EXPERTISE
        && lifecycleGroup.state != LifecycleGroupState.ACCEPTED);
  }

  viewDocument(doc: DocumentDto) {
    this._documentService.checkPdfView(doc).subscribe(res => {
      if (!res) {
        this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
            "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
      } else {
        this._dialogService.showPDFViewer("document", doc).subscribe();
        // this.selectedDocument = doc;
        // this.fileViewerModal.show();
      }
    });
  }

  private geAcquainted() {
    this.agreement = true;
  }
}

// Re-export for backward compatibility
export {ActionButtonMetadata} from './action-button-metadata';
