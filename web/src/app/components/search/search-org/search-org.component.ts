import {Component, EventEmitter, Output, ViewChild} from "@angular/core";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {OrgDto} from "@app/dto/OrgDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {DataService} from "@app/services/data.service";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";

@Component({
    selector: 'app-search-org',
    templateUrl: 'search-org.component.html',
    standalone: false
})

export class SearchOrgComponent extends FilterAndPages<OrgDto> {

  @ViewChild('searchOrgModal', { static: false }) searchOrgModal: ModalComponent;
  @Output() selected = new EventEmitter<OrgDto>();

  constructor(protected _service: DataService) {
    super();
    this._searchFields = [SearchField.startsWith('name')
      .setPlaceholder('Поиск по названию').setSortable(true).setSortDirection(Direction.ASC)];
     this._filters = [FilterBuilder.isNull("parentOrg")];
  }

  loadPage() {
    this._service.getOrgsAdminPage(this._searchRequest).subscribe(res => {
      this._page = res;
      this.setLoading(false);
    }, () => this.setLoading(false));
  }

  onSelected(org) {
    this.selected.emit(org);
  }


  show() {
    this.searchOrgModal.show();
  }

  hide() {
    this.searchOrgModal.hide();
  }

}