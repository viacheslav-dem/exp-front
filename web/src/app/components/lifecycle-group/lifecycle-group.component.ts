import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, input} from '@angular/core';
import {Subscription} from 'rxjs';
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

@Component({
    selector: 'app-lifecycle-group',
    templateUrl: './lifecycle-group.component.html',
    standalone: false
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

  readonly role = input(undefined);
  readonly project = input<ProjectDto>(new ProjectDto());
  _project: ProjectDto;

  get projectValue(): ProjectDto {
    return this._project ?? this.project();
  }

  @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onReplyChanged: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(CouncilConclusionFormContainerComponent, { static: false }) conclusionForm: CouncilConclusionFormContainerComponent;
  @ViewChild('searchSection', { static: false }) searchSectionListComponent: SearchSectionComponent;
  @ViewChild('changeSection', { static: false }) changeSectionListComponent: SearchSectionComponent;
  @ViewChild('referralFormModal', { static: false }) referralFormModal: ModalComponent;
  @ViewChild('councilFormModal', { static: false }) councilFormModal: ModalComponent;
  @ViewChild('groupDecisionFormModal', { static: false }) groupDecisionFormModal: ModalComponent;
  @ViewChild('transitionHistoryModal', { static: false }) transitionHistoryModal: ModalComponent;
  @ViewChild('lifecycleTransitionHistoryModal', { static: false }) lifecycleTransitionHistoryModal: ModalComponent;
  @ViewChild('remarkResponseForSection', { static: false }) remarkResponseForSection: ModalComponent;
  @ViewChild('remarkResponseForBureau', { static: false }) remarkResponseForBureau: ModalComponent;

  constructor(private _router: Router,
              public _lifecycleGroupService: LifecycleGroupService,
              private _transitionHistoryService: TransitionHistoryService,
              private _lifecycleService: LifecycleService,
              private _toasty: GlobalToastyService,
              private _dialogService: DialogService) {
  }

  ngOnInit() {
    this._project = this.project();
  }

  @Input() set group(group) {
    if (!group) return;
    this._lifecycleGroupService.prepareGroup(group);
    this._group = group;
  }

  showTransitionHistoryModal() {
    this.transitionHistoryModal.show();
    this.subscriptions.push(
      this._transitionHistoryService.getGroupHistory(this._group)
        .subscribe(res => this.transitionHistory = res)
    );
  }

  showLifecycleTransitionHistoryModal(lifecycle) {
    this.lifecycleTransitionHistoryModal.show();
    this.subscriptions.push(
      this._transitionHistoryService.getLifecycleHistory(lifecycle)
        .subscribe(res => this.lifecycleTransitionHistory = res)
    );
  }

  changed() {
    this.onChanged.emit(this._group);
  }

  showSearchSectionModal() {
    this.searchSectionListComponent.show(this._group.council.id)
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
    this.remarkResponseForSection.show();
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
    this.remarkResponseForBureau.show();
  }

  saveRemarkResponseForSection(remarks: RemarkDto[]) {
    this.lifecycleRemark.remarks = remarks;
    this.subscriptions.push(
      this._lifecycleService.saveAnswerForSectionRemarks(this.lifecycleRemark).subscribe()
    );
  }

  saveRemarkResponseForBureau(remarks: RemarkDto[]) {
    this.groupRemark.remarks = remarks;
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
  replyForSectionRemark(remarks: RemarkDto[]) {
    this.lifecycleRemark.remarks = remarks;
    for (const remark of remarks) {
      if (remark.answer === null || remark.answer.trim().length < 1) {
        this._toasty.error("Все поля с ответами на замечания должны быть заполнены");
        return;
      }
    }
    this.remarkResponseForSection.hide();
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
    this.remarkResponseForBureau.hide();
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
      })
    );
  }

  changeSection(lifecycle: ProjectLifecycleDto) {
    this.subscriptions.push(
      this._dialogService.showConfirmDialog("Переназначение секции", `Вы уверены что хотите переназначить секцию?`,
        "Отменить действие будет невозможно").subscribe(() => {
        this._lifecycle = lifecycle;
        this.changeSectionListComponent.show(this._group.council.id);
      })
    );
  }

  onChangeSection($event: SectionPlainDto) {
    this.subscriptions.push(
      this._lifecycleGroupService.changeSection(this._lifecycle, this._group, $event.id).subscribe(value => {
        this._toasty.success("Секция переназначена.");
        this.changeSectionListComponent.hide();
        this.group = value;
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
        this.searchSectionListComponent.hide();
        this.changed();
      })
    );
  }

  canEditConclusion() {
    return this._group.state === LifecycleGroupState.ON_CONCLUSION && this.role() === Role.BUREAU_CHAIRMAN;
  }

  generateConclusion(form) {
    this.subscriptions.push(
      this._lifecycleGroupService.generateCouncilConclusion(this._group, form).subscribe(res => {
        this.closeConclusionForm();
        this._group.conclusion = res;
        this.changed();
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

  generateReferral(form: any) {
    this.isCreatingReferral = true;
    this.subscriptions.push(
      this._lifecycleGroupService.generateReferral(this._group, form).subscribe({
        next: (res) => {
          this.isCreatingReferral = false;
          this.referralFormModal.hide();
          this._group.referral = res;
          this.changed();
        },
        error: (err) => {
          this.isCreatingReferral = false;
          this._toasty.error('Ошибка при создании документа');
        }
      })
    );
  }

  deleteReferral(_group: LifecycleGroupDto) {
    this._lifecycleGroupService.deleteReferral(_group.referral, _group, () => {
      _group.referral = null;
      this.changed();
    });
  }

  canEditLifecycleGroupDecision() {
    return this.projectValue.state === ProjectState.ON_DEPARTMENT_FINAL_SIGNING &&
      anyMatch(this.role(), Role.GKNT_WORKER, Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  canReadLifecycleGroupDecision() {
    return anyMatch(this._group.state, LifecycleGroupState.ACCEPTED, LifecycleGroupState.RETURNED, LifecycleGroupState.REJECTED);
  }

  deleteLifecycleGroupDecision(_group: LifecycleGroupDto) {
    this._lifecycleGroupService.deleteLifecycleGroupDecisionDocument(_group.decisionDocument, _group, () => {
      _group.decisionDocument = null;
      this.changed();
    });
  }

  generateLifecycleGroupDecisionDocument(form: any) {
    this.groupDecisionFormModal.hide();
    this.subscriptions.push(
      this._lifecycleGroupService.generateLifecycleGroupDecisionDocument(this._group, form).subscribe(res => {
        this._group.decisionDocument = res;
        this.changed();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  closeConclusionForm() {
    this.conclusionForm.close();
  }

  showConclusionForm() {
    this.councilFormModal.show();
    this.conclusionForm.startAutoSave();
  }

  trackByLifecycle(index: number, lifecycle: ProjectLifecycleDto): any {
    return lifecycle?.id || index;
  }
}
