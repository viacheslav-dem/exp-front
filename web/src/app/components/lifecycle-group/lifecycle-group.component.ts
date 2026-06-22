import {Component, OnDestroy, OnInit, signal, viewChild, ChangeDetectionStrategy, ChangeDetectorRef, effect, input, output} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {ProjectLifecycleState, ProjectLifecycleStateBadge} from "@app/pipes/lifecycle-state.pipe";
import {Router} from "@angular/router";
import {SearchSectionComponent} from "@app/components/search/search-section/search-section.component";
import {Role} from "@app/pipes/role.pipe";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {anyMatch} from "@app/support/utils";
import {LifecycleGroupService} from "@app/services/lifecycle-group.service";
import {ProjectLifecycleDto} from "@app/dto/ProjectLifecycleDto";
import {ProjectState} from "@app/pipes/project-state.pipe";
import {LifecycleGroupState, LifecycleGroupStateBadge} from "@app/pipes/lifecycle-group-state.pipe";
import {LifecycleGroupTransitionHistoryDto} from "@app/dto/LifecycleGroupTransitionHistoryDto";
import {TransitionHistoryService} from "@app/services/transition-history.service";
import {LifecycleService} from "@app/services/lifecycle.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {SectionPlainDto} from "@app/dto/SectionPlainDto";
import {ProjectLifecycleTransitionHistoryDto} from "@app/dto/ProjectLifecycleTransitionHistoryDto";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {RemarkDto} from "@app/dto/RemarkDto";
import {CouncilConclusionFormContainerComponent} from "@app/components/document-form/council-conclusion-form/council-conclusion-form-container.component";
import {ProjectDto} from "@app/dto/ProjectDto";
import {ProjectService} from "@app/services/project.service";
import {environment} from "../../../environments/environment";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-lifecycle-group',
    templateUrl: './lifecycle-group.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectDetail)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class LifecycleGroupComponent implements OnInit, OnDestroy {

  LifecycleGroupStateBadge = LifecycleGroupStateBadge;
  LifecycleGroupState = LifecycleGroupState;
  ProjectLifecycleStateBadge = ProjectLifecycleStateBadge;
  Role = Role;

  _group: LifecycleGroupDto;
  transitionHistory: LifecycleGroupTransitionHistoryDto;
  lifecycleTransitionHistory: ProjectLifecycleTransitionHistoryDto;
  _lifecycle: ProjectLifecycleDto;
  lifecycleRemark: ProjectLifecycleDto = new ProjectLifecycleDto();
  groupRemark: LifecycleGroupDto = new LifecycleGroupDto();
  private subscriptions: Subscription[] = [];
  
  isCreatingReferral = false;
  isCreatingConclusion = false;
  isCreatingDecision = false;

  readonly role = input(undefined);
  readonly project = input<ProjectDto>(new ProjectDto());
  _project: ProjectDto;

  get projectValue(): ProjectDto {
    return this._project ?? this.project();
  }

  readonly onChanged = output<any>();
  readonly onDeleted = output<any>();
  readonly onReplyChanged = output<any>();

  readonly conclusionForm = viewChild(CouncilConclusionFormContainerComponent);
  readonly searchSectionListComponent = viewChild<SearchSectionComponent>('searchSection');
  readonly changeSectionListComponent = viewChild<SearchSectionComponent>('changeSection');
  readonly referralFormModal = viewChild<ModalComponent>('referralFormModal');
  readonly councilFormModal = viewChild<ModalComponent>('councilFormModal');
  readonly groupDecisionFormModal = viewChild<ModalComponent>('groupDecisionFormModal');
  readonly transitionHistoryModal = viewChild<ModalComponent>('transitionHistoryModal');
  readonly lifecycleTransitionHistoryModal = viewChild<ModalComponent>('lifecycleTransitionHistoryModal');
  readonly remarkResponseForSection = viewChild<ModalComponent>('remarkResponseForSection');
  readonly remarkResponseForBureau = viewChild<ModalComponent>('remarkResponseForBureau');
  readonly expertRemarksModal = viewChild<ModalComponent>('expertRemarksModal');

  readonly expertRemarksList = signal<RemarkDto[]>([]);
  readonly expertRemarksLoading = signal(false);
  readonly expertRemarksLoadError = signal(false);
  private expertRemarksSubscription: Subscription | null = null;
  readonly canCheckSignReferralSignal = signal<boolean>(false);

  constructor(private _router: Router,
              public _lifecycleGroupService: LifecycleGroupService,
              private _transitionHistoryService: TransitionHistoryService,
              private _lifecycleService: LifecycleService,
              private _projectService: ProjectService,
              private _toasty: GlobalToastyService,
              private _dialogService: DialogService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  private readonly projectEffect = effect(() => {
    this._project = this.project();
  });

  readonly group = input<LifecycleGroupDto>(undefined);

  private readonly groupEffect = effect(() => {
    const group = this.group();
    if (!group) return;
    this.applyGroup(group);
  });

  showTransitionHistoryModal() {
    this.transitionHistoryModal()?.show();
    this.subscriptions.push(
      this._transitionHistoryService.getGroupHistory(this._group)
        .subscribe(res => {
          this.transitionHistory = res;
          this.cdr?.markForCheck?.();
        })
    );
  }

  showLifecycleTransitionHistoryModal(lifecycle) {
    this.lifecycleTransitionHistoryModal()?.show();
    this.subscriptions.push(
      this._transitionHistoryService.getLifecycleHistory(lifecycle)
        .subscribe(res => {
          this.lifecycleTransitionHistory = res;
          this.cdr?.markForCheck?.();
        })
    );
  }

  changed() {
    this.onChanged.emit(this._group);
    // Убираем markForCheck здесь - родительский компонент сам вызовет его при необходимости
  }

  showSearchSectionModal() {
    this.searchSectionListComponent()?.show(this._group.council.id);
  }

  canEditSections() {
    return this._group && this._group.state === LifecycleGroupState.ON_CHECKING && this.role() === Role.BUREAU_CHAIRMAN;
  }

  canChangeSections(lifecycle?: ProjectLifecycleDto) {
    return this._group.state === LifecycleGroupState.IN_PROCESSING && this.role() === Role.BUREAU_CHAIRMAN &&
      (lifecycle.state === ProjectLifecycleState.ON_CHOOSING_MEETING || lifecycle.state === ProjectLifecycleState.READY_FOR_MEETING ||
        lifecycle.state === ProjectLifecycleState.ON_EXPERT_EXAMINATION);
  }

  canAnswerForSectionQuestion(lifecycle?: ProjectLifecycleDto) {
    const project = this.projectValue;
    return this.role() === Role.CUSTOMER
      && project.isRescheduleSection
      && lifecycle.remarks.length > 0
      && project.canAddDocumentsForCustomerForSection;
  }

  answerForSectionRemark(lifecycle: ProjectLifecycleDto) {
    this.lifecycleRemark = lifecycle;
    this.remarkResponseForSection()?.show();
  }

  canAnswerForBureauQuestion(group?: LifecycleGroupDto) {
    const project = this.projectValue;
    return this.role() === Role.CUSTOMER
      && project.isRescheduleBureau
      && group.remarks.length > 0
      && project.canAddDocumentsForCustomerForBureau;
  }

  answerForBureauRemark(group: LifecycleGroupDto) {
    this.groupRemark = group;
    this.remarkResponseForBureau()?.show();
  }

  saveRemarkResponseForSection(remarks: RemarkDto[]) {
    this.lifecycleRemark.remarks = remarks;
    this.cdr?.markForCheck?.();
    this.subscriptions.push(
      this._lifecycleService.saveAnswerForSectionRemarks(this.lifecycleRemark).subscribe()
    );
  }

  saveRemarkResponseForBureau(remarks: RemarkDto[]) {
    this.groupRemark.remarks = remarks;
    this.cdr?.markForCheck?.();
    this.subscriptions.push(
      this._lifecycleGroupService.saveAnswerForBureauRemarks(this.groupRemark).subscribe()
    );
  }

  checkGroupRemarks(remarks: RemarkDto[]) {
    if (remarks === null || remarks === undefined) {
      return false;
    }
    if (remarks.length) {
      return true;
    }
    return false;
  }

  canShowExpertRemarks(): boolean {
    return this.role() === Role.BUREAU_CHAIRMAN;
  }

  showExpertRemarksModal(): void {
    const projectId = this.projectValue?.id;
    if (projectId == null) return;
    if (this.expertRemarksLoading()) return;
    this.expertRemarksSubscription?.unsubscribe();
    this.expertRemarksSubscription = null;
    this.expertRemarksList.set([]);
    this.expertRemarksLoadError.set(false);
    this.expertRemarksLoading.set(true);
    this.expertRemarksModal()?.show();
    this.expertRemarksSubscription = this._projectService.getExpertRemarksByProject(projectId).subscribe({
      next: (list) => {
        this.expertRemarksList.set(list ?? []);
        this.expertRemarksLoading.set(false);
        this.expertRemarksLoadError.set(false);
        this.expertRemarksSubscription = null;
      },
      error: () => {
        this.expertRemarksList.set([]);
        this.expertRemarksLoading.set(false);
        this.expertRemarksLoadError.set(true);
        this.expertRemarksSubscription = null;
        this._toasty.error('Не удалось загрузить замечания экспертов');
      }
    });
    this.subscriptions.push(this.expertRemarksSubscription);
  }
  replyForSectionRemark(remarks: RemarkDto[]) {
    this.lifecycleRemark.remarks = remarks;
    for (const remark of remarks) {
      if (remark.answer === null || remark.answer.trim().length < 1) {
        this._toasty.error("Все поля с ответами на замечания должны быть заполнены");
        return;
      }
    }
    this.remarkResponseForSection()?.hide();
    this.subscriptions.push(
      this._dialogService.showConfirmDialog('Ответить на замечания по объекту экспертизы',
        'Вы уверены, что хотите отправить ответы на замечания по объекту экспертизы ' + this.projectValue.title + '?',
        'Пожалуйста, проверьте список ответов и прикрепленных файлов, поскольку отменить действие будет невозможно')
        .subscribe(() => {
          this.subscriptions.push(
            this._lifecycleService.replyForSectionRemark(this.lifecycleRemark).subscribe(
              value => {
                this._project = value;
                this._lifecycle = this.lifecycleRemark;
                this.onReplyChanged.emit(this.projectValue);
                this.cdr?.markForCheck?.();
              }
            )
          );
        })
    );
  }

  replyForBureauRemark(remarks: RemarkDto[]) {
    this.groupRemark.remarks = remarks;
    for (const remark of remarks) {
      if (remark.answer === null || remark.answer.trim().length < 1) {
        this._toasty.error("Все поля с ответами на замечания должны быть заполнены");
        return;
      }
    }
    this.remarkResponseForBureau()?.hide();
    this.subscriptions.push(
      this._dialogService.showConfirmDialog('Ответить на замечания по объекту экспертизы',
        'Вы уверены, что хотите отправить ответы на замечания по объекту экспертизы ' + this.projectValue.title + '?',
        'Пожалуйста, проверьте список ответов и прикрепленных файлов, поскольку отменить действие будет невозможно')
        .subscribe(() => {
          this.subscriptions.push(
            this._lifecycleGroupService.replyForBureauRemark(this.groupRemark).subscribe(
              value => {
                this._project = value;
                this._group = this.groupRemark;
                this.onReplyChanged.emit(this.projectValue);
                this.cdr?.markForCheck?.();
              }
            )
          );
        })
    );
  }

  deleteLifecycle(lifecycle: ProjectLifecycleDto) {
    this.subscriptions.push(
      this._lifecycleService.deleteLifecycle(lifecycle).subscribe(() => {
        this._toasty.success("Секция удалена.");
        this._group.lifecycles = this._group.lifecycles.filter(lc => lc !== lifecycle);
        this.changed();
        this.cdr?.markForCheck?.();
      })
    );
  }

  changeSection(lifecycle: ProjectLifecycleDto) {
    this.subscriptions.push(
      this._dialogService.showConfirmDialog("Переназначение секции", `Вы уверены что хотите переназначить секцию?`,
        "Отменить действие будет невозможно").subscribe(() => {
        this._lifecycle = lifecycle;
        this.changeSectionListComponent()?.show(this._group.council.id);
      })
    );
  }

  onChangeSection($event: SectionPlainDto) {
    this.subscriptions.push(
      this._lifecycleGroupService.changeSection(this._lifecycle, this._group, $event.id).subscribe(value => {
        this._toasty.success("Секция переназначена.");
        this.changeSectionListComponent()?.hide();
        this.applyGroup(value);
      })
    );
  }

  canEditGroups() {
    const role = this.role();
    const project = this.projectValue;
    return (project.state === 'ON_CHECKING' && role === Role.GKNT_WORKER) ||
      (project.state === 'ON_DEPARTMENT_SIGNING' && role === Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  deleteLifecycleGroup(group: LifecycleGroupDto) {
    this.subscriptions.push(
      this._lifecycleGroupService.deleteLifecycleGroup(group).subscribe(() => {
        this._toasty.success("ГЭС удалён.");
        this.onDeleted.emit(group);
      })
    );
  }

  onSelectedSection($event: SectionPlainDto) {
    this.subscriptions.push(
      this._lifecycleGroupService.attachSection(this._group, $event.id).subscribe(res => {
        this._group.lifecycles.push(res);
        this._toasty.success("Секция прикреплена.");
        this.searchSectionListComponent()?.hide();
        this.changed();
        this.cdr?.markForCheck?.();
      })
    );
  }

  canEditConclusion() {
    return this._group.state === LifecycleGroupState.ON_CONCLUSION && this.role() === Role.BUREAU_CHAIRMAN;
  }

  generateConclusion(form) {
    this.isCreatingConclusion = true;
    this.cdr?.markForCheck?.();
    this.subscriptions.push(
      this._lifecycleGroupService.generateCouncilConclusion(this._group, form).subscribe({
        next: (res) => {
          this.isCreatingConclusion = false;
          this.closeConclusionForm();
          this._group.conclusion = res;
          this.changed();
          this.cdr?.markForCheck?.();
        },
        error: () => {
          this.isCreatingConclusion = false;
          this._toasty.error('Ошибка при создании документа');
          this.cdr?.markForCheck?.();
        }
      })
    );
  }

  deleteConclusion() {
    this._lifecycleGroupService.deleteCouncilConclusion(this._group.conclusion, this._group, () => {
      this._group.conclusion = null;
      this.changed();
    });
  }

  canEditReferral() {
    const role = this.role();
    const project = this.projectValue;
    return (project.state === 'ON_CHECKING' && role === Role.GKNT_WORKER) ||
      (project.state === 'ON_DEPARTMENT_SIGNING' && role === Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  showReferralForm() {
    this.referralFormModal()?.show();
  }

  generateReferral(form: any) {
    this.isCreatingReferral = true;
    this.subscriptions.push(
      this._lifecycleGroupService.generateReferral(this._group, form).subscribe({
        next: (res) => {
          this.isCreatingReferral = false;
          this.referralFormModal()?.hide();
          this._group.referral = res;
          this.checkReferralSignatures();
          this.changed();
          this.cdr?.markForCheck?.();
        },
        error: (err) => {
          this.isCreatingReferral = false;
          this._toasty.error('Ошибка при создании документа');
          this.cdr?.markForCheck?.();
        }
      })
    );
  }

  deleteReferral(_group: LifecycleGroupDto) {
    this._lifecycleGroupService.deleteReferral(_group.referral, _group, () => {
      _group.referral = null;
      this.canCheckSignReferralSignal.set(false);
      this.changed();
      this.cdr?.markForCheck?.();
    });
  }

  canEditLifecycleGroupDecision() {
    return this.projectValue.state === ProjectState.ON_DEPARTMENT_FINAL_SIGNING &&
      anyMatch(this.role(), Role.GKNT_WORKER, Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  showGroupDecisionForm() {
    this.groupDecisionFormModal()?.show();
  }

  canReadLifecycleGroupDecision() {
    return anyMatch(this._group.state, LifecycleGroupState.ACCEPTED, LifecycleGroupState.RETURNED, LifecycleGroupState.REJECTED);
  }

  deleteLifecycleGroupDecision(_group: LifecycleGroupDto) {
    this._lifecycleGroupService.deleteLifecycleGroupDecisionDocument(_group.decisionDocument, _group, () => {
      _group.decisionDocument = null;
      this.changed();
      this.cdr?.markForCheck?.();
    });
  }

  generateLifecycleGroupDecisionDocument(form: any) {
    this.isCreatingDecision = true;
    this.subscriptions.push(
      this._lifecycleGroupService.generateLifecycleGroupDecisionDocument(this._group, form).subscribe({
        next: (res) => {
          this.isCreatingDecision = false;
          this.groupDecisionFormModal()?.hide();
          this._group.decisionDocument = res;
          this.changed();
          this.cdr?.markForCheck?.();
        },
        error: (err) => {
          this.isCreatingDecision = false;
          this._toasty.error('Ошибка при создании документа');
          this.cdr?.markForCheck?.();
        }
      })
    );
  }

  ngOnDestroy() {
    this.expertRemarksSubscription?.unsubscribe();
    this.expertRemarksSubscription = null;
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  closeConclusionForm() {
    this.conclusionForm()?.close();
  }

  showConclusionForm() {
    this.councilFormModal()?.show();
    this.conclusionForm()?.startAutoSave();
  }

  trackByLifecycle(index: number, lifecycle: ProjectLifecycleDto): any {
    return lifecycle?.id || index;
  }

  private applyGroup(group: LifecycleGroupDto) {
    this._lifecycleGroupService.prepareGroup(group);
    this._group = group;
    this.checkReferralSignatures();
  }

  private checkReferralSignatures(): void {
    const group = this._group;
    if (group?.referral?.id) {
      const sub = this._lifecycleGroupService.checkReferralSignatures(group.id)
          .subscribe({
            next: (hasSignature) => {
              this.canCheckSignReferralSignal.set(hasSignature === true);
              this.cdr?.markForCheck?.();
            },
            error: (error) => {
              console.error('Error checking referral signatures:', error);
              this.canCheckSignReferralSignal.set(false);
              this.cdr?.markForCheck?.();
            }
          });
      this.subscriptions.push(sub);
    } else {
      this.canCheckSignReferralSignal.set(false);
    }
  }

  canCheckSignReferral(): boolean {
    return this.canCheckSignReferralSignal();
  }

}
