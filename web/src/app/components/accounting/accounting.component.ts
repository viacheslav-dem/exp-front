import {Component, ElementRef, ChangeDetectionStrategy, signal, ChangeDetectorRef, viewChild} from "@angular/core";
import {
  Direction,
  sortByName,
  SortClass,
  SortOrder,
  switchDirection
} from "@app/components/common-components/page-and-filter/model/SortOrder";
import {AccountingService} from "@app/services/accounting.service";
import {AccountingDto} from "@app/dto/AccountingDto";
import {FilterAndPages} from "@app/components/common-components/page-and-filter/filter-and-pages";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {DocumentDto} from "@app/dto/DocumentDto";
import {DocumentService} from "@app/services/document.service";
import {
  AccountingState,
  AccountingStatePipe,
  AccountingTypePipe,
  getAllAccountingStates,
  getAllAccountingTypes
} from "@app/pipes/accounting.pipe";
import {SearchField} from "@app/components/common-components/page-and-filter/model/SearchField";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {Operation} from "@app/components/common-components/page-and-filter/model/FilterBuilder";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {Router} from "@angular/router";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PeriodDto} from "@app/dto/PeriodDto";
import {NumberPipe} from "@app/pipes/number.pipe";

@Component({
    selector: 'app-accounting',
    templateUrl: './accounting.component.html',
    styleUrls: ['accounting.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountingComponent extends FilterAndPages<AccountingDto> {

  AccountingState = AccountingState;
  SortClass = SortClass;

  dateFrom = signal<number>(dayjs().subtract(1, 'day').valueOf());
  dateTo = signal<number>(dayjs().subtract(1, 'day').valueOf());

  sortOrder: SortOrder = new SortOrder('id', Direction.DESC);
  accounting = signal<AccountingDto[]>([]);
  selectedRecord = signal<AccountingDto | undefined>(undefined);
  selectedDocument = signal<DocumentDto | undefined>(undefined);
  filterName = signal<string | undefined>(undefined);
  payDate = signal<Date | undefined>(undefined);

  readonly fileViewer = viewChild<ModalComponent>('fileViewerModal');
  readonly confirmFinishAccountingModal = viewChild<ModalComponent>('confirmFinishAccountingModal');
  readonly paySumInput = viewChild<ElementRef<HTMLInputElement>>('paySumInput');


  constructor(private _accountingService: AccountingService,
              private _documentService: DocumentService,
              private _accountingStatePipe: AccountingStatePipe,
              private _accountingTypePipe: AccountingTypePipe,
              private _dialogService: DialogService,
              private _toasty: GlobalToastyService,
              private _router: Router,
              private cdr: ChangeDetectorRef) {
    super(10);
  }

  ngOnInit(): void {
    if (this._router.url == '/accounting') {
      this._accountingService.filterName = null;
      this._accountingService.filter = null;
    }
    if (this._accountingService.filterName) {
      this.filterName.set(this._accountingService.filterName);
      this._filters = [this._accountingService.filter];
      this.update();
    } else {
      this._router.navigateByUrl('accounting').then();
      this._searchFields = [
        SearchField.datePeriod('stateStartDate').setPlaceholder('Выбрать период...'),
        SearchField.contains('person.personName.lastName').setPlaceholder('Поиск по фамилии...'),
        SearchField.contains('description').setPlaceholder('Поиск по описанию...'),
        SearchField.multiSelect('accountingType', getAllAccountingTypes(), value => this._accountingTypePipe.transform(value))
          .setSingleSelection(true).setSelectText('Выбрать тип расчёта'),
        SearchField.multiSelect('state', getAllAccountingStates(), value => this._accountingStatePipe.transform(value))
          .setSelectText('Выбрать состояние').setCheckAllEnabled(true),
        SearchField.checkbox('stateEndDate', 'С подходящим или нарушенным сроком', new DateRange(null, dayjs().valueOf()), null)
          .setOperation(Operation.RANGE),
      ];
      this.enableFilterCache("accounting");
      this.update();
    }
  }

  loadPage() {
    this._accountingService.getAccountingPage(this._searchRequest).subscribe({
      next: (res) => {
        this.setLoading(false);
        this._page = res;
        const accountingList = res.content;
        accountingList.forEach(accounting => this._accountingService.prepareAccounting(accounting));
        this.accounting.set(accountingList);
        this.cdr.markForCheck();
      },
      error: () => {
        this.setLoading(false);
        this.cdr.markForCheck();
      }
    });
  }

  showDocument(doc: DocumentDto) {
    this._dialogService.showPDFViewer("document", doc).subscribe();
    // this.selectedDocument = doc;
    // this.fileViewer.show();
  }

  downloadDocument(doc: DocumentDto) {
    this._documentService.downloadDocument(doc).subscribe();
  }

  downloadDocxDocument(doc: DocumentDto) {
    this._documentService.downloadDocument(doc, 'document/docx').subscribe();
  }

  refreshContract(accounting: AccountingDto) {
    this._dialogService.showConfirmDialog(
      'Пересоздание документа',
      `Пересоздать договор в соответствии с изменившимися данными в системе?`,
      'Дата договора при этом останется неизменной'
    ).subscribe(() => {
      this._accountingService.refreshContract(accounting
      //    , new PeriodDto()
      ).subscribe({
        next: (res) => {
          accounting.contract = res.contract;
          this._toasty.success("Документ успешно обновлён.");
          // Update the signal to trigger change detection
          this.accounting.set([...this.accounting()]);
          this.cdr.markForCheck();
        }
      });
    });
  }

  refreshAct(accounting: AccountingDto) {
    this._dialogService.showConfirmDialog(
      'Пересоздание документа',
      `Пересоздать акт в соответствии с изменившимися данными в системе?`,
      'Дата акта и сумма выплат при этом останутся неизменными'
    ).subscribe(() => {
      this._accountingService.refreshAct(accounting).subscribe({
        next: (res) => {
          accounting.act = res.act;
          this._toasty.success("Документ успешно обновлён.");
          // Update the signal to trigger change detection
          this.accounting.set([...this.accounting()]);
          this.cdr.markForCheck();
        }
      });
    });
  }

  showFinishAccountingModal(accounting: AccountingDto) {
    this.payDate.set(new Date());
    this.selectedRecord.set(accounting);
    this.confirmFinishAccountingModal()?.show();
  }

  finishAccounting() {
    const payDateValue = this.payDate();
    const selectedRecordValue = this.selectedRecord();
    
    if (payDateValue == null) {
      this._toasty.error('Заполните дату оплаты');
      return;
    }
    const paySumInput = this.paySumInput()?.nativeElement;
    if (paySumInput?.value == null){
      this._toasty.error('Введите сумму к оплате')
      return;
    }
    this.confirmFinishAccountingModal()?.hide();
    if (selectedRecordValue) {
      this._accountingService.finishAccounting(selectedRecordValue, payDateValue, Number(paySumInput.value)).subscribe(() => {
        this._toasty.success('Произведена отметка об оплате.');
        this.update();
      });
    }
  }

  closeFinishAccountingModal() {
    this.confirmFinishAccountingModal()?.hide();
  }

  getSortOrders() {
    if (this.sortOrder.property == 'person') {
      return sortByName('person.personName.', this.sortOrder.direction);
    } else {
      return [this.sortOrder];
    }
  }

  sortBy(property: string) {
    if (property == this.sortOrder.property) {
      this.sortOrder.direction = switchDirection(this.sortOrder.direction, false);
    } else {
      this.sortOrder.direction = Direction.ASC;
    }
    this.sortOrder.property = property;
    this.update();
  }

  fixed(num: number): number{
    return Math.round(num*100)/100
  }

  /**
   * В шаблоне нельзя использовать `| number`, потому что в scope одновременно попадают:
   * - встроенная Angular pipe `number` (DecimalPipe из CommonModule)
   * - наша кастомная `NumberPipe` с тем же именем `number` (из CustomPipesModule)
   * Это вызывает NG0313. Здесь используем кастомный форматтер напрямую (без шаблонного pipe).
   *
   * Риск: меняем только одно место форматирования в accounting, поведение сохраняем.
   * Изменение локальное и легко откатывается.
   */
  formatNumber(value: number | null | undefined, precision?: number, sign?: boolean): string | null {
    return NumberPipe.transform(value as number, precision, sign);
  }

  changeDateToValue(dateTo: number) {
    this.dateTo.set(dateTo);
    this.update();
  }

  changeDateFromValue(dateFrom: number) {
    this.dateFrom.set(dateFrom);
    this.update();
  }


  downloadAgreements() {
    this._accountingService.downloadAgreements(this.dateFrom(), this.dateTo()).subscribe(res => {
        this._toasty.success("Документ успешно сформирован.");
    });

  }
}