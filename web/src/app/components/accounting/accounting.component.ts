import {Component, ElementRef, ViewChild} from "@angular/core";
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
import * as moment from "moment";
import {DateRange} from "@app/components/common-components/page-and-filter/model/Range";
import {Router} from "@angular/router";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {PeriodDto} from "@app/dto/PeriodDto";

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styles: [`
      table {
          font-size: 0.875rem;
          background-color: white;
          margin-bottom: 0;
      }

      td, th {
          padding: 0.75rem 0.5rem;
      }
  `]
})
export class AccountingComponent extends FilterAndPages<AccountingDto> {

  AccountingState = AccountingState;
  SortClass = SortClass;

  dateFrom: number =  moment().add(-1, "day").valueOf();
  dateTo: number = moment().add(-1, "day").valueOf();


  sortOrder: SortOrder = new SortOrder('id', Direction.DESC);
  accounting: AccountingDto[] = [];
  selectedRecord: AccountingDto;
  selectedDocument: DocumentDto;
  filterName: string;
  payDate: Date;

  @ViewChild('fileViewerModal', { static: false }) fileViewer: ModalComponent;
  @ViewChild('confirmFinishAccountingModal', { static: false }) confirmFinishAccountingModal: ModalComponent;
  @ViewChild('paySumInput', { static: false }) paySumInput;
  @ViewChild("dateFromInput", { static: false }) dateFromInput: ElementRef;
  @ViewChild("dateToInput", { static: false }) dateToInput: ElementRef;


  constructor(private _accountingService: AccountingService,
              private _documentService: DocumentService,
              private _accountingStatePipe: AccountingStatePipe,
              private _accountingTypePipe: AccountingTypePipe,
              private _dialogService: DialogService,
              private _toasty: GlobalToastyService,
              private _router: Router) {
    super(10);
  }

  ngOnInit(): void {
    if (this._router.url == '/accounting') {
      this._accountingService.filterName = null;
      this._accountingService.filter = null;
    }
    if (this._accountingService.filterName) {
      this.filterName = this._accountingService.filterName;
      this._filters = [this._accountingService.filter];
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
        SearchField.checkbox('stateEndDate', 'С подходящим или нарушенным сроком', new DateRange(null, moment().valueOf()), null)
          .setOperation(Operation.RANGE),
      ];
      this.enableFilterCache("accounting");
    }
    this.dateFromInput.nativeElement.onchange = (e) => this.changeDateFrom(e.target.value);
    this.dateToInput.nativeElement.onchange = (e) => this.changeDateTo(e.target.value);
  }

  loadPage() {
    this._accountingService.getAccountingPage(this._searchRequest).subscribe(res => {
      this.setLoading(false);
      this._page = res;
      this.accounting = res.content;
      this.accounting.forEach(accounting => this._accountingService.prepareAccounting(accounting));
    }, () => this.setLoading(false));
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
      ).subscribe(res => {
        accounting.contract = res.contract;
        this._toasty.success("Документ успешно обновлён.");
      });
    });
  }

  refreshAct(accounting: AccountingDto) {
    this._dialogService.showConfirmDialog(
      'Пересоздание документа',
      `Пересоздать акт в соответствии с изменившимися данными в системе?`,
      'Дата акта и сумма выплат при этом останутся неизменными'
    ).subscribe(() => {
      this._accountingService.refreshAct(accounting).subscribe(res => {
        accounting.act = res.act;
        this._toasty.success("Документ успешно обновлён.");
      });
    });
  }

  showFinishAccountingModal(accounting: AccountingDto) {
    this.payDate = new Date();
    this.selectedRecord = accounting;
    this.confirmFinishAccountingModal.show();
  }

  finishAccounting() {

    if (this.payDate == null) {
      this._toasty.error('Заполните дату оплаты');
      return;
    }
    if (this.paySumInput.nativeElement.value == null){
      this._toasty.error('Введите сумму к оплате')
      return;
    }
    this.confirmFinishAccountingModal.hide();
    this._accountingService.finishAccounting(this.selectedRecord, this.payDate, this.paySumInput.nativeElement.value).subscribe(() => {
      this._toasty.success('Произведена отметка об оплате.');
      this.update();
    });
  }

  closeFinishAccountingModal() {
    this.confirmFinishAccountingModal.hide();
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

  changeDateTo(dateTo) {

    this.dateTo = moment(dateTo, 'DD.MM.YYYY').valueOf();
    this.update();
  }

  changeDateFrom(dateFrom) {

    this.dateFrom = moment(dateFrom, 'DD.MM.YYYY').valueOf();
    this.update();
  }


  downloadAgreements() {
    this._accountingService.downloadAgreements(this.dateFrom, this.dateTo).subscribe(res => {
        this._toasty.success("Документ успешно сформирован.");
    });

  }
}