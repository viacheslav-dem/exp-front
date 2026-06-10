import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {environment} from "../../../../environments/environment";
import {StatsService} from "@app/services/stats.service";
import {SigningUserinfoDto} from "@app/dto/SigningUserinfoDto";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {SortOrder, Direction, SortClass} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {faSort} from "@fortawesome/free-solid-svg-icons";
import {DataService, Catalog} from "@app/services/data.service";
import {RecordKeepingDto} from "@app/dto/RecordKeepingDto";
import {GlobalToastyService} from "@app/services/global-toasty.service";

@Component({
  selector: 'app-case-production',
  templateUrl: './case-production.component.html',
  styleUrls: ['./case-production.component.scss'],
  standalone: false
})
export class CaseProductionComponent extends FilterAndPages<SigningUserinfoDto> {

  caseProds: SigningUserinfoDto[] = [];
  sort: SortOrder = { property: 'signingDate', direction: Direction.DESC };
  recordKeepingList: RecordKeepingDto[] = [];
  savingIds: Set<number> = new Set();
  editingIds: Set<number> = new Set(); // <-- ДОБАВЛЕНО

  // Иконки и классы сортировки
  faSort = faSort;
  SortClass = SortClass;

  constructor(private _statsService: StatsService,
              private _dataService: DataService,
              private _toasty: GlobalToastyService,
              private cdr: ChangeDetectorRef) {
    super(10);
  }

  ngOnInit(): void {
    this._searchFields = [
      SearchField.datePeriod('signingDate')
          .setTitle('Дата подписи')
          .setPlaceholder('Выбрать период...'),
      SearchField.startsWith('userinfoDto.surname')
          .setTitle('ФИО')
          .setPlaceholder('Поиск по фамилии...'),
      SearchField.startsWith('userinfoDto.orgName')
          .setTitle('Организация')
          .setPlaceholder('Поиск по организации...')
    ];
    this.enableFilterCache("case-prod");

    // Загружаем список делопроизводства
    this.loadRecordKeepingList();

    setTimeout(() => {
      const hasCachedFilters = localStorage.getItem('filter_cache_case-prod');
      if (!hasCachedFilters) {
        this.update();
      }
    }, 100);
  }

  loadRecordKeepingList(): void {
    this._dataService.getCatalog(Catalog.RECORD_KEEPING).subscribe({
      next: (res: RecordKeepingDto[]) => {
        this.recordKeepingList = res;
        console.log('Loaded record keeping list:', this.recordKeepingList);
        this.cdr?.markForCheck();
      },
      error: (error) => {
        console.error('Error loading record keeping list:', error);
        this._toasty.error('Ошибка загрузки списка дел');
      }
    });
  }

  startEditing(cp: SigningUserinfoDto): void {
    // Сохраняем текущее значение перед редактированием
    cp.selectedRecordKeepingId = cp.recordKeepingDto?.id || null;
    cp.originalRecordKeepingId = cp.recordKeepingDto?.id || null;
    this.editingIds.add(cp.id);
    this.cdr?.markForCheck();
  }

  cancelEditing(cp: SigningUserinfoDto): void {
    this.editingIds.delete(cp.id);
    // Откатываем изменения
    cp.selectedRecordKeepingId = cp.originalRecordKeepingId;
    this.cdr?.markForCheck();
  }

  onRecordKeepingChange(cp: SigningUserinfoDto, caseProdId: number): void {
    // Проверяем, изменилось ли значение
    if (cp.selectedRecordKeepingId === cp.originalRecordKeepingId) {
      this.editingIds.delete(caseProdId);
      this.cdr?.markForCheck();
      return;
    }

    console.log('Updating record keeping:', {
      caseProdId,
      selectedId: cp.selectedRecordKeepingId,
      originalId: cp.originalRecordKeepingId
    });

    this.savingIds.add(caseProdId);
    this.cdr?.markForCheck();

    this._statsService.updateCaseProductionRecordKeeping(caseProdId, cp.selectedRecordKeepingId).subscribe({
      next: (updatedDto: SigningUserinfoDto) => {
        console.log('Update successful, response:', updatedDto);

        // Обновляем запись полученными с сервера данными
        const index = this.caseProds.findIndex(item => item.id === caseProdId);
        if (index !== -1) {
          this.caseProds[index] = updatedDto;
          this.caseProds[index].selectedRecordKeepingId = updatedDto.recordKeepingDto?.id || null;
          this.caseProds[index].originalRecordKeepingId = updatedDto.recordKeepingDto?.id || null;

          console.log('Updated caseProd:', {
            id: this.caseProds[index].id,
            selectedRecordKeepingId: this.caseProds[index].selectedRecordKeepingId,
            recordKeepingDto: this.caseProds[index].recordKeepingDto
          });
        }

        this._toasty.success(cp.selectedRecordKeepingId
            ? 'Дело успешно привязано'
            : 'Привязка дела удалена');

        this.savingIds.delete(caseProdId);
        this.editingIds.delete(caseProdId);
        this.cdr?.markForCheck();
      },
      error: (error) => {
        console.error('Error updating record keeping:', error);
        this._toasty.error('Ошибка при сохранении дела');

        // Откатываем выбор
        cp.selectedRecordKeepingId = cp.originalRecordKeepingId;
        this.savingIds.delete(caseProdId);
        this.cdr?.markForCheck();
      }
    });
  }

  sortBy(property: string) {
    if (this.sort.property === property) {
      this.sort.direction = this.sort.direction === Direction.ASC ? Direction.DESC : Direction.ASC;
    } else {
      this.sort.property = property;
      this.sort.direction = Direction.ASC;
    }
    this._sortOrders = [this.sort];
    this.update();
  }

  loadPage() {
    let dateFrom: string | null = null;
    let dateTo: string | null = null;
    let lastName: string | null = null;
    let orgName: string | null = null;

    for (const field of this._searchFields) {
      if (!field.isEmpty()) {
        switch (field.key) {
          case 'signingDate':
            const value = field.value as any;
            if (value?.start) dateFrom = this.formatDate(value.start);
            if (value?.end) dateTo = this.formatDate(value.end);
            break;
          case 'userinfoDto.surname':
            lastName = field.value as string;
            break;
          case 'userinfoDto.orgName':
            orgName = field.value as string;
            break;
        }
      }
    }

    this._statsService.getCaseProduction(dateFrom, dateTo, lastName, orgName, this._searchRequest.paging).subscribe({
      next: (res: any) => {
        let pageResponse: Page<SigningUserinfoDto>;

        if (res?.content && Array.isArray(res.content)) {
          pageResponse = res as Page<SigningUserinfoDto>;
        } else if (res && Array.isArray(res)) {
          pageResponse = {
            content: res,
            totalPages: 1,
            totalElements: res.length,
            size: res.length,
            page: 0
          };
        } else if (res?.data && Array.isArray(res.data)) {
          pageResponse = {
            content: res.data,
            totalPages: Math.ceil(res.total / this._pagination.itemsPerPage),
            totalElements: res.total,
            size: res.data.length,
            page: this._searchRequest.paging.page - 1
          };
        } else {
          pageResponse = {
            content: [],
            totalPages: 0,
            totalElements: 0,
            size: 0,
            page: 0
          };
        }

        this._page = pageResponse;
        this.caseProds = pageResponse.content;

        // Инициализируем поля для выбранных дел
        this.caseProds.forEach(cp => {
          cp.selectedRecordKeepingId = cp.recordKeepingDto?.id || null;
          cp.originalRecordKeepingId = cp.recordKeepingDto?.id || null;
          console.log(`CaseProd ${cp.id}: selectedRecordKeepingId = ${cp.selectedRecordKeepingId}, recordKeepingDto =`, cp.recordKeepingDto);
        });

        this.setLoading(false);
        this.cdr?.markForCheck();
      },
      error: (error) => {
        console.error('Error loading case production:', error);
        this.setLoading(false);
        this.cdr?.markForCheck();
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}