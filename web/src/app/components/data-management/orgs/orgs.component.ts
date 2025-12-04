import {Component, ViewChild} from '@angular/core';
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DataService} from "@app/services/data.service";
import {OrgDto} from "@app/dto/OrgDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {SearchPersonComponent} from "@app/components/search/search-person/search-person.component";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {SearchOrgComponent} from "@app/components/search/search-org/search-org.component";

@Component({
    selector: 'app-orgs',
    templateUrl: './orgs.component.html',
    standalone: false
})
export class OrgsComponent extends FilterAndPages<OrgDto> {

  orgs: OrgDto[];
  subOrgs: OrgDto[] = [];
  selectedOrg: OrgDto;
  editedOrg: OrgDto;

  @ViewChild(SearchPersonComponent) public searchPersonModal: SearchPersonComponent;
  @ViewChild(SearchOrgComponent) public searchOrgModal: SearchOrgComponent;
  @ViewChild('showSubOrgModal') showSubOrgModal: ModalComponent;

  constructor(private _toasty: GlobalToastyService,
              private _dataService: DataService) {
    super();
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по наименованию...')
        .setSortDirection(Direction.ASC).setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    this.enableFilterCache("orgs");
  }

  loadPage() {
    this._dataService.getOrgsAdminPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.orgs = this._page.content;
    }, () => this.setLoading(false));
  }

  editOrg(org: OrgDto) {
    if (this.selectedOrg) {
      this.selectedOrg.isEdit = false;
    }
    this.selectedOrg = org;
    this.editedOrg = (this.selectedOrg.id == 0 ?
      this.selectedOrg : OrgsComponent.copyOrg(this.selectedOrg));
    this.selectedOrg.isEdit = this.selectedOrg.isExpanded = true;
  }

  cancelEditOrg() {
    this.selectedOrg.isEdit = false;
  }

  saveEditedOrg() {
    if (this.editedOrg.parentOrg != null) {
      if (this.editedOrg.id == this.editedOrg.parentOrg.id) {
        this._toasty.error('Невозможно указать свою организацию головной.');
        return;
      }
    }
    this._dataService.saveOrg(this.editedOrg).subscribe(res => {
      this._toasty.success("Сохранено.");
      this.update();
      this.searchOrgModal.update();
    });
  }

  addOrg() {
    let newOrg = new OrgDto();
    this.orgs.unshift(newOrg);
    this.editOrg(newOrg);
  }

  deleteOrg(orgInd) {
    this.orgs.splice(orgInd, 1);
  }

  showPersonModal() {
    this.searchPersonModal.show();
  }

  showOrgModal() {
    this.searchOrgModal.show();
  }

  selectPerson(person: PersonPlainDto) {
    this.editedOrg.chairman = person;
    this.searchPersonModal.hide();
  }

  selectOrg(org: OrgDto) {
    this.editedOrg.parentOrg = org;
    this.searchOrgModal.hide();
  }

  deleteParentOrg() {
    this.editedOrg.parentOrg = null;
  }

  static copyOrg(org: OrgDto) {
    return Object.assign({}, org);
  }

  showChildOrgs(orgs: OrgDto[]) {
    this.subOrgs = orgs;
    this.showSubOrgModal.show();
  }
}
