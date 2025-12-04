import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {PersonService} from "@app/services/person.service";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {
  Direction,
  sortByName,
  SortClass,
  switchDirection
} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {PersonExpertDto} from "@app/dto/PersonExpertDto";

@Component({
    selector: 'app-search-expert',
    templateUrl: 'search-expert.component.html',
    standalone: false
})
export class SearchExpertComponent extends FilterAndPages<PersonExpertDto> {

  SortClass = SortClass;
  experts: PersonExpertDto[] = [];
  sortDirection = Direction.ASC;
  @Output() selected = new EventEmitter<PersonExpertDto>();
  @ViewChild('searchModal', { static: false }) searchPersonModal: ModalComponent;

  constructor(protected _service: PersonService) {
    super();
    this._searchFields = [SearchField.startsWith('personName.lastName').setPlaceholder('Поиск по фамилии...')];
  }

  ngOnInit() {
    this.enableFilterCache("search-expert");
  }

  onSelected(user) {
    this.selected.emit(user);
  }

  loadPage() {
    this._service.searchExperts(this._searchRequest).subscribe(res => {
      this._page = res;
      this.experts = res.content;
      this.setLoading(false);
    }, () => this.setLoading(false));
  }

  getSortOrders() {
    return sortByName('personName.', this.sortDirection);
  }

  changeSort() {
    this.sortDirection = switchDirection(this.sortDirection, false);
    this.update();
  }

  show() {
    this.searchPersonModal.show();
  }

  hide() {
    this.searchPersonModal.hide();
  }
}
