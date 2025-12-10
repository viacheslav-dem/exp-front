import {map} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {HttpClientSecure} from "@app/services/http.client";
import { HttpResponse } from "@angular/common/http";
import {TemplateDocumentDto} from "@app/dto/TemplateDocumentDto";
import {Observable} from "rxjs";
import {SearchPageRequest} from "@app/components/common-components/page-and-filter/model/SearchPageRequest";
import {PageDto} from "@app/dto/PageDto";
import {DocumentDto} from "@app/dto/DocumentDto";
import {noop} from "@app/support/utils";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {IdDto} from "@app/dto/IdDto";
import {ProjectDto} from "@app/dto/ProjectDto";

@Injectable()
export class DocumentService {

  url = `${SERVER_URL}/document`;

  constructor(private _http: HttpClientSecure,
              private _dialogService: DialogService,
              private _toasty: GlobalToastyService) {
  }

  downloadDocument(document: IdDto, url: string = 'document') {
    return this.downloadFile(`${SERVER_URL}/${url}?${this._http.getTokenParamsString()}&id=${document.id}`);
  }

  downloadTemplate(templateId) {
    return this.downloadFile(`${SERVER_URL}/document/template/${templateId}?${this._http.getTokenParamsString()}`);
  }

  downloadTemplateXml(templateId) {
    return this.downloadFile(`${SERVER_URL}/document/template-xml/${templateId}?${this._http.getTokenParamsString()}`);
  }

  checkPdfView(doc: IdDto): Observable<boolean> {
    return this._http.postBlock(`${this.url}/check-pdf-view?id=${doc.id}`, null);
  }

  downloadAllDocuments(project: ProjectDto){
    return this.downloadFile(`${this.url}/all/${project.id}`);
  }

  downloadFile(url, hash?: string) {
    return this._http.getBlock<HttpResponse<Blob>>(url, {
      responseType: 'blob',
      observe: 'response',
      headers: {hash: hash ? hash : ''}
    }).pipe(map(response => {

        let contentDisposition: string = response.headers.get('content-disposition');
        let filename = contentDisposition.substr(contentDisposition.indexOf('=') + 1);
        filename = decodeURIComponent(filename);
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


    }));
  }

  saveTemplate(template: TemplateDocumentDto): Observable<TemplateDocumentDto> {
    return this._http.postBlock(`${SERVER_URL}/document/template/data`, template);
  }

  getTemplatesPage(request: SearchPageRequest): Observable<PageDto<TemplateDocumentDto>> {
    return this._http.post(`${SERVER_URL}/document/template/`, request)
  }

  getMethRec() {
    return this._http.get(`${SERVER_URL}/get/meth_rec/`);
  }

  deleteDocument(doc: DocumentDto, url: string, onDelete: Function = noop, options?: any) {
    this._dialogService.showConfirmDialog('Удаление документа',
      'Вы действительно хотите удалить документ "' + doc.name + '"?'
    ).subscribe(() => this._http.deleteBlock(url, options).subscribe(() => {
      this._toasty.success('Документ успешно удалён.');
      onDelete();
    }));
  }

  generateDocument(url: string, form: any, options?: any): Observable<any> {
    return this._http.postBlock<any>(url, form, options).pipe(map(res => {
      this._toasty.success('Документ успешно создан.');
      return res;
    }));
  }
}
