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
          font-size: 0.9375rem;
          background-color: white;
          margin-bottom: 0;
          table-layout: fixed;
          width: 100%;
      }

      /* Bootstrap CSS-переменные для белого фона таблицы */
      table.table {
          --bs-table-bg: #ffffff;
          --bs-table-hover-bg: rgba(0, 0, 0, 0.03);
      }

      /* Ширины колонок */
      thead th:nth-child(1) { width: 15%; }  /* Дата */
      thead th:nth-child(2) { width: 25%; }  /* Пользователь */
      thead th:nth-child(3) { width: 15%; }  /* Тип */
      thead th:nth-child(4) { width: 45%; }  /* Сообщение */

      thead th {
          padding: 1rem 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.8125rem;
          border-bottom: 2px solid #dee2e6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
      }

      tbody td {
          padding: 1rem 0.75rem;
          vertical-align: middle;
          border-bottom: 1px solid #f0f0f0;
      }

      .audit-table-row {
          transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
      }

      .audit-table-row:hover {
          background-color: #e9ecef;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .audit-table-row:hover > td {
          background-color: #f8f9fa !important;
      }

      .cursor-pointer {
          cursor: pointer;
      }

      .cursor-pointer:hover {
          color: #0d6efd !important;
      }

      .badge {
          font-size: 0.7rem;
          padding: 0.35rem 0.65rem;
          white-space: normal;
          word-break: break-word;
          max-width: 100%;
          display: inline-block;
          text-align: center;
          line-height: 1.3;
      }

      /* Колонка "Тип" — ограничиваем ширину содержимого */
      tbody td:nth-child(3) {
          overflow: hidden;
      }

      /* Выравнивание колонок Дата и Пользователь по центру */
      tbody td:nth-child(1),
      tbody td:nth-child(2) {
          text-align: center;
      }

      thead th:nth-child(1),
      thead th:nth-child(2) {
          text-align: center;
      }

      :host-context([data-bs-theme="dark"]) table {
          background-color: var(--dark-bg-surface);
          color: var(--dark-text);
      }

      :host-context([data-bs-theme="dark"]) table.table {
          --bs-table-bg: var(--dark-bg-surface);
          --bs-table-hover-bg: var(--dark-bg-card);
      }

      :host-context([data-bs-theme="dark"]) thead th {
          border-bottom-color: var(--dark-border);
          color: var(--dark-text);
      }

      :host-context([data-bs-theme="dark"]) tbody td {
          border-bottom-color: var(--dark-bg-elevated);
          color: var(--dark-text);
      }

      :host-context([data-bs-theme="dark"]) .audit-table-row:hover {
          background-color: var(--dark-bg-card);
      }

      :host-context([data-bs-theme="dark"]) .audit-table-row:hover > td {
          background-color: var(--dark-bg-card) !important;
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
