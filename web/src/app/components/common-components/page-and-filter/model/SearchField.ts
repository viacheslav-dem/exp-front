import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {Operation} from "app/components/common-components/page-and-filter/model/FilterBuilder";
import {DateRange, DoubleRange, Range} from "@app/components/common-components/page-and-filter/model/Range";
import {SortOrder} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {Catalog} from "@app/services/data.service";

export enum SearchFieldType {
  TEXT,
  PERIOD,
  NUMBER_RANGE,
  DATE_PERIOD,
  CHECKBOX,
  MULTI_CHECK,
  MULTI_SELECT,
}

export class SearchField {

  type: SearchFieldType = SearchFieldType.TEXT;
  key: string;
  value: any;
  operation: string;
  title: string;
  sortable: boolean = false;
  sortDirection: string;
  sortProperty: string;
  multipleSorting: boolean = false;
  placeholder: string;
  resetEnabled: boolean = true;
  catalog: Catalog = null;

  constructor(key: string, operation: string) {
    this.value = null;
    this.key = this.sortProperty = key;
    this.operation = operation;
  }

  getFilter() {
    return new Filter(this.key, this.value, this.operation);
  }

  setTitle(title: string): SearchField {
    this.title = title;
    return this;
  }

  setCatalog(catalog: Catalog): SearchField {
    this.catalog = catalog;
    return this;
  }

  setPlaceholder(placeholder: string): SearchField {
    this.placeholder = placeholder;
    return this;
  }

  setSortable(sortable: boolean = false): SearchField {
    this.sortable = sortable;
    return this;
  }

  setSortDirection(direction: string): SearchField {
    this.sortDirection = direction;
    return this;
  }

  setSortProperty(sortProperty: string = this.key) {
    this.sortProperty = sortProperty;
    return this;
  }

  setResetEnabled(resetEnabled: boolean = true): SearchField {
    this.resetEnabled = resetEnabled;
    return this;
  }

  setMultipleSorting(multipleSorting: boolean = false) {
    this.multipleSorting = multipleSorting;
    return this;
  }

  get sortOrder(): SortOrder {
    if (this.sortDirection) {
      return new SortOrder(this.sortProperty, this.sortDirection);
    }
    return null;
  }

  reset() {
    this.value = null;
  }

  isEmpty() {
    return !this.value;
  }

  public static startsWith(key: string): SearchField {
    return new SearchField(key, Operation.STARTS_WITH);
  }

  public static endsWith(key: string): SearchField {
    return new SearchField(key, Operation.ENDS_WITH);
  }

  public static contains(key: string): SearchField {
    return new SearchField(key, Operation.CONTAINS);
  }

  public static equals(key: string): SearchField {
    return new SearchField(key, Operation.EQUALS);
  }

  public static multiCheck(key: string, items: any[], itemToString?: Function): MultiCheckField {
    return new MultiCheckField(key, items, itemToString);
  }

  public static datePeriod(key: string): PeriodField<number> {
    let field = new PeriodField<number>(key, Operation.RANGE, new DateRange());
    field.type = SearchFieldType.DATE_PERIOD;
    return field;
  }

  public static numberRange(key: string): NumberRangeField {
    return new NumberRangeField(key);
  }

  public static checkbox(key: string, label: string, checkedValue: any = null, uncheckedValue: any = false): CheckboxField {
    return new CheckboxField(key, label, checkedValue, uncheckedValue);
  }

  public static multiSelect(key: string, source: any[] | Catalog, itemToString?: Function, valueExtractor?: Function): MultiSelectField {
    return new MultiSelectField(key, source, itemToString, valueExtractor);
  }
}

export class PeriodField<T> extends SearchField {

  constructor(key: string, operation: string, private period: Range<T>) {
    super(key, operation);
    this.value = period;
    this.type = SearchFieldType.PERIOD;
  }

  reset() {
    this.value = new Range<T>(null, null, this.period.type);
  }

  isEmpty() {
    return !this.value.start && !this.value.end;
  }
}

export class DatePeriodField extends PeriodField<number> {

  // can be not equal value.start and value.end
  _dateFrom;
  _dateTo;

  constructor(key: string) {
    super(key, Operation.RANGE, new DateRange());
    this.type = SearchFieldType.DATE_PERIOD;
  }

  reset() {
    super.reset();
    this._dateFrom = null;
    this._dateTo = null;
  }
}

export class NumberRangeField extends PeriodField<any> {

  placeholderFrom: string;
  placeholderTo: string;

  constructor(key: string) {
    super(key, Operation.RANGE, new DoubleRange());
    this.type = SearchFieldType.NUMBER_RANGE;
  }

  setPlaceholderFrom(placeholderFrom: string) {
    this.placeholderFrom = placeholderFrom;
    return this;
  }

  setPlaceholderTo(placeholderTo: string) {
    this.placeholderTo = placeholderTo;
    return this;
  }
}

export class MultiCheckField extends SearchField {

  multiCheck: MultiCheck[];
  singleSelection: boolean;

  constructor(key: string, items: any[], itemToString?: Function) {
    super(key, Operation.IN);
    this.multiCheck = items.map(item => new MultiCheck(item, itemToString));
    this.type = SearchFieldType.MULTI_CHECK;
  }

  setSingleSelection(singleSelection: boolean = false) {
    this.singleSelection = singleSelection;
    return this;
  }

  check(check: MultiCheck) {
    let selected = !check.selected;
    if (this.singleSelection) {
      this.multiCheck.forEach(check => check.selected = false);
      check.selected = selected;
      this.value = selected ? [check.item] : null;
    } else {
      check.selected = selected;
      this.value = this.multiCheck.filter(check => check.selected).map(check => check.item);
    }
  }

  reset() {
    super.reset();
    this.multiCheck.forEach(check => check.selected = false);
  }

  isEmpty() {
    return !this.value || this.value.length == 0;
  }
}

export class MultiCheck {

  item: any;
  selected: boolean;
  private itemToString: Function;

  constructor(item: any, itemToString?: Function) {
    this.item = item;
    this.itemToString = itemToString;
  }

  getItemAsString() {
    if (this.itemToString) {
      return this.itemToString(this.item);
    }
    if (this.item != null && this.item.name) {
      return this.item.name;
    }
    return this.item;
  }
}

export class MultiSelectField extends SearchField {

  allItems: SelectItem[];
  selectedItems: SelectItem[] = [];
  settings: any = {
    text: "Выбрать",
    enableCheckAll: false,
    classes: 'select',
    selectAllText: "Выбрать все",
    unSelectAllText: "Снять все",
    searchPlaceholderText: "Поиск...",
    badgeShowLimit: 5,
  };
  itemToString: Function;
  extractValue: Function;

  constructor(key: string, source: any[] | Catalog, itemToString?: Function, valueExtractor?: Function) {
    super(key, Operation.IN);
    this.itemToString = itemToString;
    this.resetEnabled = false;
    this.extractValue = valueExtractor;
    this.setItems([]);
    if (source instanceof Array)
      this.setItems(source);
    else
      this.setCatalog(source);
    this.type = SearchFieldType.MULTI_SELECT;
  }

  setItems(items: any[]) {
    this.allItems = items.map((item, ind) => new SelectItem(this.getExtractedValue(item), this.getItemAsString(item), ind));
    return this;
  }

  setClasses(classes: string) {
    this.settings.classes += ' ' + classes;
    return this;
  }

  setSelectText(text: string = 'Выбрать') {
    this.settings.text = text;
    return this;
  }

  setBadgeShowLimit(badgeShowLimit: number) {
    this.settings.badgeShowLimit = badgeShowLimit;
    return this;
  }

  setSearchFilterEnabled(enableSearchFilter: boolean = false) {
    this.settings.enableSearchFilter = enableSearchFilter;
    return this;
  }

  setCheckAllEnabled(enableCheckAll: boolean = false) {
    this.settings.enableCheckAll = enableCheckAll;
    return this;
  }

  setSettings(settings: any) {
    Object.assign(this.settings, settings);
    return this;
  }

  setSingleSelection(singleSelection: boolean = false) {
    this.settings.singleSelection = singleSelection;
    return this;
  }

  getExtractedValue(value) {
    if (this.extractValue) {
      return this.extractValue(value);
    } else {
      return value;
    }
  }

  selectChanged() {
    let result = [];
    this.selectedItems.forEach(selectItem => {
      if (!Array.isArray(selectItem.value)) {
        return result.push(selectItem.value);
      } else {
        result = result.concat(selectItem.value);
      }
    });
    this.value = result;
  }

  reset() {
    this.setSelectedValues([]);
  }

  setSelectedValues(values: any[] = []) {
    this.selectedItems = values.map(value => this.allItems.find(item => item.value == value));
    this.selectChanged();
  }

  isEmpty() {
    return !this.value || this.value.length == 0;
  }

  getItemAsString(item: any) {
    if (this.itemToString) {
      return this.itemToString(item);
    }
    if (item != null && item.name != null) {
      return item.name;
    }
    return item;
  }
}

export class SelectItem  {
  id: number;
  value: any;
  itemName: string;
  constructor(value: any, name: string, id: number) {
    this.id = id;
    this.value = value;
    this.itemName = name;
  }
}

export class CheckboxField extends SearchField {

  // the value of the field that have to be searched if a checkbox is checked;
  checkedValue: any;

  // the value of the field that have to be searched if a checkbox is not checked;
  uncheckedValue: any;

  // true if a checkbox is checked
  private _checked: boolean;

  label: string;

  constructor(key: string, label: string, checkedValue: any = null, uncheckedValue: any = false) {
    super(key, Operation.EQUALS);
    this.checkedValue = checkedValue;
    this.uncheckedValue = uncheckedValue;
    this.value = uncheckedValue;
    this.label = label;
    this.resetEnabled = false;
    this.type = SearchFieldType.CHECKBOX;
  }

  set checked(checked: boolean) {
    this._checked = checked;
    if (checked) {
      this.value = this.checkedValue;
    } else {
      this.value = this.uncheckedValue;
    }
  }

  get checked() {
    return this._checked;
  }

  setOperation(operation: string) {
    this.operation = operation;
    return this;
  }

  isEmpty() {
    return this.value == null;
  }

  reset() {
    this.checked = false;
  }
}
