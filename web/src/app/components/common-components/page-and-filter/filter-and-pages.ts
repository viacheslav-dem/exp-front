import { Directive, OnInit, signal } from "@angular/core";
import {SearchField, SearchFieldType, MultiSelectField} from "app/components/common-components/page-and-filter/model/SearchField";
import {Page} from "app/components/common-components/page-and-filter/model/Page";
import {Filter} from "app/components/common-components/page-and-filter/model/Filter";
import {SearchPageRequest} from "app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Pagination} from "app/components/common-components/page-and-filter/model/Pagination";
import {SortOrder} from "app/components/common-components/page-and-filter/model/SortOrder";
import {FilterBuilder} from "app/components/common-components/page-and-filter/model/FilterBuilder";
import {PageRequest} from "@app/components/common-components/page-and-filter/model/PageRequest";

@Directive()
export abstract class FilterAndPages<T> implements OnInit {

  /**
   * Важно для zoneless/OnPush:
   * - поля `_page/_pagination/_loading/_searchFields/...` используются во множестве шаблонов как обычные свойства.
   * - чтобы НЕ переписывать все шаблоны разом и при этом получить реактивность сигналов,
   *   оставляем публичные имена как getter/setter, а состояние переносим в signals.
   *
   * Ограничение (постепенная миграция):
   * - прямые мутации вложенных свойств (например, `this._page.totalElements = ...`) НЕ триггерят сигнал.
   *   В таких местах нужно переходить на иммутабельные присваивания: `this._page = {...}`.
   */
  private readonly _pageSignal = signal<Page<T>>(new Page<T>());
  private readonly _paginationSignal = signal<Pagination>(new Pagination());
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _searchFieldsSignal = signal<SearchField[]>([]);
  private readonly _filtersSignal = signal<Filter<any>[]>([]);
  private readonly _sortOrdersSignal = signal<SortOrder[]>([]);

  _searchRequest: SearchPageRequest;

  protected _filterCachePageName: string | null = null;
  protected _initialLoadDone: boolean = false;

  // Back-compat API (шаблоны/наследники): поля остаются с теми же именами.
  get _page(): Page<T> {
    return this._pageSignal();
  }
  set _page(value: Page<T>) {
    this._pageSignal.set(value ?? new Page<T>());
  }

  get _pagination(): Pagination {
    return this._paginationSignal();
  }
  set _pagination(value: Pagination) {
    this._paginationSignal.set(value ?? new Pagination());
  }

  get _loading(): boolean {
    return this._loadingSignal();
  }
  set _loading(value: boolean) {
    this._loadingSignal.set(!!value);
  }

  get _searchFields(): SearchField[] {
    return this._searchFieldsSignal();
  }
  set _searchFields(value: SearchField[]) {
    this._searchFieldsSignal.set(value ?? []);
  }

  get _filters(): Filter<any>[] {
    return this._filtersSignal();
  }
  set _filters(value: Filter<any>[]) {
    this._filtersSignal.set(value ?? []);
  }

  get _sortOrders(): SortOrder[] {
    return this._sortOrdersSignal();
  }
  set _sortOrders(value: SortOrder[]) {
    this._sortOrdersSignal.set(value ?? []);
  }

  constructor(itemsPerPage?: number) {
    const pagination = new Pagination(itemsPerPage ? itemsPerPage : 10);
    this._paginationSignal.set(pagination);
    this._searchRequest = new SearchPageRequest(pagination);
  }

  ngOnInit() {
  }

  enableFilterCache(pageName: string) {
    this._filterCachePageName = pageName;
    
    // Загружаем состояние только один раз при инициализации
    setTimeout(() => {
      const hadSavedState = this.loadFilterState(pageName);
      if (hadSavedState) {
        this._initialLoadDone = true;
        // Создаем новый массив полей для immutable обновления
        // Это триггерит input() fields в FilterComponent, который обновит сигнал
        this._searchFields = [...this._searchFields];
        // Вызываем update() после загрузки значений из кэша
        setTimeout(() => this.update(), 0);
      } else {
        // Если кэша нет, помечаем что начальная загрузка завершена
        // чтобы разрешить обычную загрузку данных без фильтров
        this._initialLoadDone = true;
        // Если кэша нет и update() ещё не вызывался — вызываем его
        // Это нужно для случаев, когда queryParams подписка вызвала update() до нас,
        // но он был пропущен из-за hasCachedFilters проверки
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
              // Для MultiSelectField нужно обновить selectedItems на основе value
              if (field.type === SearchFieldType.MULTI_SELECT && Array.isArray(deserializedValue)) {
                const multiSelectField = field as MultiSelectField;
                // Обновляем selectedItems только если allItems уже загружены
                // Если каталог еще не загружен, selectedItems будет обновлен после загрузки каталога
                if (multiSelectField.allItems && multiSelectField.allItems.length > 0) {
                  // Используем setSelectedValues для единообразного поведения со всеми multiSelect фильтрами
                  // Это пересчитает value на основе найденных элементов и отфильтрует несуществующие
                  multiSelectField.setSelectedValues(deserializedValue);
                }
              }
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
    // ВРЕМЕННАЯ ОТЛАДКА: раскомментируйте для проверки
    // console.log('getFilters - all fields:', this._searchFields.map(f => ({ key: f.key, value: f.value, type: f.type, isEmpty: f.isEmpty() })));
    // console.log('getFilters - active fields:', activeFields.map(f => ({ key: f.key, value: f.value, isEmpty: f.isEmpty() })));
    const filters = this._filters.concat(activeFields.map(searchField => searchField.getFilter()));
    return filters;
  }

  // for filter
  onFilterChanged() {
    this.setPage(0);
    // Сбрасываем страницу, чтобы не показывать "не найдено" до загрузки
    this._page = Object.assign(new Page<T>(), this._page, { totalElements: null });
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
    const prev = this._pagination;
    const next = new Pagination(prev?.itemsPerPage);
    next.page = page + 1;
    this._pagination = next;
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
    // ЗАЩИТА: не вызываем update() до загрузки кэша, если есть кэш
    // Проверяем все возможные имена кэша, так как _filterCachePageName может быть еще не установлен
    // Это предотвращает вызов update() без фильтров до загрузки кэша
    if (!this._initialLoadDone) {
      let hasCachedFilters = false;
      
      if (this._filterCachePageName) {
        hasCachedFilters = !!localStorage.getItem(`filter_cache_${this._filterCachePageName}`);
      } else {
        // Если _filterCachePageName еще не установлен, проверяем все возможные кэши
        const possibleCacheNames = ['notification', 'users', 'project-list', 'search-expert'];
        for (const name of possibleCacheNames) {
          if (localStorage.getItem(`filter_cache_${name}`)) {
            hasCachedFilters = true;
            break;
          }
        }
      }
      
      if (hasCachedFilters) {
        return;
      }
    }
    
    this.prepareRequest();
    // В zoneless/OnPush мы полагаемся на signals.
    // Ставим loading в микротаске, чтобы избежать ExpressionChangedAfterItHasBeenCheckedError в dev режиме.
    Promise.resolve().then(() => this.setLoading(true));
    this.loadPage();
  }

  protected shouldSkipLoadPage(): boolean {
    // ЗАЩИТА: не загружаем данные до загрузки кэша, если есть кэш
    // Это предотвращает загрузку данных без фильтров до загрузки кэша
    if (this._filterCachePageName && !this._initialLoadDone) {
      const hasCachedFilters = localStorage.getItem(`filter_cache_${this._filterCachePageName}`);
      return !!hasCachedFilters;
    }
    return false;
  }

  protected abstract loadPage();
}
