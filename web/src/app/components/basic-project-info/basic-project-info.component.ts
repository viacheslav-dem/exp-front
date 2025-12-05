import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActionButtonMetadata} from "@app/components/project-info/project-info.component";
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
import {Catalog, DataService} from "@app/services/data.service";
import {SubDirectionDto} from "@app/dto/SubDirectionDto";

@Component({
  selector: 'app-basic-project-info',
  templateUrl: './basic-project-info.component.html'
})
export class BasicProjectInfoComponent implements OnInit {

  ProjectStateBadge = ProjectStateBadge;
  LifecycleGroupState = LifecycleGroupState;
  Role = Role;
  SERVER_URL = SERVER_URL;
  DocType = DocType;

  project: ProjectDto = new ProjectDto();
  transitionHistory: ProjectTransitionHistoryDto;
  @Input() buttons: ActionButtonMetadata[] = [];
  @Input() role: string;
  @Input() lifecycleGroup: LifecycleGroupDto;
  @Input() visibleDocsForExpert: boolean;
  @Output() onChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('decisionFormModal', { static: false }) decisionFormModal: ModalComponent;
  @ViewChild('transitionHistoryModal', { static: false }) transitionHistoryModal: ModalComponent;
  @ViewChild('projectDocumentsComponent', { static: false }) projectDocumentsComponent: DocumentListComponent;
  @ViewChild('projectDocumentsComponent', { static: false }) projectDocumentsComponent1: DocumentListComponent;

  constructor(private _personService: PersonService,
              private _projectService: ProjectService,
              private _transitionHistoryService: TransitionHistoryService,
              private _toasty: GlobalToastyService,
              private authService: AuthService,
              private _documentService: DocumentService,
              private _dataService: DataService) {
  }

  ngOnInit() {
  }

  @Input() set setProject(project) {
    if (project.returnReason) {
      project.red = true;
    }
    this._projectService.prepareProject(project);
    this.project = project;
  }

  changed() {
    this.onChanged.emit(this.project);
  }

  showTransitionHistoryModal() {
    if (anyMatch(this.authService.getCurrRole(), Role.EXPERT, Role.BUREAU_ASSESSOR, Role.SECTION_ASSESSOR)) {
      return;
    }
    this.transitionHistoryModal.show();
    this._transitionHistoryService.getProjectHistory(this.project)
      .subscribe(res => this.transitionHistory = res);
  }

  canEditProjectDocuments(): boolean {
    return this.project.state == ProjectState.ROUGH || this.role == Role.BELISA_EDIT;
  }

  addProjectDocument(doc) {
    if (this.role == Role.CUSTOMER) {
      doc.isCustomer = true;
    }
    this.project.documents = this.project.documents.concat([doc]);
    this.changed();
  }

  deleteProjectDocument(doc) {
    this._projectService.deleteDocument(this.project, doc, () => {
      // reassigning allows DocumentListComponent to detect the change
      this.project.documents = this.project.documents.filter(d => d.id != doc.id);
      this.changed();
    });
  }

  updateProjectDocument(doc: DocumentDto) {
    this._projectService.updateDocument(this.project, doc).subscribe(res => {
      Object.assign(this.project.documents.find(d => d.id == doc.id), res);
      this._toasty.success("Документ успешно обновлён.");
      this.projectDocumentsComponent.hideEditor();
    })
  }

  canEditDecision() {
    return this.project.state == ProjectState.ON_CHECKING && this.role == Role.GKNT_WORKER ||
      this.project.state == ProjectState.ON_DEPARTMENT_SIGNING && this.role == Role.GKNT_DEPARTMENT_CHAIRMAN;
  }

  canEditDecisionWithRemarks() {
    return this.project.state == ProjectState.ON_DEPARTMENT_FINAL_SIGNING && (this.role == Role.GKNT_WORKER ||
      this.role == Role.GKNT_DEPARTMENT_CHAIRMAN);
  }

  canReadDecision() {
    if (this.role == Role.CUSTOMER && this.project.state == ProjectState.RETURNED) {
      return true;
    }
    return anyMatch(this.project.state,
      ProjectState.ON_CHECKING, ProjectState.ON_DEPARTMENT_SIGNING,
      ProjectState.ON_SIGNING, ProjectState.RETURNED
    ) && anyMatch(this.role,
      Role.GKNT_WORKER, Role.GKNT_DEPARTMENT_CHAIRMAN, Role.GKNT_CHAIRMAN,
      Role.BELISA_EDIT, Role.BELISA_READ
    ) || (anyMatch(this.role,
      Role.GKNT_WORKER, Role.GKNT_DEPARTMENT_CHAIRMAN, Role.GKNT_CHAIRMAN,
      Role.BELISA_EDIT, Role.BELISA_READ) && ProjectState.ON_DEPARTMENT_FINAL_SIGNING &&
      (this.project.isBureauRemarksExpired || this.project.isSectionRemarksExpired));
  }

  generateDecisionDocument(form: any) {
    this._projectService.generateDecisionDocument(this.project, form).subscribe(res => {
      this.project.decisionDocument = res;
      this.decisionFormModal.hide();
      this.changed();
    });
  }

  deleteDecisionDocument() {
    this._projectService.deleteDecisionDocument(this.project, this.project.decisionDocument, () => {
      this.project.decisionDocument = null;
      this.changed();
    });
  }

  downloadAllDocuments(project: ProjectDto) {
    this._documentService.downloadAllDocuments(project).subscribe();
  }

  checkVisibleForBureau(): boolean {
    return (anyMatch(this.role, Role.BUREAU_CHAIRMAN, Role.BUREAU_ASSESSOR) && this.lifecycleGroup != null
      && this.lifecycleGroup.state == null
        // ProjectLifecycleState.RETURNED
    );
  }
  isCustomer(): DocumentDto[] {
    let documents = [];
    for (let i = 0; i < this.project.documents.length; i++) {
      if (this.project.documents[i].isCustomer == true) {
        documents.push(this.project.documents[i]);
      }
    }
    return documents;
  }
  isNotCustomer(): DocumentDto[] {
    let documents = [];
    for (let i = 0; i < this.project.documents.length; i++) {
      if (!this.project.documents[i].isCustomer == true) {
        documents.push(this.project.documents[i]);
      }
    }
    return documents;
  }

  displayDirection() {
    console.log(this.project);
    let subDirections = this.project.subDirections;
    // let directions = this.project.directions;
    let catalogDirections: DirectionDto[];
    this._dataService.getCatalog(Catalog.DIRECTION).subscribe(res => {
      catalogDirections = res as DirectionDto[];
    });
    let newDirections: DirectionDto[] = [];
    for (let i = 0; i < catalogDirections.length; i++) {
      for (let j = 0; j < catalogDirections[i].subDirectionDtos.length; j++) {
        for (let k = 0; k < subDirections.length; k++) {
          if(catalogDirections[i].subDirectionDtos[j].directionName === subDirections[k].directionName){
            let newDir = catalogDirections[i];
            let flag = false;
            for (let l = 0; l < newDirections.length; l++) {
              if(newDirections[l].name === newDir.name){
                newDirections[l].subDirectionDtos.push(subDirections[k]);
                flag = true;
                break;
              }
            }
            if(!flag) {
              newDir.subDirectionDtos.push(subDirections[k]);
              newDirections.push(newDir);
            }
          }
        }
      }
    }
    return newDirections;
  }

    displayDirectionOrSubDirection() {
    let directionsToDisplay: DirectionDto[] = [];
    let projectDirections = this.project.directions;
    for (let i = 0; i < projectDirections.length; i++) {
      let proDir = projectDirections[i] as DirectionDto;
      proDir.subDirectionDtos = [];
      directionsToDisplay.push(proDir);
    }
    if (this.project.subDirections === null){
      return directionsToDisplay;
    } else {
      let projectSubDirections = this.project.subDirections;
      for (let i = 0; i < projectSubDirections.length; i++) {
        let proSubDir = projectSubDirections[i];
        for (let j = 0; j < directionsToDisplay.length; j++) {
          let dirToDis = directionsToDisplay[j];
          let proDirId = proSubDir.direction.id;
          let dirToDisId = dirToDis.id;
          if(proDirId == dirToDisId){
            dirToDis.subDirectionDtos.push(proSubDir);
          }
        }
      }
    }
    return directionsToDisplay;
  }

}
