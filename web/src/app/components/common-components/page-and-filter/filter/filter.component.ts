import {Component, EventEmitter, Input, OnInit, Output, input} from "@angular/core";
import {
  CheckboxField,
  MultiCheck,
  MultiCheckField,
  MultiSelectField,
  SearchField,
  SearchFieldType
} from "app/components/common-components/page-and-filter/model/SearchField";
import {Direction, switchDirection} from "app/components/common-components/page-and-filter/model/SortOrder";
import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {DataService} from "@app/services/data.service";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    standalone: false
})
export class FilterComponent implements OnInit {

  SearchFieldType = SearchFieldType;
  searcherTimer: any;
  _fields: SearchField[] = [];
  readonly fieldClass = input<string>('');
  readonly filterClass = input<string>('');
  @Output() onFilterChanged = new EventEmitter<Filter<any>[]>();

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
  }

  @Input() set fields(fields: SearchField[]) {
    if (!fields) {
      return;
    }
    this._fields = fields;
    this._fields.forEach(field => {
      if ((field.type == SearchFieldType.MULTI_SELECT) && field.catalog != null)
        this.dataService.getCatalog(field.catalog).subscribe(items => (<MultiSelectField>field).setItems(items));
    });
  }

  filterChanged() {
    this.onFilterChanged.emit(this._fields);
  }

  changeSearchText($event: any, field: SearchField) {
    field.value = $event.srcElement.value;
    clearTimeout(this.searcherTimer);
    this.searcherTimer = setTimeout(() => this.filterChanged(), 6000);
  }

  changePeriod($event, field: SearchField, type: 'start' | 'end') {
    field.value[type] = Number.parseInt($event.srcElement.value);
    clearTimeout(this.searcherTimer);
    this.searcherTimer = setTimeout(() => this.filterChanged(), 6000);
  }

  changeMultiCheck(field: MultiCheckField, multiCheck: MultiCheck) {
    field.check(multiCheck);
    this.filterChanged();
  }

  changeCheckbox(field: CheckboxField) {
    field.checked = !field.checked;
    this.filterChanged();
  }

  changeMultiSelect(field: MultiSelectField) {
    field.selectChanged();
    this.filterChanged();
  }

  sortBy(field: SearchField) {
    field.sortDirection = switchDirection(field.sortDirection);
    this._fields.forEach(f => {
      if (field != f && !f.multipleSorting) {
        f.sortDirection = null;
      }
    });
    this.filterChanged();
  }

  reset(field: SearchField) {
    field.reset();
    this.filterChanged();
  }

  sortIconClass(field: SearchField) {
    return field.sortDirection == Direction.ASC ? 'sort-amount-up' :
      field.sortDirection == Direction.DESC ? 'sort-amount-down' : 'sort';
  }
}
