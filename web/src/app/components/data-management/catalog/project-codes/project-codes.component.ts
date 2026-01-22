import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GlobalToastyService} from "app/services/global-toasty.service";
import {Catalog, DataService} from "app/services/data.service";
import {IdNameDto} from "app/dto/IdNameDto";
import {ProjectCodeDto} from "app/dto/ProjectCodeDto";
import {SearchField} from "app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "app/components/common-components/page-and-filter/model/SortOrder";
import {CatalogTemplate} from "app/components/data-management/catalog/CatalogTemplate";
import {TariffRateDto} from "@app/dto/TariffRateDto";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-project-codes',
    templateUrl: './project-codes.component.html',
    styleUrls: ['./project-codes.component.scss'],
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ProjectCodesComponent extends CatalogTemplate<ProjectCodeDto> {

  gkntDepartments: IdNameDto[] = [];
  rates:TariffRateDto[] = []

  constructor(public _toasty: GlobalToastyService,
              public _dataService: DataService,
              private cdr: ChangeDetectorRef) {
    super(_toasty, _dataService);
    this._type = Catalog.PROJECT_CODE;
  }

  ngOnInit() {
    super.ngOnInit();
    this._dataService.getCatalog(Catalog.GKNT_DEPARTMENT).subscribe(res => {
      this.gkntDepartments = res;
      this.cdr.markForCheck();
    });
    this._dataService.getCatalog(Catalog.TARIFF).subscribe(res => {
      this.rates = <TariffRateDto[]>res;
      this.cdr.markForCheck();
    });
    this._searchFields = [
      SearchField.contains('name').setPlaceholder('Поиск по описанию...').setSortable(true),
      SearchField.startsWith('code').setPlaceholder('Поиск по коду...')
        .setSortDirection(Direction.ASC).setSortable(true),
      SearchField.checkbox('disabled', 'Показывать неактивные'),
    ];
    // Инициализируем items как пустой массив, чтобы избежать ошибок при первом рендере
    if (!this.items) {
      this.items = [];
    }
    // Загружаем данные после инициализации
    this.update();
  }

  create(): ProjectCodeDto {
    return new ProjectCodeDto();
  }
}

