import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
  output
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActionButtonMetadata} from "@app/components/project-info/action-button-metadata";
import {ProjectState, ProjectStateBadge} from "@app/pipes/project-state.pipe";
import {Role} from "@app/pipes/role.pipe";
import {PersonService} from "@app/services/person.service";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {anyMatch} from "@app/support/utils";
import {ProjectService} from "@app/services/project.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {TransitionHistoryService} from "@app/services/transition-history.service";
import {ProjectTransitionHistoryDto} from "@app/dto/ProjectTransitionHistoryDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SERVER_URL} from "@app/config";
import {DocumentListComponent} from "@app/components/common-components/document-list/document-list.component";
import {AuthService} from "@app/services/auth.service";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {DocumentService} from "@app/services/document.service";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {LifecycleGroupState} from "@app/pipes/lifecycle-group-state.pipe";
import {DirectionDto} from "@app/dto/DirectionDto";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-basic-project-info',
    templateUrl: './basic-project-info.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectDetail) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class BasicProjectInfoComponent {

  ProjectStateBadge = ProjectStateBadge;
  LifecycleGroupState = LifecycleGroupState;
  Role = Role;
  SERVER_URL = SERVER_URL;
  DocType = DocType;

  private readonly _project = signal<ProjectDto>(new ProjectDto());
  get project(): ProjectDto {
    return this._project();
  }

  readonly transitionHistory = signal<ProjectTransitionHistoryDto | null>(null);

  // computed signals (вместо precomputed полей) — пересчитываются только при изменении зависимостей,
  // а не на каждый прогон CD, что особенно важно для zoneless.
  readonly displayedDirections = computed<DirectionDto[]>(() => {
    const project = this._project();
    const projectDirections = (project?.directions ?? []) as unknown as DirectionDto[];
    const projectSubDirections = project?.subDirections ?? [];

    if (!projectDirections.length) {
      return [];
    }

    const directionsToDisplay: DirectionDto[] = [];
    const directionById = new Map<number, DirectionDto>();
    for (let i = 0; i < projectDirections.length; i++) {
      const dir = projectDirections[i];
      if (!dir) continue;
      // clone object to avoid mutating original project.directions
      const proDir = { ...dir, subDirectionDtos: [] } as DirectionDto;
      directionsToDisplay.push(proDir);
      if (proDir.id != null) {
        directionById.set(proDir.id, proDir);
      }
    }

    if (projectSubDirections.length) {
      for (let i = 0; i < projectSubDirections.length; i++) {
        const proSubDir = projectSubDirections[i];
        const dirId = proSubDir?.direction?.id;
        if (!dirId) continue;
        const dirToDis = directionById.get(dirId);
        if (!dirToDis) continue;
        dirToDis.subDirectionDtos.push(proSubDir);
      }
    }

    return directionsToDisplay;
  });

  private readonly documentBuckets = computed(() => {
    const docs = this._project()?.documents ?? [];
    const customer: DocumentDto[] = [];
    const notCustomer: DocumentDto[] = [];

    for (let i = 0; i < docs.length; i++) {
      const d = docs[i];
      if (!d) continue;
      if (d.isCustomer === true) {
        customer.push(d);
      } else {
        notCustomer.push(d);
      }
    }

    return { customer, notCustomer };
  });

  readonly customerDocuments = computed(() => this.documentBuckets().customer);
  readonly notCustomerDocuments = computed(() => this.documentBuckets().notCustomer);
  readonly buttons = input<ActionButtonMetadata[]>([]);
  readonly role = input<string>(undefined);
  readonly lifecycleGroup = input<LifecycleGroupDto>(undefined);
  readonly visibleDocsForExpert = input<boolean>(undefined);
  readonly onChanged = output<ProjectDto>();

  decisionFormModal = viewChild<ModalComponent>('decisionFormModal');
  transitionHistoryModal = viewChild<ModalComponent>('transitionHistoryModal');
  customerDocumentsComponent = viewChild<DocumentListComponent>('customerDocumentsComponent');
  notCustomerDocumentsComponent = viewChild<DocumentListComponent>('notCustomerDocumentsComponent');

  private readonly _destroyRef = inject(DestroyRef);

  constructor(private _personService: PersonService,
              private _projectService: ProjectService,
              private _transitionHistoryService: TransitionHistoryService,
              private _toasty: GlobalToastyService,
              private authService: AuthService,
              private _documentService: DocumentService) {
  }

  readonly setProject = input<ProjectDto>(undefined);

  private _processingProject = false; // Флаг для предотвращения повторных вызовов effect'а
  private _lastProjectRef: ProjectDto | undefined;

  // Effect создаётся для side effects, значение не используется напрямую
  private readonly _setProjectEffect = effect(() => {
    // Защита если эффект повторно вызывается пока мы ещё в обработке — пропускаем.
    if (this._processingProject) {
      return;
    }

    const project = this.setProject();
    if (!project) {
      return;
    }

    // Best practice для signal inputs: пропускаем только если входной объект тот же по ссылке.
    // ВАЖНО: не блокируем обновления для того же `id`, если пришла новая reference (например, после reload/save).
    if (Object.is(this._lastProjectRef, project)) {
      return;
    }

    this._processingProject = true;
    this._lastProjectRef = project;
    try {
      // ВСЕГДА создаём копию, так как prepareProject мутирует объект (устанавливает red/yellow/blue/termsMessage)
      // Это предотвращает мутацию исходного объекта из input signal, что может вызвать цикл
      const projectCopy = { ...project };
      if (project.returnReason) {
        projectCopy.red = true;
      }
      this._projectService.prepareProject(projectCopy);

      // Нормализация массивов: в шаблоне активно используются `.length`, поэтому защищаемся от `undefined`
      // (частая причина runtime-ошибок после "spread-copy" DTO).
      const normalized = { ...new ProjectDto(), ...projectCopy } as ProjectDto;
      normalized.financing = normalized.financing ?? [];
      normalized.directions = normalized.directions ?? [];
      normalized.subDirections = normalized.subDirections ?? [];
      normalized.socialEconomicGoals = normalized.socialEconomicGoals ?? [];
      normalized.documents = normalized.documents ?? [];
      normalized.commercializationMethods = normalized.commercializationMethods ?? [];
      normalized.projectSpecialization = normalized.projectSpecialization ?? [];

      // Присваиваем напрямую - в effect() запись в state разрешена; signal гарантирует обновление view и в zoneless.
      this._project.set(normalized);
    } finally {
      this._processingProject = false;
    }
  });

  changed(): void {
    this.onChanged.emit(this._project());
  }

  showTransitionHistoryModal() {
    if (anyMatch(this.authService.getCurrRole(), Role.EXPERT, Role.BUREAU_ASSESSOR, Role.SECTION_ASSESSOR)) {
      return;
    }
    this.transitionHistoryModal()?.show();
    this._transitionHistoryService.getProjectHistory(this.project)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
        this.transitionHistory.set(res);
      });
  }

  canEditProjectDocuments(): boolean {
    return this.project.state == ProjectState.ROUGH || this.role() == Role.BELISA_EDIT;
  }

  addProjectDocument(doc: DocumentDto): void {
    if (this.role() == Role.CUSTOMER) {
      doc.isCustomer = true;
    }
    this._project.update(p => ({
      ...p,
      documents: (p?.documents ?? []).concat([doc])
    } as ProjectDto));
    this.changed();
  }

  deleteProjectDocument(doc: DocumentDto): void {
    this._projectService.deleteDocument(this.project, doc, () => {
      const docId = doc?.id;
      // переназначаем массив, позволяет DocumentListComponent обнаружить изменение
      this._project.update(p => ({
        ...p,
        documents: (p?.documents ?? []).filter(d => d?.id != docId)
      } as ProjectDto));
      this.changed();
    });
  }

  updateProjectDocument(doc: DocumentDto): void {
    this._projectService.updateDocument(this.project, doc)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(res => {
      const docId = doc?.id;
      this._project.update(p => {
        const docs = p?.documents ?? [];
        const index = docs.findIndex(d => d?.id == docId);
        if (index < 0) {
          return p;
        }
        return {
          ...p,
          documents: [
            ...docs.slice(0, index),
            res,
            ...docs.slice(index + 1),
          ]
        } as ProjectDto;
      });
      this.changed();
      this._toasty.success("Документ успешно обновлён.");
      // В шаблоне два списка документов — закрываем редактор в обоих (кто открыт, тот и закроется).
      this.customerDocumentsComponent()?.hideEditor?.();
      this.notCustomerDocumentsComponent()?.hideEditor?.();
    });
  }

  canEditDecision() {
    const role = this.role();
    return this.project.state == ProjectState.ON_CHECKING && role == Role.GKNT_WORKER ||
      this.project.state == ProjectState.ON_DEPARTMENT_SIGNING && role == Role.GKNT_DEPARTMENT_CHAIRMAN;
  }

  canEditDecisionWithRemarks() {
    const role = this.role();
    return this.project.state == ProjectState.ON_DEPARTMENT_FINAL_SIGNING && (role == Role.GKNT_WORKER ||
      role == Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  canReadDecision() {
    const role = this.role();
    if (role == Role.CUSTOMER && this.project.state == ProjectState.RETURNED) {
      return true;
    }
    return anyMatch(this.project.state,
      ProjectState.ON_CHECKING, ProjectState.ON_DEPARTMENT_SIGNING,
      ProjectState.ON_SIGNING, ProjectState.RETURNED
    ) && anyMatch(role,
      Role.GKNT_WORKER, Role.GKNT_DEPARTMENT_CHAIRMAN, Role.GKNT_CHAIRMAN,
      Role.BELISA_EDIT, Role.BELISA_READ
    ) || (anyMatch(role,
      Role.GKNT_WORKER, Role.GKNT_DEPARTMENT_CHAIRMAN, Role.GKNT_CHAIRMAN,
      Role.BELISA_EDIT, Role.BELISA_READ) && ProjectState.ON_DEPARTMENT_FINAL_SIGNING &&
      (this.project.isBureauRemarksExpired || this.project.isSectionRemarksExpired));
  }

  readonly decisionDocumentLoading = signal(false);

  generateDecisionDocument(form: any) {
    this.decisionDocumentLoading.set(true);
    this._projectService.generateDecisionDocument(this.project, form)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this._project.update(p => ({ ...p, decisionDocument: res } as ProjectDto));
          this.decisionFormModal()?.hide();
          this.changed();
          this.decisionDocumentLoading.set(false);
        },
        error: () => {
          this.decisionDocumentLoading.set(false);
        }
      });
  }

  deleteDecisionDocument() {
    this._projectService.deleteDecisionDocument(this.project, this.project.decisionDocument, () => {
      this._project.update(p => ({ ...p, decisionDocument: null } as ProjectDto));
      this.changed();
    });
  }

  downloadAllDocuments(project: ProjectDto) {
    this._documentService.downloadAllDocuments(project)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  checkVisibleForBureau(): boolean {
    const lifecycleGroup = this.lifecycleGroup();
    return (anyMatch(this.role(), Role.BUREAU_CHAIRMAN, Role.BUREAU_ASSESSOR) && lifecycleGroup != null
      && lifecycleGroup.state == null
        // ProjectLifecycleState.RETURNED
    );
  }

  // Методы-обертки для использования в шаблоне (viewChild возвращает сигнал)
  showDecisionModal(): void {
    this.decisionFormModal()?.show();
  }

  hideDecisionModal(): void {
    this.decisionFormModal()?.hide();
  }

}
