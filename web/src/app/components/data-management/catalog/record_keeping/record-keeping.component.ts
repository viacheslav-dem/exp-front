import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {Catalog, DataService} from "@app/services/data.service";
import {environment} from "../../../../../environments/environment";
import {CatalogTemplate} from "@app/components/data-management/catalog/CatalogTemplate";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {Direction} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {RecordKeepingDto} from "@app/dto/RecordKeepingDto";

@Component({
    selector: 'app-record-keeping',
    templateUrl: './record-keeping.component.html',
    styleUrls: ['./record-keeping.component.scss'],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.catalogsAdmin)
        ? ChangeDetectionStrategy.OnPush
        : ChangeDetectionStrategy.Eager
})
export class RecordKeepingComponent extends CatalogTemplate<RecordKeepingDto> {

    recordKeepingDtos: RecordKeepingDto[] = [];

    constructor(public _toasty: GlobalToastyService,
                public _dataService: DataService,
                private cdr: ChangeDetectorRef) {
        super(_toasty, _dataService);
        this._type = Catalog.RECORD_KEEPING;
    }

    ngOnInit() {
        super.ngOnInit();
        this._dataService.getCatalog(Catalog.RECORD_KEEPING).subscribe(res => {
            this.recordKeepingDtos = <RecordKeepingDto[]>res;
            console.log('---------------------------------')
            console.log(res)
            console.log(this.recordKeepingDtos)

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

    create(): RecordKeepingDto {
        return  new RecordKeepingDto();
    }

}
