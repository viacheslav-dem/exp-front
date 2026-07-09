import {ChangeDetectionStrategy, ChangeDetectorRef, Component, viewChild} from '@angular/core';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {Catalog, DataService} from "app/services/data.service";
import {IdNameDto} from "app/dto/IdNameDto";
import {SearchField} from "app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogTemplate} from "app/components/data-management/catalog/CatalogTemplate";
import {GkntDepartmentDto} from "@app/dto/GkntDepartmentDto";
import {SearchPersonComponent} from "@app/components/search/search-person/search-person.component";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {PersonPlainDto} from "@app/dto/PersonPlainDto";
import {FilterBuilder} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import {PersonDto} from "@app/dto/PersonDto";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-gknt-department',
    templateUrl: './gknt-department.component.html',
    styleUrls: ['gknt-department.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Eager
})
export class GkntDepartmentComponent extends CatalogTemplate<GkntDepartmentDto> {

  gknt: IdNameDto;
  searchPersonFilter: Filter<PersonPlainDto>;
  onPersonSelected: Function;

  public readonly searchPersonModal = viewChild(SearchPersonComponent);

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService,
              private cdr: ChangeDetectorRef) {
    super(_toasty, _dataService);
    this._type = Catalog.GKNT_DEPARTMENT;
  }

  ngOnInit() {
    // При возврате функции в ГКНТ, заменить назад на этот метод (какие менять названия смотри в комите "Change specialization to GRNTI" от 13.03.2026)
    // this._dataService.getGknt().subscribe(res => {
    this._dataService.getBelisa().subscribe(res => {
      this.searchPersonFilter = FilterBuilder.equals('org', res);
      this.gknt = res;
      this.cdr.markForCheck();
    });
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по описанию...').setSortDirection(Direction.ASC).setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
  }

  editItem(item: GkntDepartmentDto) {
    super.editItem(item);
    this.selectedItem.isExpanded = true;
    this.cdr.markForCheck();
  }

  showSearchChairmanModal() {
    this.onPersonSelected = person => this.editedItem.chairman = person;
    this.showPersonModal();
  }

  showSearchDeputyChairmanModal() {
    this.onPersonSelected = person => this.editedItem.deputyChairman = person;
    this.showPersonModal();
  }

  showSearchGkntChairmanModal() {
    this.onPersonSelected = person => this.editedItem.gkntChairman = person;
    this.showPersonModal();
  }

  showSearchGkntWorkerModal() {
    this.onPersonSelected = person => {
      if (!this.editedItem.persons.find(existingPerson => existingPerson.id == person.id)) {
        this.editedItem.persons.push(person);
      }
    };
    this.showPersonModal();
  }

  showPersonModal() {
    this.searchPersonModal()?.show();
  }

  selectPerson(person: PersonDto) {
    this.onPersonSelected(person);
    this.searchPersonModal()?.hide();
    this.cdr.markForCheck();
  }

  create(): GkntDepartmentDto {
    return new GkntDepartmentDto();
  }
}

