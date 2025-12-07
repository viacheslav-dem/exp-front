import {Component, ComponentFactoryResolver, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {Role} from "@app/pipes/role.pipe";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import * as moment from "moment";
import {PersonService} from "@app/services/person.service";
import {ProjectDto} from "@app/dto/ProjectDto";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";
import {CouncilConclusionFormContent} from "@app/components/document-form/form-model/CouncilConclusionFormContent";
import {CouncilConclusionForm} from "@app/components/document-form/council-conclusion-form/council-conclusion-form";
import {AgendaNewFormContent} from "@app/components/document-form/meeting-protocol-form/AgendaNewFormContent";
import {isEmptyOrNull} from "@app/support/utils";
import {Text} from "@app/components/document-form/form-model/Text";
import {CouncilConclusionFormResolver} from "@app/components/document-form/council-conclusion-form/council-conclusion-form-resolver.service";

@Component({
  selector: 'app-council-conclusion-form',
  templateUrl: './council-conclusion-form-container.component.html',
  styles: [`
      ::ng-deep .hint {
          margin-top: 0.5rem;
          font-style: italic;
          font-size: 0.875rem;
      }

      ::ng-deep .hint p {
          margin-bottom: 0.5rem;
      }

      ::ng-deep .hint ul {
          margin-bottom: 0.5rem;
      }
  `]
})
export class CouncilConclusionFormContainerComponent extends DocumentForm<CouncilConclusionFormContent> {

  Role = Role;

  documents: Text[] = [];
  formComponent: CouncilConclusionForm;

  _project: ProjectDto;
  _group: LifecycleGroupDto;

  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;
  @ViewChild('form', { read: ViewContainerRef, static: true }) formContainer: any;

  constructor(private _personService: PersonService,
              private resolver: ComponentFactoryResolver,
              private _formTypeResolver: CouncilConclusionFormResolver) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  createNewForm(): CouncilConclusionFormContent {
    return new CouncilConclusionFormContent();
  }

  get project() {
    return this._project;
  }

  @Input()
  set project(project: ProjectDto) {
    this._project = project;
    this.updateFormComponent(this._formTypeResolver.getFormRenderer(this._project.code.code));
  }

  get group() {
    return this._group;
  }

  @Input()
  set group(group: LifecycleGroupDto) {
    this._group = group;
    this._form.chairman = this._form.chairman || this._group.bureauChairman;
    if (this.formComponent) {
      this.formComponent.group = this._group;
    }
  }

  updateFormComponent(_formRenderer) {
    if (!_formRenderer) {
      return;
    }
    while (this.formContainer.length > 0) {
      this.formContainer.get(0).destroy();
    }
    let componentFactory = this.resolver.resolveComponentFactory(_formRenderer);
    const componentRef = this.formContainer.createComponent(componentFactory);
    this.formComponent = componentRef.instance as CouncilConclusionForm;
    this.formComponent.parent = this;
    this.formComponent.project = this.project;
    this.formComponent.group = this.group;
    this.formComponent.setForm(this._form.projectProtocol);
  }

  validate() {
    super.validate();
    this.formComponent.validate();
  }

  getForm(): CouncilConclusionFormContent {
    let form = super.getForm();
    form.projectProtocol = this.formComponent.getForm();
    form.documents = this.documents.map(obj => obj.text).filter(document => !isEmptyOrNull(document));
    return form;
  }

  setForm(form: CouncilConclusionFormContent) {
    super.setForm(form);
    this._form.projectProtocol = this._form.projectProtocol || new AgendaNewFormContent();
    this._form.chairman = this._form.chairman || this._group.bureauChairman;
    this._form.documents = this._form.documents || [];
    this.documents = this._form.documents.map(d => new Text(d));
    this._form.innerExpertiseDate = this._form.innerExpertiseDate || moment().valueOf();
    if (this.formComponent) {
      this.formComponent.setForm(this._form.projectProtocol);
    }
  }

  showSearchChairmanModal() {
    this.searchPersonModal.show();
  }

  selectPerson(person: PersonPlainDto) {
    this._form.chairman = person;
    this.searchPersonModal.hide();
  }

  needSelectDirections() {
    return !ProjectCodePlainDto.isCodeIn(this.project.code.code, 9, 10, 13);
  }

  is_8_9() {
    return ProjectCodePlainDto.isCode(this.project.code.code, 9);
  }

  addDocument() {
    this.documents.push(new Text());
  }
}
