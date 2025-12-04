import {Component, ViewChild, input} from '@angular/core';
import {DocumentForm} from "@app/components/document-form/document-form";
import {ProjectDto} from "@app/dto/ProjectDto";
import {Role} from "@app/pipes/role.pipe";
import {SearchPersonByRolesComponent} from "@app/components/search/search-person/search-person-by-role.component";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {ReferralFormContent} from "@app/components/document-form/form-model/ReferralFormContent";
import {ProjectCodePlainDto} from "@app/dto/ProjectCodePlainDto";

@Component({
    selector: 'app-referral-form',
    templateUrl: './referral-form.component.html',
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
  `],
    standalone: false
})
export class ReferralFormComponent extends DocumentForm<ReferralFormContent> {

  Role = Role;

  searchPersonFilter;

  readonly project = input<ProjectDto>(undefined);
  readonly council = input<any>(undefined);

  @ViewChild(SearchPersonByRolesComponent, { static: false }) public searchPersonModal: SearchPersonByRolesComponent;

  ngOnInit() {
    super.ngOnInit();
    this.searchPersonFilter = FilterBuilder.equals('gkntDepartment', this.project().gkntDepartment);
    this._form.gkntDepartmentChairman = this.project().gkntDepartmentChairman;
  }

  createNewForm(): ReferralFormContent {
    return new ReferralFormContent();
  }

  showSearchChairmanModal() {
    this.searchPersonModal.show();
  }

  selectPerson(person: PersonPlainDto) {
    this._form.gkntDepartmentChairman = person;
    this.searchPersonModal.hide();
  }

  is8_6() {
    return ProjectCodePlainDto.isCode(this.project().code.code, 6);
  }
}
