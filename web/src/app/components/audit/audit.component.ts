import {Component} from "@angular/core";
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

@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    styles: [`
      table {
          font-size: 0.875rem;
          background-color: white;
          margin-bottom: 0;
      }
  `],
    standalone: false
})
export class AuditComponent extends FilterAndPages<AuditRecordDto> {

  SortClass = SortClass;

  audit: AuditRecordDto[] = [];
  sort: SortOrder = new SortOrder('date', Direction.DESC);
  allTypes: string[] = getAllAuditTypes();

  constructor(private _service: AuditService,
              private _auditTypePipe: AuditTypePipe) {
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
  }

  loadPage() {
    this._service.getAuditRecords(this._searchRequest).subscribe(res => {
      this._page = res;
      this.audit = res.content;
      this.setLoading(false);
    }, () => this.setLoading(false));
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
