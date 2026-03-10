import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Catalog, DataService} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {ProjectCodeDto} from "@app/dto/ProjectCodeDto";
import {IdNameDto} from "@app/dto/IdNameDto";
import {TariffRateDto} from "@app/dto/TariffRateDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {SpecializationDto} from "@app/dto/SpecializationDto";

@Component({
    selector: 'app-specialization',
    templateUrl: './specialization.component.html',
    styleUrls: ['./specialization.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
        ? ChangeDetectionStrategy.OnPush
        : ChangeDetectionStrategy.Default
})
export class SpecializationComponent extends CatalogTemplate<SpecializationDto> {

    specializations: SpecializationDto[] = [];

    constructor(public _toasty: GlobalToastyService,
                public _dataService: DataService,
                private cdr: ChangeDetectorRef) {
        super(_toasty, _dataService);
        this._type = Catalog.SPECIALIZATION;
    }

    ngOnInit() {
        super.ngOnInit();
        this._dataService.getCatalog(Catalog.SPECIALIZATION).subscribe(res => {
            this.specializations = <SpecializationDto[]>res;
            console.log('---------------------------------')
            console.log(res)
            console.log(this.specializations)

            console.log('---------------------------------')
            this.cdr.markForCheck();
        });
        this._searchFields = [
            SearchField.contains('name').setPlaceholder('Поиск по названию...').setSortable(true),
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

    create(): SpecializationDto {
        return new SpecializationDto();
    }

}
