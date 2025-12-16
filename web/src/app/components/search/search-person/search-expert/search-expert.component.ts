import {Component, EventEmitter, Output, ViewChild, ChangeDetectorRef} from '@angular/core';
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

  constructor(protected _service: PersonService, private _cdr: ChangeDetectorRef) {
    super();
    this._searchFields = [SearchField.startsWith('personName.lastName').setPlaceholder('Поиск по фамилии...')];
  }

  ngOnInit() {
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
    this._service.searchExperts(this._searchRequest).subscribe(res => {
      this._page = res;
      this.experts = res.content;
      this.setLoading(false);
      this._cdr.detectChanges();
    }, () => {
      this.setLoading(false);
      this._cdr.detectChanges();
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
    this.searchPersonModal.show();
    // Устанавливаем состояние загрузки сразу при открытии модального окна
    this.setLoading(true);
    // Принудительно обновляем view после открытия модального окна
    // Используем requestAnimationFrame для гарантии, что модальное окно отобразилось
    requestAnimationFrame(() => {
      this._cdr.detectChanges();
      // Загружаем данные при открытии модального окна, если они еще не загружены
      // Проверяем через небольшую задержку, чтобы дать enableFilterCache возможность выполниться
      setTimeout(() => {
        if (this._page.totalElements === null || this.experts.length === 0) {
          this.update();
        } else {
          // Если данные уже есть, убираем индикатор загрузки
          this.setLoading(false);
          this._cdr.detectChanges();
        }
      }, 50);
    });
  }

  hide() {
    this.searchPersonModal.hide();
  }
}
