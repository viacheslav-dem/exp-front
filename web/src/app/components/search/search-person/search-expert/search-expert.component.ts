import {Component, ChangeDetectorRef, output, viewChild, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
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
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {Pagination} from "@app/components/common-components/page-and-filter/model/Pagination";
import {PersonExpertDto} from "@app/dto/PersonExpertDto";

@Component({
    selector: 'app-search-expert',
    templateUrl: 'search-expert.component.html',
    standalone: false
})
export class SearchExpertComponent extends FilterAndPages<PersonExpertDto> implements OnDestroy {

  SortClass = SortClass;
  experts: PersonExpertDto[] = [];
  sortDirection = Direction.ASC;
  readonly selected = output<PersonExpertDto>();
  readonly searchPersonModal = viewChild<ModalComponent>('searchModal');

  private _isModalVisible = false;
  private _searchSub?: Subscription;

  constructor(protected _service: PersonService, private _cdr: ChangeDetectorRef) {
    super();
    this._searchFields = [SearchField.startsWith('personName.lastName').setPlaceholder('Поиск по фамилии...')];
  }

  ngOnInit() {
    // Используем кэш фильтров для сохранения поисковой строки при повторном открытии
    this.enableFilterCache("search-expert");
  }

  override setLoading(loading: boolean) {
    super.setLoading(loading);
    // Принудительно обновляем view при изменении состояния загрузки
    this._cdr.detectChanges();
  }

  onSelected(user) {
    this.selected.emit(user);
  }

  loadPage() {
    // Не загружаем данные, пока модалка не открыта (enableFilterCache вызывает update() при ngOnInit)
    if (!this._isModalVisible) {
      this.setLoading(false);
      return;
    }
    // Отменяем предыдущий запрос — предотвращает race condition,
    // когда ответ на устаревший запрос перезаписывает актуальные результаты
    this._searchSub?.unsubscribe();
    this._searchSub = this._service.searchExperts(this._searchRequest).subscribe({
      next: (res) => {
        this._page = res;
        this.experts = res.content;
        this.setLoading(false);
        this._cdr.detectChanges();
      },
      error: () => {
        this.setLoading(false);
        this._cdr.detectChanges();
      }
    });
  }

  getSortOrders() {
    return sortByName('personName.', this.sortDirection);
  }

  changeSort() {
    this.sortDirection = switchDirection(this.sortDirection, false);
    this.update();
  }

  show() {
    this._isModalVisible = true;
    // Гарантируем, что update() не заблокируется из-за незавершённого enableFilterCache
    this._initialLoadDone = true;
    // Очищаем результаты предыдущего поиска при открытии модального окна
    this.experts = [];
    // Zoneless/Signals: иммутабельное обновление _page
    this._page = Object.assign(new Page<PersonExpertDto>(), { totalElements: null });
    // Поля поиска НЕ очищаем - они сохраняются через кэш фильтров
    // Сбрасываем страницу на первую
    const nextPagination = new Pagination(this._pagination?.itemsPerPage);
    nextPagination.page = 1;
    this._pagination = nextPagination;
    this._searchRequest.paging.page = 0;

    // Помечаем компонент для проверки изменений (важно для OnPush стратегии)
    this._cdr.markForCheck();

    this.searchPersonModal()?.show();
    // Загружаем первую страницу при открытии
    this.setLoading(true);
    this.update();
  }

  hide() {
    this._isModalVisible = false;
    // Поисковые поля НЕ очищаем - они сохраняются через кэш фильтров
    // Помечаем компонент для проверки изменений
    this._cdr.markForCheck();

    this.searchPersonModal()?.hide();
  }

  ngOnDestroy() {
    this._searchSub?.unsubscribe();
  }
}
