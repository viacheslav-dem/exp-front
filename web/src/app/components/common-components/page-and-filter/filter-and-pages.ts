import { OnInit, Directive } from "@angular/core";
import {SearchField, SearchFieldType} from "app/components/common-components/page-and-filter/model/SearchField";
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {SearchPageRequest} from "app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {SortOrder} from "app/components/common-components/page-and-filter/model/SortOrder";
import {FilterBuilder} from "app/components/common-components/page-and-filter/model/FilterBuilder";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Directive()
export abstract class FilterAndPages<T> implements OnInit {

  _page: Page<T> = new Page();
  _pagination: Pagination;
  _searchRequest: SearchPageRequest;
  _loading: boolean = false;

  private _filterCachePageName: string | null = null;
  private _initialLoadDone: boolean = false;

  _searchFields: SearchField[] = [];
  _filters: Filter<any>[] = [];
  _sortOrders: SortOrder[] = [];

  constructor(itemsPerPage?: number) {
    this._pagination = new Pagination(itemsPerPage ? itemsPerPage : 10);
    this._searchRequest = new SearchPageRequest(this._pagination);
  }

  ngOnInit() {
  }

  enableFilterCache(pageName: string) {
    this._filterCachePageName = pageName;
    // Загружаем состояние только один раз при инициализации
    // После этого загрузка состояния не будет происходить автоматически
    setTimeout(() => {
      const hadSavedState = this.loadFilterState(pageName);
      // Если было сохраненное состояние, обновляем данные
      if (hadSavedState) {
        this._initialLoadDone = true;
        this.update();
      }
    }, 50);
  }

  private saveFilterState(pageName: string) {
    try {
      const filterState: any = {};
      this._searchFields.forEach(field => {
        if (field.key) {
          // Сохраняем только непустые значения
          // Для текстовых полей проверяем, что значение не пустая строка
          const isEmpty = field.isEmpty();
          if (!isEmpty) {
            filterState[field.key] = {
              value: this.serializeValue(field.value),
              sortDirection: field.sortDirection,
              sortProperty: field.sortProperty
            };
          } else {
            // Если поле стало пустым, удаляем его из кэша
            const existingState = localStorage.getItem(`filter_cache_${pageName}`);
            if (existingState) {
              const existingFilterState = JSON.parse(existingState);
              if (existingFilterState[field.key]) {
                delete existingFilterState[field.key];
                localStorage.setItem(`filter_cache_${pageName}`, JSON.stringify(existingFilterState));
              }
            }
          }
        }
      });
      // Сохраняем только если есть хотя бы одно непустое поле
      if (Object.keys(filterState).length > 0) {
        localStorage.setItem(`filter_cache_${pageName}`, JSON.stringify(filterState));
      } else {
        // Если все поля пустые, очищаем кэш
        localStorage.removeItem(`filter_cache_${pageName}`);
      }
    } catch (e) {
      console.warn('Failed to save filter state:', e);
    }
  }

  private loadFilterState(pageName: string): boolean {
    try {
      const savedState = localStorage.getItem(`filter_cache_${pageName}`);
      if (savedState) {
        const filterState = JSON.parse(savedState);
        let hasState = false;
        this._searchFields.forEach(field => {
          if (field.key && filterState[field.key]) {
            const saved = filterState[field.key];
            let deserializedValue = this.deserializeValue(saved.value, field);
            // Проверяем, что значение не пустое после десериализации
            // Для массивов проверяем, что массив не пустой
            let isValidValue = false;
            if (deserializedValue !== null && deserializedValue !== undefined) {
              if (typeof deserializedValue === 'string') {
                isValidValue = deserializedValue.trim().length > 0;
              } else if (Array.isArray(deserializedValue)) {
                // Проверяем, что массив не пустой и содержит валидные значения
                // Фильтруем null/undefined и пустые строки
                const validItems = deserializedValue.filter(item => 
                  item !== null && 
                  item !== undefined && 
                  !(typeof item === 'string' && item.trim().length === 0)
                );
                isValidValue = validItems.length > 0;
                // Если есть валидные элементы, используем их вместо исходного массива
                if (isValidValue && validItems.length !== deserializedValue.length) {
                  deserializedValue = validItems;
                }
              } else {
                isValidValue = true; // Для объектов и других типов
              }
            }
            if (isValidValue) {
              field.value = deserializedValue;
              if (saved.sortDirection) {
                field.sortDirection = saved.sortDirection;
              }
              if (saved.sortProperty) {
                field.sortProperty = saved.sortProperty;
              }
              hasState = true;
            }
          }
        });
        return hasState;
      }
      return false;
    } catch (e) {
      console.warn('Failed to load filter state:', e);
      return false;
    }
  }

  private serializeValue(value: any): any {
    // Для массивов и объектов используем JSON
    if (value && typeof value === 'object') {
      return JSON.parse(JSON.stringify(value));
    }
    return value;
  }

  private deserializeValue(value: any, field: SearchField): any {
    // Если значение - объект, пытаемся восстановить его структуру
    if (value && typeof value === 'object') {
      // Для DateRange и других специальных типов может потребоваться восстановление
      if (field.type === SearchFieldType.DATE_PERIOD && value.start !== undefined) {
        return { start: value.start, end: value.end };
      }
      return value;
    }
    return value;
  }

  setLoading(loading: boolean) {
    this._loading = loading;
  }

  protected getFilters(): Filter<any>[] {
    const activeFields = this._searchFields.filter(searchField => !searchField.isEmpty());
    const filters = this._filters.concat(activeFields.map(searchField => searchField.getFilter()));
    return filters;
  }

  // for filter
  onFilterChanged() {
    this.setPage(0);
    // Сбрасываем страницу, чтобы не показывать "не найдено" до загрузки
    this._page.totalElements = null;
    // Сохраняем состояние перед обновлением, чтобы актуальные значения были сохранены
    if (this._filterCachePageName) {
      this.saveFilterState(this._filterCachePageName);
    }
    this.update();
  }

  protected getSortOrders(): SortOrder[] {
    return this._searchFields.map(field => field.sortOrder).filter(order => order).concat(this._sortOrders);
  }

  getSearchField(key: string): any {
    return this._searchFields.find(field => field.key == key);
  }

  private setPage(page: number) {
    // for request
    this._searchRequest.paging.page = page;
    // for pagination component
    this._pagination.page = page + 1;
  }

  // for pagination component
  onPageChanged(pageRequest: PageRequest) {
    this.setPage(pageRequest.page);
    this.update();
  }

  protected prepareRequest() {
    this._searchRequest.paging.orders = this.getSortOrders();
    const filters = this.getFilters();
    this._searchRequest.filter = FilterBuilder.and('', filters);
  }

  update() {
    this.prepareRequest();
    // Откладываем изменение состояния загрузки на следующий тик,
    // чтобы избежать ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.setLoading(true);
    }, 0);
    this.loadPage();
  }

  protected abstract loadPage();
}
