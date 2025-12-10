import {Component} from '@angular/core';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {Catalog, DataService} from "app/services/data.service";
import {IndustryDto} from "app/dto/IndustryDto";
import {SearchField} from "app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogTemplate} from "app/components/data-management/catalog/CatalogTemplate";

@Component({
    selector: 'app-industries',
    templateUrl: './industries.component.html',
    standalone: false
})
export class IndustriesComponent extends CatalogTemplate<IndustryDto> {

  create(): IndustryDto {
    return new IndustryDto();
  }

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService) {
    super(_toasty, _dataService);
    this.type = Catalog.INDUSTRY;
  }

  ngOnInit() {
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по описанию...').setSortable(true),
      SearchField.startsWith('code').setPlaceholder('Поиск по коду...')
        .setSortDirection(Direction.ASC).setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
  }
}

