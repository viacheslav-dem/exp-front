import {Component, ViewChild, input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {ProjectDto} from "@app/dto/ProjectDto";
import {Role} from "@app/pipes/role.pipe";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {ReturnFromCouncilWithoutExpertiseFormContent} from "@app/components/document-form/form-model/ReturnFromCouncilWithoutExpertiseFormContent";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {Catalog} from "@app/services/data.service";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-return-from-council-without-expertise-form',
    templateUrl: './return-from-council-without-expertise-form.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.projectFlow)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ReturnFromCouncilWithoutExpertiseFormComponent extends DocumentForm<ReturnFromCouncilWithoutExpertiseFormContent> {
  
  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  Role = Role;
  Catalog = Catalog;

  readonly project = input<ProjectDto>(undefined);
  readonly group = input<LifecycleGroupDto>(undefined);
  readonly council = input<CouncilPlainDto>(undefined);

  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;

  ngOnInit() {
    super.ngOnInit();
    this._form.chairman = this.group().bureauChairman;
  }

  validate() {
    super.validate();
    if (this._form.targetCouncil && this._form.targetCouncil.id == this.council().id) {
      throw 'Рекомендуемый ГЭС совпадает с Вашим.';
    }
  }

  createNewForm(): ReturnFromCouncilWithoutExpertiseFormContent {
    return new ReturnFromCouncilWithoutExpertiseFormContent();
  }

  showSearchChairmanModal() {
    this.searchPersonModal.show();
  }

  selectPerson(person: PersonPlainDto) {
    this._form.chairman = person;
    this.searchPersonModal.hide();
  }
}
