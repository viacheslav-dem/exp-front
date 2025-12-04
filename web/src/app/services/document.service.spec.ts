import { of } from 'rxjs';
import { DocumentService } from './document.service';
import { HttpClientSecure } from '@app/services/http.client';
import { DialogService } from '@app/components/dialogs/dialog.service';
import { GlobalToastyService } from '@app/services/global-toasty.service';
import { IdDto } from '@app/dto/IdDto';
import { DocumentDto } from '@app/dto/DocumentDto';
import { TemplateDocumentDto } from '@app/dto/TemplateDocumentDto';
import { SearchPageRequest } from '@app/components/common-components/page-and-filter/model/SearchPageRequest';
import { ProjectDto } from '@app/dto/ProjectDto';

class HttpClientSecureMock {
  getBlockCalls: any[] = [];
  postBlockCalls: any[] = [];
  postCalls: any[] = [];
  deleteBlockCalls: any[] = [];

  getTokenParamsString() {
    return 'token=TEST_TOKEN';
  }

  getBlock(url: string, options?: any) {
    this.getBlockCalls.push({ url, options });
    return of({} as any) as any;
  }

  postBlock<T>(url: string, body?: any, options?: any) {
    this.postBlockCalls.push({ url, body, options });
    return of({} as any) as any;
  }

  post(url: string, body?: any, options?: any) {
    this.postCalls.push({ url, body, options });
    return of({} as any) as any;
  }

  deleteBlock(url: string, options?: any) {
    this.deleteBlockCalls.push({ url, options });
    return of({} as any) as any;
  }
}

class DialogServiceMock {
  confirmTitles: string[] = [];
  confirmMessages: string[] = [];

  showConfirmDialog(title: string, message: string) {
    this.confirmTitles.push(title);
    this.confirmMessages.push(message);

    // имитируем Observable, который сразу вызывает subscribe
    return {
      subscribe: (cb: () => void) => cb()
    } as any;
  }
}

class GlobalToastyServiceMock {
  successMessages: string[] = [];

  success(message: any) {
    const msg = typeof message === 'string' ? message : message?.msg;
    this.successMessages.push(msg);
  }
}

describe('DocumentService', () => {
  let service: DocumentService;
  let http: HttpClientSecureMock;
  let dialog: DialogServiceMock;
  let toasty: GlobalToastyServiceMock;

  beforeEach(() => {
    http = new HttpClientSecureMock();
    dialog = new DialogServiceMock();
    toasty = new GlobalToastyServiceMock();
    service = new DocumentService(
      http as unknown as HttpClientSecure,
      dialog as unknown as DialogService,
      toasty as unknown as GlobalToastyService
    );
  });

  // проверяет, что сервис успешно создаётся
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // проверяет, что downloadDocument формирует корректный URL для скачивания документа
  it('downloadDocument should call downloadFile with correct url', () => {
    const doc: IdDto = { id: 123 } as IdDto;

    // заменяем реальный downloadFile на шпион
    const spy = spyOn<any>(service, 'downloadFile').and.callFake(() => ({} as any));

    service.downloadDocument(doc);

    expect(spy).toHaveBeenCalled();
    const calledUrl = spy.calls.mostRecent().args[0] as string;
    expect(calledUrl).toContain('document');
    expect(calledUrl).toContain('id=123');
    expect(calledUrl).toContain('token=TEST_TOKEN');
  });

  // проверяет, что saveTemplate отправляет POST-запрос с шаблоном
  it('saveTemplate should call postBlock with template data', () => {
    const template = { id: 1 } as TemplateDocumentDto;

    service.saveTemplate(template).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBe(1);
    const call = http.postBlockCalls[0];
    expect(call.url).toContain('/document/template/data');
    expect(call.body).toBe(template);
  });

  // проверяет, что getTemplatesPage отправляет POST-запрос для получения страницы шаблонов
  it('getTemplatesPage should call post with request', () => {
    const req = {} as SearchPageRequest;

    service.getTemplatesPage(req).subscribe?.(() => {});

    expect(http.postCalls.length).toBe(1);
    const call = http.postCalls[0];
    expect(call.url).toContain('/document/template/');
    expect(call.body).toBe(req);
  });

  // проверяет, что deleteDocument показывает диалог подтверждения и при подтверждении удаляет документ и показывает тост
  it('deleteDocument should show confirm dialog, delete document and show success toast', () => {
    const doc = { id: 10, name: 'Документ' } as DocumentDto;
    const url = '/test/delete/url';
    let deleted = false;

    service.deleteDocument(doc, url, () => deleted = true);

    expect(dialog.confirmTitles.length).toBe(1);
    expect(dialog.confirmMessages[0]).toContain('Документ');

    expect(http.deleteBlockCalls.length).toBe(1);
    const call = http.deleteBlockCalls[0];
    expect(call.url).toBe(url);

    expect(toasty.successMessages).toContain('Документ успешно удалён.');
    expect(deleted).toBeTrue();
  });

  // проверяет, что generateDocument вызывает postBlock и показывает тост об успешном создании документа
  it('generateDocument should call postBlock and show success toast', () => {
    const url = '/generate/url';
    const form = { field: 'value' };

    service.generateDocument(url, form).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBe(1);
    const call = http.postBlockCalls[0];
    expect(call.url).toBe(url);
    expect(call.body).toBe(form);
    expect(toasty.successMessages).toContain('Документ успешно создан.');
  });
});
