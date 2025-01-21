import {Component, Input, ViewChild} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {ProjectDto} from "@app/dto/ProjectDto";
import {Role} from "@app/pipes/role.pipe";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {ReturnFromCouncilWithoutExpertiseFormContent} from "@app/components/document-form/form-model/ReturnFromCouncilWithoutExpertiseFormContent";
import {LifecycleGroupDto} from "@app/dto/LifecycleGroupDto";
import {CouncilPlainDto} from "@app/dto/CouncilPlainDto";
import {Catalog} from "@app/services/data.service";

@Component({
  selector: 'app-return-from-council-without-expertise-form',
  templateUrl: './return-from-council-without-expertise-form.component.html',
  styles: [``]
})
export class ReturnFromCouncilWithoutExpertiseFormComponent extends DocumentForm<ReturnFromCouncilWithoutExpertiseFormContent> {

  Role = Role;
  Catalog = Catalog;

  @Input() project: ProjectDto;
  @Input() group: LifecycleGroupDto;
  @Input() council: CouncilPlainDto;

  @ViewChild(SearchPersonByRolesComponent) public searchPersonModal: SearchPersonByRolesComponent;

  ngOnInit() {
    super.ngOnInit();
    this._form.chairman = this.group.bureauChairman;
  }

  validate() {
    super.validate();
    if (this._form.targetCouncil && this._form.targetCouncil.id == this.council.id) {
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
