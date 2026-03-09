import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, viewChild, signal, computed} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
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
export class ProjectInfoComponent implements OnInit {

  Role = Role; // enum for template

  // Signals для всех свойств
  private readonly _roleSignal = signal<string | undefined>(undefined);
  private readonly _projectSignal = signal<ProjectDto | undefined>(undefined);
  private readonly _lifecycleGroupSignal = signal<LifecycleGroupDto | undefined>(undefined);
  private readonly _lifecycleSignal = signal<any | undefined>(undefined);
  private readonly _lifecycleGroupsSignal = signal<any[]>([]);
  private readonly _expertReviewSignal = signal<ExpertReviewDto | undefined>(undefined);
  private readonly _currentUserSignal = signal<any | undefined>(undefined);
  private readonly _agreementSignal = signal<boolean>(false);
  private readonly _editedProjectSignal = signal<ProjectDto | undefined>(undefined);
  private readonly _copiedProjectSignal = signal<ProjectCopyDto | undefined>(undefined);
  private readonly _listSameProjectsSignal = signal<ProjectDto[]>([]);
  private readonly _lifecycleRemarkSignal = signal<ProjectLifecycleDto>(new ProjectLifecycleDto());
  private readonly _agendaSignal = signal<IdDto | undefined>(undefined);
  private readonly _sectionReportsSignal = signal<any[]>([]);
  private readonly _reviewsSignal = signal<any[]>([]);
  private readonly _visibleDocsForExpertSignal = signal<boolean>(false);

  readonly sameProjectsLoading = signal<boolean>(false);
  readonly acceptProjectLoading = signal<boolean>(false);
  readonly returnLoading = signal<boolean>(false);

  // Геттеры для обратной совместимости (используются в шаблоне и методах)
  get role(): string | undefined {
    return this._roleSignal();
  }
  set role(value: string | undefined) {
    this._roleSignal.set(value);
  }

  get project(): ProjectDto | undefined {
    return this._projectSignal();
  }
  set project(value: ProjectDto | undefined) {
    this._projectSignal.set(value);
  }

  get lifecycleGroup(): LifecycleGroupDto | undefined {
    return this._lifecycleGroupSignal();
  }
  set lifecycleGroup(value: LifecycleGroupDto | undefined) {
    this._lifecycleGroupSignal.set(value);
  }

  get lifecycle(): any | undefined {
    return this._lifecycleSignal();
  }
  set lifecycle(value: any | undefined) {
    this._lifecycleSignal.set(value);
  }

  get lifecycleGroups(): any[] {
    return this._lifecycleGroupsSignal();
  }
  set lifecycleGroups(value: any[]) {
    this._lifecycleGroupsSignal.set(value ?? []);
  }

  get expertReview(): ExpertReviewDto | undefined {
    return this._expertReviewSignal();
  }
  set expertReview(value: ExpertReviewDto | undefined) {
    this._expertReviewSignal.set(value);
  }

  get currentUser(): any | undefined {
    return this._currentUserSignal();
  }
  set currentUser(value: any | undefined) {
    this._currentUserSignal.set(value);
  }

  get agreement(): boolean {
    return this._agreementSignal();
  }
  set agreement(value: boolean) {
    this._agreementSignal.set(value);
  }

  get editedProject(): ProjectDto | undefined {
    return this._editedProjectSignal();
  }
  set editedProject(value: ProjectDto | undefined) {
    this._editedProjectSignal.set(value);
  }

  get copiedProject(): ProjectCopyDto | undefined {
    return this._copiedProjectSignal();
  }
  set copiedProject(value: ProjectCopyDto | undefined) {
    this._copiedProjectSignal.set(value);
  }

  get listSameProjects(): ProjectDto[] {
    return this._listSameProjectsSignal();
  }
  set listSameProjects(value: ProjectDto[]) {
    this._listSameProjectsSignal.set(value ?? []);
  }

  get lifecycleRemark(): ProjectLifecycleDto {
    return this._lifecycleRemarkSignal();
  }
  set lifecycleRemark(value: ProjectLifecycleDto) {
    this._lifecycleRemarkSignal.set(value ?? new ProjectLifecycleDto());
  }

  get agenda(): IdDto | undefined {
    return this._agendaSignal();
  }
  set agenda(value: IdDto | undefined) {
    this._agendaSignal.set(value);
  }

  get sectionReports(): any[] {
    return this._sectionReportsSignal();
  }
  set sectionReports(value: any[]) {
    this._sectionReportsSignal.set(value ?? []);
  }

  get reviews(): any[] {
    return this._reviewsSignal();
  }
  set reviews(value: any[]) {
    this._reviewsSignal.set(value ?? []);
  }

  get visibleDocsForExpert(): boolean {
    return this._visibleDocsForExpertSignal();
  }
  set visibleDocsForExpert(value: boolean) {
    this._visibleDocsForExpertSignal.set(value);
  }

  // ViewChild переведены на viewChild (сигналы)
  private readonly _searchExpertComponentSignal = viewChild<SearchExpertComponent>(SearchExpertComponent);
  private readonly _searchGkntWorkerComponentSignal = viewChild<SearchGkntWorkerComponent>(SearchGkntWorkerComponent);
  private readonly _editProjectModalSignal = viewChild<ModalComponent>('editProjectModal');
  private readonly _returnFromCouncilWithoutExpertiseModalSignal = viewChild<ModalComponent>('returnFromCouncilWithoutExpertiseModal');
  private readonly _copyProjectModalSignal = viewChild<ModalComponent>('copyProjectModal');
  private readonly _expertRejectProjectSignal = viewChild<ModalComponent>('expertRejectProject');
  private readonly _expertAgreementSignal = viewChild<ModalComponent>('expertAgreement');
  private readonly _listProjectsSignal = viewChild<ModalComponent>('listProjects');
  private readonly _sameProjectListSignal = viewChild<SameProjectListComponent>(SameProjectListComponent);

  // Геттеры для обратной совместимости с шаблоном (template reference variables)
  get searchExpertComponent(): SearchExpertComponent | undefined {
    return this._searchExpertComponentSignal();
  }
  get searchGkntWorkerComponent(): SearchGkntWorkerComponent | undefined {
    return this._searchGkntWorkerComponentSignal();
  }
  get editProjectModal(): ModalComponent | undefined {
    return this._editProjectModalSignal();
  }
  get returnFromCouncilWithoutExpertiseModal(): ModalComponent | undefined {
    return this._returnFromCouncilWithoutExpertiseModalSignal();
  }
  get copyProjectModal(): ModalComponent | undefined {
    return this._copyProjectModalSignal();
  }
  get expertRejectProject(): ModalComponent | undefined {
    return this._expertRejectProjectSignal();
  }
  get expertAgreement(): ModalComponent | undefined {
    return this._expertAgreementSignal();
  }
  get listProjects(): ModalComponent | undefined {
    return this._listProjectsSignal();
  }
  get sameProjectList(): SameProjectListComponent | undefined {
    return this._sameProjectListSignal();
  }

  private readonly destroyRef = inject(DestroyRef);
  private _lastLoadedProjectId: number | undefined;

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
              private _documentService: DocumentService) {
  }

  /**
   * Zoneless/Signals: защитные геттеры для runtime-устойчивости.
   * Не меняют поведение при корректном UI-потоке (когда проект уже загружен),
   * но предотвращают падения, если метод вызван до загрузки данных.
   */
  private requireProject(): ProjectDto | undefined {
    const project = this.project;
    if (!project) {
      this._toasty?.error?.('Проект не загружен. Повторите попытку.');
      return undefined;
    }
    return project;
  }

  private requireLifecycle(): any | undefined {
    const lifecycle = this.lifecycle;
    if (!lifecycle) {
      this._toasty?.error?.('Данные жизненного цикла не загружены. Повторите попытку.');
      return undefined;
    }
    return lifecycle;
  }

  private requireLifecycleGroup(): LifecycleGroupDto | undefined {
    const group = this.lifecycleGroup;
    if (!group) {
      this._toasty?.error?.('Данные группы не загружены. Повторите попытку.');
      return undefined;
    }
    return group;
  }

  private requireExpertReview(): ExpertReviewDto | undefined {
    const review = this.expertReview;
    if (!review) {
      this._toasty?.error?.('Экспертная оценка не загружена. Повторите попытку.');
      return undefined;
    }
    return review;
  }

  ngOnInit() {
    this.role = this._authService.getCurrRole();
    this._personService.getCurrentPerson()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.currentUser = res;
      });
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
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

  loadLifecycle() {
    const project = this.requireProject();
    if (!project) return;

    this._projectService.getLifecycle(project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateLifecycleSignal(res);
      });
  }

  loadLifecycleGroups() {
    const project = this.requireProject();
    if (!project) return;

    this._projectService.getLifecycleGroups(project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateLifecycleGroupsSignal(res);
      });
  }

  loadLifecycleGroup() {
    const project = this.requireProject();
    if (!project) return;

    this._projectService.getLifecycleGroup(project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateLifecycleGroupSignal(res);
      });
  }

  loadProject(idDto: IdDto, group: string) {
    this._projectService.getProject(idDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          // Проверяем, действительно ли объект изменился, чтобы избежать ненужных обновлений
          if (this.project && this.project.id === res.id && this.project === res) {
            return;
          }
          this.updateProjectSignal(res);
          if (group != null && group != 'null' && typeof group === 'string' && !group.includes('=>')) {
            this._projectService.markViewed(this.project, group)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe();
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
        },
        error: (err) => {
          // Error is already handled by HttpClientSecure.handleError which shows toast
          // Just prevent it from propagating to global error handler
          console.error('Error loading project:', err);
        }
      })
  }

  loadExpertReview() {
    const project = this.requireProject();
    if (!project) return;

    this._projectService.getReview(project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateExpertReviewSignal(res);
        this.showProjectDocuments();
      });
  }

  loadSectionReports() {
    const agenda = this.agenda;
    if (!agenda) return;

    this._agendaService.getSectionReportsByBureauAssessor(agenda)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.sectionReports = res;
      });
  }

  loadAnonymousExpertReviews() {
    const project = this.requireProject();
    if (!project) return;

    this._projectService.getAnonymousReviews(project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.reviews = res;
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
    const lifecycleGroup = this._lifecycleGroupSignal();
    return project != null && (
      (project.state == ProjectState.ON_EXPERT_EXAMINATION &&
        role == Role.GKNT_DEPARTMENT_CHAIRMAN) ||
      (project.state == ProjectState.ON_EXPERT_EXAMINATION &&
        role == Role.BUREAU_CHAIRMAN &&
        lifecycleGroup != null && lifecycleGroup.state == LifecycleGroupState.ON_CHECKING) ||
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
        buttons.push(new ActionButtonMetadata('Вернуть в ГКНТ', () => this.showReturnFromCouncilModal(), 'btn-secondary', {
          isDisabled: () => this.returnLoading()
        }));
      }
      if (this.checkPossibleToReturnToGKNT(lifecycleGroup, project, role)) {
        buttons.push(new ActionButtonMetadata('Вернуть в ГКНТ без рассмотрения', () => this.returnFromBureauToGKNTWithoutExamination(), 'btn-secondary', {
          isLoading: () => this.returnLoading(),
          isDisabled: () => this.returnLoading()
        }));
      }
    }

    // SECTION_CHAIRMAN
    if (role == Role.SECTION_CHAIRMAN && lifecycle && lifecycle.state == ProjectLifecycleState.ON_EXPERT_EXAMINATION) {
      buttons.push(new ActionButtonMetadata('Перейти к рассмотрению в секции', () => this.finishChoosingExperts(), 'btn-primary'));
      buttons.push(new ActionButtonMetadata('Вернуть в бюро ГЭС', () => this.returnFromSectionToCouncil(), 'btn-secondary', {
        isLoading: () => this.returnLoading(),
        isDisabled: () => this.returnLoading()
      }));
    }

    if (role == Role.SECTION_CHAIRMAN && lifecycle
      && lifecycle.state == ProjectLifecycleState.ON_WAITING_RESPONSE
      && !lifecycle.isAnswerReceived && project.isRescheduleSection
      && project.isSectionRemarksExpired) {
      buttons.push(new ActionButtonMetadata('Вернуть в бюро ГЭС без рассмотрения', () => this.returnFromSectionToCouncilWithoutExamination(), 'btn-secondary', {
        isLoading: () => this.returnLoading(),
        isDisabled: () => this.returnLoading()
      }));
    }

    // EXPERT
    if (expertReview && role == Role.EXPERT) {
      if (expertReview.state == 'ON_EXPERT_CONFIRMATION') {
        buttons.push(new ActionButtonMetadata('Принять', () => this.acceptProject(), 'btn-primary', {
          isLoading: () => this.acceptProjectLoading()
        }));
        buttons.push(new ActionButtonMetadata('Отклонить', () => this.expertRejectProject?.show(), 'btn-secondary'));
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
        buttons.push(new ActionButtonMetadata('Назначить сотрудника', () => this.searchGkntWorkerComponent?.show(), 'btn-primary'));
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
  }

  private updateLifecycleGroupSignal(lifecycleGroup: LifecycleGroupDto) {
    // ВАЖНО: lifecycle-group.component мутирует _group.lifecycles.push(res) перед эмитом
    // Поэтому создаем новый объект с новым массивом lifecycles для триггера обновления signal
    const updatedGroup = { ...lifecycleGroup, lifecycles: [...(lifecycleGroup.lifecycles ?? [])] };
    this.lifecycleGroup = updatedGroup;
    
    // Для BUREAU_ASSESSOR собираем протоколы заседаний секций из lifecycle'ов
    if (this.role == Role.BUREAU_ASSESSOR && !this.agenda) {
      this.sectionReports = (lifecycleGroup.lifecycles ?? [])
        .flatMap(lifecycle => lifecycle.meetingProtocol ?? [])
        .filter(protocol => protocol != null);
    }
  }

  private updateLifecycleSignal(lifecycle: any) {
    // Объект приходит из API или дочерних компонентов, уже новый - копирование не требуется
    this.lifecycle = lifecycle;
  }

  private updateLifecycleGroupsSignal(groups: any[]) {
    // ВАЖНО: lifecycle-group-list.component может мутировать массив перед эмитом
    // Поэтому создаем новый массив для триггера обновления signal
    const updatedGroups = [...(groups ?? [])];
    this.lifecycleGroups = updatedGroups;
  }

  private updateExpertReviewSignal(review: ExpertReviewDto) {
    // Объект приходит из API или дочерних компонентов, уже новый - копирование не требуется
    this.expertReview = review;
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
  }


  finishChoosingExperts() {
    const project = this.requireProject();
    const lifecycle = this.requireLifecycle();
    if (!project || !lifecycle) return;
    const projectId = project.id;

    this._dialogService.showConfirmDialog(
      'Утверждение экспертных заключений',
      `Утвердить текущий список экспертных заключений для объекта "${project.title}" и перейти к рассмотрению в секции?`
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._lifecycleService.finishExpertExamination(lifecycle)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.updateLifecycleSignal(res);
              this.loadProject(new IdDto(projectId), null);
              this._toasty.success("Эксперты утверждены.");
            },
            error: () => {
              // Ошибка уже обработана в HttpClientSecure.handleError, который показывает toast
            }
          });
      });
  }

  returnFromSectionToCouncil() {
    const lifecycle = this.requireLifecycle();
    if (!lifecycle) return;

    this._dialogService.showConfirmDialog(
        'Возврат в бюро ГЭС',
        `Вернуть обьект в бюро ГЭС?`,
        'Это действие будет необратимо')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.returnLoading.set(true);
        let reason = "";
        this._lifecycleService.returnFromSectionToCouncil(lifecycle, reason)
          .pipe(
            finalize(() => this.returnLoading.set(false)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((res) => {
            this._toasty.success("Вы вернули объект экспертизы.");
            this.updateLifecycleSignal(res);
            this.router.navigateByUrl('/projects');
          });
      });
  }

  returnFromSectionToCouncilWithoutExamination() {
    const project = this.requireProject();
    const lifecycle = this.requireLifecycle();
    if (!project || !lifecycle) return;
    const projectId = project.id;

    this._dialogService.showConfirmDialog(
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${project.title}" в бюро ГЭС?`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.returnLoading.set(true);
        this._lifecycleService.returnFromSectionToCouncilWithoutExamination(lifecycle)
          .pipe(
            finalize(() => this.returnLoading.set(false)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((res) => {
            this._toasty.success('Вы вернули объект экспертизы');
            this.updateLifecycleSignal(res);
            this.loadProject(new IdDto(projectId), null);
          })
      })
  }

  returnFromBureauToGKNTWithoutExamination() {
    const project = this.requireProject();
    const group = this.requireLifecycleGroup();
    if (!project || !group) return;
    const projectId = project.id;

    this._dialogService.showConfirmDialog(
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${project.title}" в ГКНТ ?`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.returnLoading.set(true);
        this._groupService.returnFromBureauToGKNTlWithoutExamination(group)
          .pipe(
            finalize(() => this.returnLoading.set(false)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe((res) => {
            this._toasty.success('Вы вернули объект экспертизы');
            this.updateLifecycleGroupSignal(res);
            this.loadProject(new IdDto(projectId), null);
          })
      })
  }

  sendBySections() {
    const project = this.requireProject();
    const group = this.requireLifecycleGroup();
    if (!project || !group) return;

    this._dialogService.showConfirmDialog('Утверждение секций',
      `Утвердить текущий список секций для объекта экспертизы "${project.title}"?`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._groupService.sendBySections(group)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
            this.updateLifecycleGroupSignal(res);
            this._toasty.success('Отправлен в секции.');
          });
      });
  }

  acceptProject() {
    const project = this.requireProject();
    const review = this.requireExpertReview();
    if (!project || !review) return;

    this._dialogService.showMethRecPDF(
      'Принятие объекта экспертизы',
      `Вы согласны провести экспертизу объекта "${project.title}"?`,
      'Вы соглашаетесь с методическими рекомендациями и будете обязаны завершить экспертизу в течение установленного нормативными актами срока.'
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.acceptProjectLoading.set(true);
        this._reviewService.acceptProject(review)
          .pipe(
            finalize(() => this.acceptProjectLoading.set(false)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe({
            next: (res) => {
              this.updateExpertReviewSignal(res);
              this._toasty.success("Вы приняли объект на экспертизу.");
              this.showProjectDocuments();
            },
            error: (error) => {
              const errorMessage = error?.error || error?.message || 'Произошла ошибка при принятии объекта';
              this._toasty.error(errorMessage);
            }
          });
      });
  }

  rejectProject(reason: string) {
    const review = this.requireExpertReview();
    if (!review) return;

    this._reviewService.rejectProject(review, reason)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateExpertReviewSignal(res);
        this._toasty.success("Вы отклонили экспертизу объекта.");
        this.router.navigateByUrl('projects');
      });
  }

  finishExpertExamination() {
    const project = this.requireProject();
    const review = this.requireExpertReview();
    if (!project || !review) return;

    this._dialogService.showConfirmDialog(
      'Завершение экспертизы',
      `Завершить экспертизу объекта "${project.title}"?`
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._reviewService.finishReview(review)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
            this.updateExpertReviewSignal(res);
            this._toasty.success("Вы завершили экспертизу объекта.");
          })
      });
  }

  sendOnExamination() {
    const project = this.requireProject();
    if (!project) return;

    this._dialogService.showConfirmDialog(
      null,
      `Отправить на экспертизу объект "${project.title}"?`,
      'После выполнения операции редактировать данные станет невозможно.'
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.sendOnExaminationToGknt(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res) => {
            this.updateProjectSignal(res);
            this._toasty.success("Отправлен на экспертизу.");
          });
      });
  }

  sendToSubCustomer() {
    const project = this.requireProject();
    if (!project) return;

    this._dialogService.showConfirmDialogWithFields(
      [new ConfirmDialogField<string>('reason', 'Причина возврата')],
      'Возврат объекта экспертизы',
      `Вернуть объект экспертизы "${project.title}" инциатору экспертизы?`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dlgResult: DialogResult<any>) => {
        let reason = "";
        if (dlgResult != null && dlgResult.value != null) {
          reason = dlgResult.value.reason;
        }
        this._projectService.returnToSubCustomer(project, reason)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this._toasty.success("Вы вернули объект экспертизы.");
            this.router.navigateByUrl('/projects');
          });
      });
  }

  sendToHeadOrg() {
    const project = this.requireProject();
    if (!project) return;

    this._dialogService.showConfirmDialog(null,
      `Отправить на утверждение объект "${project.title}"?`,
      'После выполнения операции редактировать данные станет невозможно.'
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.sendForApproval(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res) => {
            this.updateProjectSignal(res);
            this._toasty.success("Отправлен на утверждение.");
          })
      })
  }

  sendOnDepartmentSigning() {
    const project = this.requireProject();
    if (!project) return;

    if (project.decisionDocument && this.getActiveGroups().length > 0) {
      throw 'Пожалуйста, приведите документы и данные о ГЭСах в соответствие с принятым решением по объекту экспертизы.';
    }
    this._dialogService.showConfirmDialog(
      null,
      `Отправить документы по объекту экспертизы "${project.title}" на подпись начальнику подразделения?`,
      ''
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.sendOnDepartmentSigning(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
            this.updateProjectSignal(res);
            this._toasty.success("Вы отправили документы начальнику подраделения.");
          });
      });
  }

  returnOnChecking() {
    const project = this.requireProject();
    if (!project) return;

    this._dialogService.showConfirmDialog(
      null,
      `Вернуть объект экспертизы "${project.title}" назначенному ответственному сотруднику подразделения 
      ГКНТ для дополнительного рассмотрения?`,
      ''
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.returnOnChecking(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
            this.updateProjectSignal(res);
            this._toasty.success("Объект экспертизы возвращён на доработку.");
          });
      });
  }

  returnOnDepartmentSigning() {
    const project = this.requireProject();
    if (!project) return;

    this.returnOnDepartmentSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.returnOnDepartmentSigning(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
            this.updateProjectSignal(res);
            this._toasty.success("Объект экспертизы возвращён на доработку.");
          });
      });
  }

  returnOnDepartmentFinalSigning() {
    const project = this.requireProject();
    if (!project) return;

    this.returnOnDepartmentSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.returnOnDepartmentFinalSigning(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    this._projectService.finishProject(this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Вы завершили экспертизу объекта.");
      });
  }

  private finishProjectConfirmDialog() {
    return this._dialogService.showConfirmDialog('Завершение экспертизы объекта',
      `Утвердить документы (письмо или письма заказчику) и завершить экспертизу объекта "${this.project.title}"?`);
  }

  finishProjectWithoutSign() {
    this.finishProjectConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.finishProject());
  }

  finishProjectWithSign() {
    this.finishProjectConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._progress.show();
        this._cryptoService.signLifecycleGroupDecisions(this.project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    this._projectService.returnProject(this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Вы вернули объект экспертизы заказчику без дальнейшего рассмотрения.");
      });
  }

  private returnProjectConfirmDialog() {
    return this._dialogService.showConfirmDialog('Возврат объекта экспертизы',
      `Утвердить письмо заказчику и вернуть объект экспертизы "${this.project.title}" без дальнейшего рассмотрения?`);
  }

  returnProjectWithoutSign() {
    this.returnProjectConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.returnProject());
  }

  returnProjectWithSign() {
    this.returnProjectConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._progress.show();
        this._cryptoService.signDoc(this.project.decisionDocument)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    this._projectService.sendOnSigning(this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
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
    this.sendOnSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.sendOnSigning());
  }

  sendOnSigningWithSignDecision() {
    this.sendOnSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._progress.show();
        this._cryptoService.signDoc(this.project.decisionDocument)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    this.sendOnSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._progress.show();
        this._cryptoService.signReferrals(this.project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    this._projectService.sendOnFinalSigning(this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dto) => {
        this.updateProjectSignal(dto);
        this._toasty.success("Вы отправили документы зам. Председателя ГКНТ.");
      });
  }

  sendOnFinalSigningWithoutSign() {
    this.sendOnSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.sendOnFinalSigning());
  }

  sendOnFinalSigningWithSign() {
    this.sendOnSigningConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._progress.show();
        this._cryptoService.signLifecycleGroupDecisions(this.project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    this._projectService.sendOnExaminationToCouncils(this.project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
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
    this.sendOnExaminationToCouncilsConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.sendOnExaminationToCouncils());
  }

  sendOnExaminationToCouncilsWithSign() {
    this.sendOnExaminationToCouncilsConfirmDialog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._progress.show();
        this._cryptoService.signReferrals(this.project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
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
    const project = this.requireProject();
    if (!project) return;

    this.searchGkntWorkerComponent?.hide();
    this._dialogService.showConfirmDialog(
      'Назначение сотрудника на объект экспертизы',
      `Назначить сотрудника "${this._personPipe.transform(person)}" на объект экспертизы "${project.title}"?`
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.attachWorker(project, person.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((res) => {
            this.updateProjectSignal(res);
            this._toasty.success(`На этот объект экспертизы назначен ${this._personPipe.transform(person)}.`);
          });
      });
  }

  copyProject() {
    const project = this.requireProject();
    if (!project) return;

    this.editedProject = _.cloneDeep(project);
    this.copyProjectModal?.show();
  }

  findTheSameProjects(title: string) {
    if (this.sameProjectsLoading()) {
      return;
    }
    this.sameProjectsLoading.set(true);
    this.sameProjectList?.setTitle(title);
    this._projectService.getTheSameProjectsByTitle(title)
      .pipe(
        finalize(() => this.sameProjectsLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (value) => {
          this.listSameProjects = value;
          this.listProjects?.show();
        },
        error: () => {
          // Ошибка уже обработана
        }
      });
  }


  deleteProject() {
    const project = this.requireProject();
    if (!project) return;

    this._dialogService.showConfirmDialog('Удаление объекта экспертизы')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._projectService.deleteProject(project)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this._toasty.success("Объект экспертизы удален");
            this.router.navigateByUrl('/projects');
          });
      })
  }

  editProject() {
    const project = this.requireProject();
    if (!project) return;

    this.editedProject = _.cloneDeep(project);
    this.editProjectModal?.show();
  }


  finishLifecycleGroup() {
    const project = this.requireProject();
    const group = this.requireLifecycleGroup();
    if (!project || !group) return;

    this._dialogService.showConfirmDialog(
      'Утверждение заключения ГЭС',
      `Утвердить заключение ГЭС и завершить экспертизу объекта "${project.title}"?`
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this._groupService.finishLifecycleGroup(group)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(res => {
            this.updateLifecycleGroupSignal(res);
            this.loadProject(project, null);
            this._toasty.success("Вы завершили экспертизу объекта.");
          });
      });
  }

  showReturnFromCouncilModal() {
    this.returnFromCouncilWithoutExpertiseModal?.show();
  }

  returnFromCouncil(formContent: ReturnFromCouncilWithoutExpertiseFormContent) {
      const project = this.requireProject();
      const group = this.requireLifecycleGroup();
      if (!project || !group) return;

      this.returnLoading.set(true);
      this._groupService.returnToGknt(group, formContent)
        .pipe(
          finalize(() => this.returnLoading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(res => {
          this.updateLifecycleGroupSignal(res);
          this.returnFromCouncilWithoutExpertiseModal?.hide();
          this.loadProject(new IdDto(project.id), null);
          this._toasty.success("Вы отклонили экспертизу объекта.");
        });
  }

  onUpdate(project) {
    const current = this.requireProject();
    if (!current) return;

    this._projectService.updateProject(current, project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.updateProjectSignal(res);
        this._toasty.success("Сохранено.");
        this.editProjectModal?.hide();
      });
  }

  onCopy(project) {
    const current = this.requireProject();
    if (!current) return;

    this.editedProject = project;
    this.editedProject.id = current.id;
    this.copiedProject = new ProjectCopyDto();
    this.copiedProject.title = this.editedProject.title;
    // Преобразуем DocumentDto[] в number[] (ID документов) для ProjectCopyDto
    this.copiedProject.documents = (this.editedProject.documents || []).map(doc => doc.id).filter(id => id != null);
    this.copiedProject.id = this.editedProject.id;
    // 1) Создаём копию (контракт ProjectCopyDto определяет, что можно редактировать при копировании)
    // 2) Сразу "докидываем" остальные поля из project-form через update/{newId}
    // Это позволяет копировать ВСЕ поля без изменений бэкенда.
    this._projectService.saveCopyProject(this.copiedProject)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const newId = res?.id;
        if (!newId) {
          this.copyProjectModal?.hide();
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
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (updated) => {
              this.copyProjectModal?.hide();
              this.router.navigate(['/projects', updated?.id || newId]);
            },
            error: () => {
              // Если update по какой-то причине не прошёл (валидации/права/состояние),
              // всё равно оставляем созданную копию, чтобы операция была обратимой.
              this.copyProjectModal?.hide();
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
    this._projectService.getProject(project)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.updateProjectSignal(value);
        // Перезагружаем lifecycleGroups для CUSTOMER, чтобы обновить состояние lifecycle'ов после ответа на замечания
        if (this.role == Role.CUSTOMER) {
          this.loadLifecycleGroups();
        }
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
    this._documentService.checkPdfView(doc)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (!res) {
          this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
              "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
        } else {
          this._dialogService.showPDFViewer("document", doc)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
        }
      });
  }
}

// Re-export for backward compatibility
export {ActionButtonMetadata} from './action-button-metadata';
