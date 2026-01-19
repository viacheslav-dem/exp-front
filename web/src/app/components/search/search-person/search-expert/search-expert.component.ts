import {Component, ViewChild, ChangeDetectorRef, output} from '@angular/core';
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
  readonly selected = output<PersonExpertDto>();
  @ViewChild('searchModal', { static: false }) searchPersonModal: ModalComponent;

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
    this._service.searchExperts(this._searchRequest).subscribe({
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
    // Очищаем результаты предыдущего поиска при открытии модального окна
    this.experts = [];
    this._page = new Page();
    this._page.totalElements = null;
    // Поля поиска НЕ очищаем - они сохраняются через кэш фильтров
    // Сбрасываем страницу на первую
    this._pagination.page = 1;
    this._searchRequest.paging.page = 0;
    
    // Помечаем компонент для проверки изменений (важно для OnPush стратегии)
    this._cdr.markForCheck();
    
    this.searchPersonModal.show();
    // Загружаем первую страницу при открытии (убраны ненужные задержки для ускорения)
    this.setLoading(true);
    this.update();
  }

  hide() {
    // Поисковые поля НЕ очищаем - они сохраняются через кэш фильтров
    // Помечаем компонент для проверки изменений
    this._cdr.markForCheck();
    
    this.searchPersonModal.hide();
  }
}
