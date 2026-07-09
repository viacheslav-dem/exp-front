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
  styleUrls: ['./audit.component.scss'],
  standalone: false,
  changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.stats) ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Eager
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
      SearchField.startsWith('person.personName.lastName')
          .setTitle('Пользователь')
          .setPlaceholder('Поиск по фамилии...'),
      SearchField.datePeriod('date')
          .setTitle('Период времени')
          .setPlaceholder('Выбрать период...'),
      SearchField.multiSelect('type', this.allTypes, value => this._auditTypePipe.transform(value))
          .setSelectText('Выбрать тип')
          .setCheckAllEnabled(true)
          .setTitle('Тип записи'),
      // НОВЫЕ ФИЛЬТРЫ - используем SearchField.startsWith или SearchField.contains
      SearchField.startsWith('sourceName')
          .setTitle('Источник события')
          .setPlaceholder('Поиск по источнику...'),
      SearchField.startsWith('sourceIp')
          .setTitle('IP источника')
          .setPlaceholder('Поиск по IP...')
    ];
    this.enableFilterCache("audit");
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

  getDuration(record: AuditRecordDto): number {
    if (!record.operationStartTime || !record.operationEndTime) {
      return 0;
    }
    const start = new Date(record.operationStartTime).getTime();
    const end = new Date(record.operationEndTime).getTime();
    return end - start;
  }

  getDurationFormatted(record: AuditRecordDto): string {
    const duration = this.getDuration(record);
    if (duration === 0) return '-';
    if (duration < 1000) return `${duration} мс`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)} с`;
    return `${Math.floor(duration / 60000)} мин ${Math.floor((duration % 60000) / 1000)} с`;
  }

  getDurationClass(record: AuditRecordDto): string {
    const duration = this.getDuration(record);
    if (duration > 5000) return 'duration-high';
    return '';
  }

  showDetails(record: AuditRecordDto) {
    // Открыть модальное окно с деталями события
    console.log('Details:', record);
  }

  getBadgeClass(type: string): string {
    const badgeClasses: { [key: string]: string } = {
      // Существующие
      'AUTH': 'bg-success',
      'AUTH_ERROR': 'bg-danger',
      'LOGOUT': 'bg-secondary',
      'SESSION_EXPIRED': 'bg-warning',
      'TOKEN_REFRESH': 'bg-success',
      'TRANSITION': 'bg-info',
      'TRANSITION_ERROR': 'bg-danger',
      'USER': 'bg-primary',
      'USER_ERROR': 'bg-danger',
      'PASSWORD': 'bg-warning',
      'PASSWORD_ERROR': 'bg-danger',
      'COUNCIL': 'bg-info',
      'COUNCIL_ERROR': 'bg-danger',
      'DICTIONARY': 'bg-info',
      'DICTIONARY_ERROR': 'bg-danger',
      'PROPERTIES': 'bg-info',
      'PROPERTIES_ERROR': 'bg-danger',
      'CRYPTO': 'bg-dark',
      'CRYPTO_ERROR': 'bg-danger',
      'MAILING': 'bg-info',
      'MAILING_ERROR': 'bg-danger',

      // Новые типы безопасности
      'SECURITY_ALERT': 'bg-danger',
      'SECURITY_ALERT_ERROR': 'bg-dark',
      'OPERATION_AUDIT': 'bg-primary',
      'OPERATION_AUDIT_ERROR': 'bg-danger',
      'DATA_ACCESS': 'bg-info',
      'DATA_ACCESS_ERROR': 'bg-danger',
      'DATA_EXPORT': 'bg-success',
      'DATA_EXPORT_ERROR': 'bg-danger',
      'CONFIG_CHANGE': 'bg-warning',
      'CONFIG_CHANGE_ERROR': 'bg-danger',
      'PRIVILEGE_CHANGE': 'bg-danger',
      'PRIVILEGE_CHANGE_ERROR': 'bg-dark',
      'IP_BLOCKED': 'bg-dark',
      'IP_BLOCKED_ERROR': 'bg-danger',
      'BRUTE_FORCE': 'bg-danger',
      'BRUTE_FORCE_ERROR': 'bg-dark',
      'API_ACCESS': 'bg-primary',
      'API_ACCESS_ERROR': 'bg-danger',
      'SESSION_ANOMALY': 'bg-warning',
      'SESSION_ANOMALY_ERROR': 'bg-danger',
      'INTEGRITY_CHECK': 'bg-success',
      'INTEGRITY_CHECK_ERROR': 'bg-danger',
      'BACKUP_OPERATION': 'bg-info',
      'BACKUP_OPERATION_ERROR': 'bg-danger',
      'RESTORE_OPERATION': 'bg-info',
      'RESTORE_OPERATION_ERROR': 'bg-danger',
      'SYSTEM_HEALTH': 'bg-success',
      'SYSTEM_HEALTH_ERROR': 'bg-danger'
    };
    return `badge ${badgeClasses[type] || 'bg-secondary'} bg-opacity-10 text-dark`;
  }

  getIconClass(type: string): string {
    const iconClasses: { [key: string]: string } = {
      'AUTH': 'fas fa-sign-in-alt me-1',
      'AUTH_ERROR': 'fas fa-exclamation-triangle me-1',
      'LOGOUT': 'fas fa-sign-out-alt me-1',
      'SESSION_EXPIRED': 'fas fa-clock me-1',
      'TOKEN_REFRESH': 'fas fa-sync-alt me-1',
      'SECURITY_ALERT': 'fas fa-shield-alt me-1',
      'SECURITY_ALERT_ERROR': 'fas fa-bug me-1',
      'OPERATION_AUDIT': 'fas fa-clipboard-list me-1',
      'DATA_ACCESS': 'fas fa-database me-1',
      'DATA_EXPORT': 'fas fa-file-export me-1',
      'CONFIG_CHANGE': 'fas fa-cog me-1',
      'PRIVILEGE_CHANGE': 'fas fa-user-shield me-1',
      'IP_BLOCKED': 'fas fa-ban me-1',
      'BRUTE_FORCE': 'fas fa-fingerprint me-1',
      'API_ACCESS': 'fas fa-code-branch me-1',
      'SESSION_ANOMALY': 'fas fa-user-secret me-1',
      'INTEGRITY_CHECK': 'fas fa-check-double me-1',
      'BACKUP_OPERATION': 'fas fa-database me-1',
      'RESTORE_OPERATION': 'fas fa-undo-alt me-1',
      'SYSTEM_HEALTH': 'fas fa-heartbeat me-1',
      'UNKNOWN': 'fas fa-question-circle me-1',
      'UNKNOWN_ERROR': 'fas fa-exclamation-circle me-1'
    };
    return iconClasses[type] || 'fas fa-tag me-1';
  }

}
