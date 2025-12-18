import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {AuditService} from "@app/services/audit.service";
import {AuditTypePipe, getAllAuditTypes} from "@app/pipes/audit-type.pipe";
import {
  Direction,
  sortByName,
  SortClass,
  SortOrder,
  switchDirection
} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {AuditRecordDto} from "@app/dto/AuditRecordDto";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    styles: [`
      table {
          font-size: 0.875rem;
          background-color: white;
          margin-bottom: 0;
      }

      thead th {
          padding: 1rem 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.75rem;
          border-bottom: 2px solid #dee2e6;
      }

      tbody td {
          padding: 1rem 0.75rem;
          vertical-align: middle;
          border-bottom: 1px solid #f0f0f0;
      }

      .audit-table-row {
          transition: all 0.2s ease;
      }

      .audit-table-row:hover {
          background-color: #f8f9fa !important;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .cursor-pointer {
          cursor: pointer;
      }

      .cursor-pointer:hover {
          color: #0d6efd !important;
      }
  `],
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default
})
export class AuditComponent extends FilterAndPages<AuditRecordDto> {

  SortClass = SortClass;

  audit: AuditRecordDto[] = [];
  sort: SortOrder = new SortOrder('date', Direction.DESC);
  allTypes: string[] = getAllAuditTypes();

  constructor(private _service: AuditService,
              private _auditTypePipe: AuditTypePipe,
              private cdr: ChangeDetectorRef) {
    super(15);
  }

  ngOnInit(): void {
    this._searchFields = [
      SearchField.startsWith('person.personName.lastName').setTitle('Пользователь').setPlaceholder('Поиск по фамилии...'),
      SearchField.datePeriod('date').setTitle('Период времени').setPlaceholder('Выбрать период...'),
      SearchField.multiSelect('type', this.allTypes, value => this._auditTypePipe.transform(value))
        .setSelectText('Выбрать тип').setCheckAllEnabled(true).setTitle('Тип записи'),
    ];
    this.enableFilterCache("audit");
    // Если нет сохранённого состояния фильтров, загружаем данные явно
    setTimeout(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_audit');
      if (!hasCachedFilters) {
        this.update();
      }
    }, 100);
  }

  loadPage() {
    this._service.getAuditRecords(this._searchRequest).subscribe(res => {
      this._page = res;
      this.audit = res.content;
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    }, () => {
      this.setLoading(false);
      this.cdr?.markForCheck?.();
    });
  }

  sortBy(property: string) {
    if (property == this.sort.property) {
      this.sort.direction = switchDirection(this.sort.direction, false);
    } else {
      this.sort.direction = Direction.ASC;
    }
    this.sort.property = property;
    this.update();
  }

  getSortOrders() {
    if (this.sort.property == 'person') {
      return sortByName('person.personName.', this.sort.direction);
    } else {
      return [this.sort];
    }
  }
}
