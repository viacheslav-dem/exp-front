import {map, catchError} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {SERVER_URL} from "@app/config";
import {HttpClientSecure} from "@app/services/http.client";
import { HttpResponse, HttpErrorResponse } from "@angular/common/http";
import {TemplateDocumentDto} from "@app/dto/TemplateDocumentDto";
import {Observable, throwError, EMPTY} from "rxjs";
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

  private static readonly FORBIDDEN_STATUS = 403;
  private static readonly DELETE_CONFIRM_TITLE = 'Удаление документа';
  private static readonly DELETE_FORBIDDEN_MESSAGE = 'Недостаточно прав для удаления этого документа. Вы можете удалять только документы, которые вы создали.';
  private static readonly DELETE_SUCCESS_MESSAGE = 'Документ успешно удалён.';

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
    }).pipe(
      map(response => {
        const contentDisposition = response.headers.get('content-disposition');
        const filename = decodeURIComponent(contentDisposition.slice(contentDisposition.indexOf('=') + 1));
        const blobUrl = window.URL.createObjectURL(response.body);
        const a = document.createElement('a') as HTMLAnchorElement;
        a.href = blobUrl;
        a.target = '_parent';
        if ('download' in a) {
          a.download = filename;
        }
        (document.body || document.documentElement).appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }),
      catchError((err: HttpErrorResponse) => {
        const msg = typeof err.error === 'string' ? err.error : (err.error?.message ?? 'Не удалось скачать файл.');
        this._toasty.err(err.status ?? 0, msg);
        return EMPTY;
      })
    );
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
    const confirmMessage = `Вы действительно хотите удалить документ "${doc.name}"?`;
    
    this._dialogService.showConfirmDialog(
      DocumentService.DELETE_CONFIRM_TITLE,
      confirmMessage
    ).subscribe(() => {
      const deleteOptions = {
        ...options,
        skipErrorHandlingForStatuses: [DocumentService.FORBIDDEN_STATUS]
      };
      this._http.deleteBlock(url, deleteOptions).pipe(
        catchError((error: HttpErrorResponse) => this.handleDeleteError(error))
      ).subscribe({
        next: () => {
          this._toasty.success(DocumentService.DELETE_SUCCESS_MESSAGE);
          onDelete();
        },
        error: () => {
          // Дополнительная обработка других ошибок не требуется,
          // так как они уже обрабатываются в http.client.handleError
        }
      });
    });
  }

  private handleDeleteError(error: HttpErrorResponse) {
    // Обрабатываем ошибку доступа (403) - показываем понятное сообщение
    // и не даем interceptor'у пытаться обновить токен, что может привести к logout
    if (error.status === DocumentService.FORBIDDEN_STATUS) {
      this._toasty.err(
        DocumentService.FORBIDDEN_STATUS,
        DocumentService.DELETE_FORBIDDEN_MESSAGE
      );
      return EMPTY;
    }
    // Для других ошибок пробрасываем дальше
    return throwError(() => error);
  }

  generateDocument(url: string, form: any, options?: any): Observable<any> {
    return this._http.postBlock<any>(url, form, options).pipe(map(res => {
      this._toasty.success('Документ успешно создан.');
      return res;
    }));
  }
}
