import {ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, input, output, viewChild} from "@angular/core";
import {PersonService} from "app/services/person.service";
import {ModalComponent} from "app/components/common-components/modal/modal.component";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-person',
    templateUrl: './search-person.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.search) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
})
export class SearchPersonComponent extends FilterAndPages<PersonPlainDto> {

  readonly selected = output<PersonPlainDto>();
  readonly searchPersonModal = viewChild<ModalComponent>('searchModal');

  constructor(protected _service: PersonService, protected cdr: ChangeDetectorRef) {
    super();
    this._searchFields = [SearchField.startsWith('personName.lastName')
      .setPlaceholder('Поиск по фамилии...').setSortable(true).setSortDirection(Direction.ASC)];
  }

  ngOnInit() {
    // Инициализируем _initialLoadDone, чтобы защита в update() не блокировала загрузку данных
    this._initialLoadDone = true;
  }

  readonly searchFields = input<SearchField[]>(undefined);
  readonly filters = input<Filter<any>[] | Filter<any>>(undefined);

  private _lastSearchFieldsRef: SearchField[] | undefined;
  private _lastFiltersRef: Filter<any>[] | Filter<any> | undefined;
  private _filterRefreshScheduled = false;

  private readonly searchFieldsEffect = effect(() => {
    const searchFields = this.searchFields();
    if (!searchFields) return;
    if (Object.is(this._lastSearchFieldsRef, searchFields)) {
      return;
    }
    this._lastSearchFieldsRef = searchFields;
    this._searchFields = searchFields;
  });

  private readonly filtersEffect = effect(() => {
    const inputFilters = this.filters();
    if (Object.is(this._lastFiltersRef, inputFilters)) {
      return;
    }
    this._lastFiltersRef = inputFilters;

    let filters = inputFilters;
    if (!filters) {
      // Явно поддерживаем сброс фильтров (zoneless/OnPush friendly).
      this._filters = [];
      this.scheduleFilterRefresh();
      return;
    }
    if (!Array.isArray(filters)) {
      filters = [filters];
    }
    this._filters = filters;
    this.scheduleFilterRefresh();
  });

  private scheduleFilterRefresh(): void {
    if (this._filterRefreshScheduled) {
      return;
    }
    this._filterRefreshScheduled = true;
    queueMicrotask(() => {
      this._filterRefreshScheduled = false;
      this.onFilterChanged();
    });
  }

  onSelected(user) {
    this.selected.emit(user);
  }

  loadPage() {
    this._service.searchPersons(this._searchRequest).subscribe(res => {
      this._page = res;
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  show() {
    this.searchPersonModal()?.show();
    this.cdr?.markForCheck?.();
  }

  hide() {
    this.searchPersonModal()?.hide();
    this.cdr?.markForCheck?.();
  }
}
