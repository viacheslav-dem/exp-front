import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {PersonService} from "app/services/person.service";
import {ModalComponent} from "app/components/common-components/modal/modal.component";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {isArray} from "util";

@Component({
  selector: 'app-search-person',
  templateUrl: './search-person.component.html'
})
export class SearchPersonComponent extends FilterAndPages<PersonPlainDto> {

  @Output() selected = new EventEmitter<PersonPlainDto>();
  @ViewChild('searchModal', { static: false }) searchPersonModal: ModalComponent;

  constructor(protected _service: PersonService) {
    super();
    this._searchFields = [SearchField.startsWith('personName.lastName')
      .setPlaceholder('Поиск по фамилии...').setSortable(true).setSortDirection(Direction.ASC)];
  }

  ngOnInit() {
  }

  @Input() set searchFields(searchFields: SearchField[]) {
    if (!searchFields) return;
    this._searchFields = searchFields;
  }

  @Input() set filters(filters: Filter<any>[] | Filter<any>) {
    if (!isArray(filters)) {
      filters = [filters];
    }
    this._filters = filters;
    this.onFilterChanged();
  }

  onSelected(user) {
    this.selected.emit(user);
  }

  loadPage() {
    this._service.searchPersons(this._searchRequest).subscribe(res => {
      this._page = res;
      this.setLoading(false);
    }, () => this.setLoading(false));
  }

  show() {
    this.searchPersonModal.show();
  }

  hide() {
    this.searchPersonModal.hide();
  }
}
