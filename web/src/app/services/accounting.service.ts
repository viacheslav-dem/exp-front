import {Injectable} from "@angular/core";
import {HttpClientSecure} from "@app/services/http.client";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {Observable} from "rxjs";
import {SERVER_URL} from "@app/config";
import {Page} from "@app/components/common-components/page-and-filter/model/Page";
import {AccountingDto} from "@app/dto/AccountingDto";
import {HasStateService} from "@app/services/has-state.service";
import {AccountingTermsMessages} from "@app/pipes/accounting.pipe";
import {AuthService} from "@app/services/auth.service";
import {IdDto} from "@app/dto/IdDto";
import {Filter} from "@app/components/common-components/page-and-filter/model/Filter";
import {PeriodDto} from "@app/dto/PeriodDto";
import {PaymentDto} from "@app/dto/request/PaymentDto";
import {HttpResponse} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable()
export class AccountingService extends HasStateService {

  url: string = `${SERVER_URL}/accounting`;

  filter: Filter<any>;
  filterName: string;

  constructor(private _http: HttpClientSecure,
              protected _authService: AuthService) {
    super(_authService);
  }

  prepareAccounting(accounting: AccountingDto) {
    this.prepare(accounting, AccountingTermsMessages);
  }

  getAccountingPage(request: SearchPageRequest): Observable<Page<AccountingDto>> {
    return this._http.post(`${this.url}/get`, request);
  }

  finishAccounting(idDto: IdDto, payDate: Date, actuallyPaid: number): Observable<AccountingDto> {
    let payment = new PaymentDto();
    payment.payDate = payDate;
    payment.actuallyPaid = actuallyPaid;
    return this._http.postBlock(`${this.url}/finish/${idDto.id}`, payment);
  }

  refreshAct(idDto: IdDto): Observable<AccountingDto> {
    return this._http.postBlock(`${this.url}/refresh-act/${idDto.id}`, null);
  }

  refreshContract(idDto: IdDto
  //                , period: PeriodDto
  ): Observable<AccountingDto> {
    return this._http.postBlock(`${this.url}/refresh-contract/${idDto.id}`
    //    , period
    ,null);
  }

    // downloadAgreements(dateFrom: number, dateTo: number) {
    // return this.downloadFile()
    //   return this._http.getBlock(`${this.url}/agreements`, {params: {dateTo: dateTo, dateFrom: dateFrom}});
    // }

  downloadAgreements(dateFrom: number, dateTo: number) {
    return this._http.getBlock<HttpResponse<Blob>>(`${this.url}/agreements`, {
      params: {dateFrom: dateFrom, dateTo: dateTo},
      responseType: 'blob',
      observe: 'response',
    //  headers: {hash: hash ? hash : ''}
    }).pipe(map(response => {

      let contentDisposition: string = response.headers.get('content-disposition');
      let filename = contentDisposition.substr(contentDisposition.indexOf('=') + 1);
      filename = decodeURIComponent(filename);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(response.body, filename);
      } else {
        let a:HTMLAnchorElement = <HTMLAnchorElement>document.createElement('a');
        a.href = window.URL.createObjectURL(response.body);
        a.target = '_parent';
        // Use a.download if available. This increases the likelihood that
        // the file is downloaded instead of opened by another PDF plugin.
        if ('download' in a) {
          a.download = filename;
        }
        // <a> must be in the document for IE and recent Firefox versions.
        // (otherwise .click() is ignored)
        (document.body || document.documentElement).appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      }

    }));
  }
}
