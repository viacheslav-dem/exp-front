import { LifecycleGroupService } from './lifecycle-group.service';
import { HttpClientSecure } from '@app/services/http.client';
import { AuthService } from '@app/services/auth.service';
import { DocumentService } from '@app/services/document.service';
import { LifecycleGroupDto } from '@app/dto/LifecycleGroupDto';
import { IdDto } from '@app/dto/IdDto';
import { DocumentDto } from '@app/dto/DocumentDto';
import { ReturnFromCouncilWithoutExpertiseFormContent } from '@app/components/document-form/form-model/ReturnFromCouncilWithoutExpertiseFormContent';

class HttpClientSecureMock {
  postBlockCalls: any[] = [];
  deleteBlockCalls: any[] = [];
  getBlockCalls: any[] = [];
  postCalls: any[] = [];

  postBlock<T>(url: string, body?: any, options?: any) {
    this.postBlockCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }

  deleteBlock(url: string, options?: any) {
    this.deleteBlockCalls.push({ url, options });
    return { subscribe() {} } as any;
  }

  getBlock(url: string, options?: any) {
    this.getBlockCalls.push({ url, options });
    return { subscribe() {} } as any;
  }

  post(url: string, body?: any, options?: any) {
    this.postCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }
}

class AuthServiceMock {
  getCurrRole() {
    return 'TEST_ROLE';
  }
}

class DocumentServiceMock {
  generateDocumentCalls: any[] = [];
  deleteDocumentCalls: any[] = [];

  generateDocument(url: string, form: any) {
    this.generateDocumentCalls.push({ url, form });
    return { subscribe() {} } as any;
  }

  deleteDocument(doc: DocumentDto, url: string, onDelete: Function) {
    this.deleteDocumentCalls.push({ doc, url, onDelete });
    if (onDelete) {
      onDelete();
    }
  }
}

describe('LifecycleGroupService', () => {
  let service: LifecycleGroupService;
  let http: HttpClientSecureMock;
  let auth: AuthServiceMock;
  let documentService: DocumentServiceMock;

  beforeEach(() => {
    http = new HttpClientSecureMock();
    auth = new AuthServiceMock();
    documentService = new DocumentServiceMock();

    service = new LifecycleGroupService(
      http as unknown as HttpClientSecure,
      auth as unknown as AuthService,
      documentService as unknown as DocumentService
    );
  });

  // проверяет, что сервис успешно создаётся
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // проверяет, что prepareGroup вызывает базовый метод prepare с LifecycleGroupTermsMessages
  it('prepareGroup should delegate to base prepare with LifecycleGroupTermsMessages', () => {
    const group = {} as LifecycleGroupDto;
    const spy = spyOn<any>(service, 'prepare').and.callThrough();

    service.prepareGroup(group);

    expect(spy).toHaveBeenCalled();
  });

  // проверяет, что deleteLifecycleGroup вызывает deleteBlock с корректным URL
  it('deleteLifecycleGroup should call deleteBlock with correct url', () => {
    const id: IdDto = { id: 10 } as IdDto;

    service.deleteLifecycleGroup(id).subscribe?.(() => {});

    expect(http.deleteBlockCalls.length).toBe(1);
    const call = http.deleteBlockCalls[0];
    expect(call.url).toBe(`${service.url}/delete/${id.id}`);
  });

  // проверяет, что attachSection вызывает postBlock с URL /attach/{id}/section/{sectionId}
  it('attachSection should call postBlock with attach url', () => {
    const id: IdDto = { id: 1 } as IdDto;
    const sectionId = 5;

    service.attachSection(id, sectionId).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBe(1);
    const call = http.postBlockCalls[0];
    expect(call.url).toBe(`${service.url}/attach/${id.id}/section/${sectionId}`);
  });

  // проверяет, что generateLifecycleGroupDecisionDocument делегирует вызов в DocumentService.generateDocument
  it('generateLifecycleGroupDecisionDocument should call documentService.generateDocument', () => {
    const id: IdDto = { id: 2 } as IdDto;
    const form = { field: 'value' };

    service.generateLifecycleGroupDecisionDocument(id, form).subscribe?.(() => {});

    expect(documentService.generateDocumentCalls.length).toBe(1);
    const call = documentService.generateDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/generate/${id.id}/decision`);
    expect(call.form).toBe(form);
  });

  // проверяет, что deleteLifecycleGroupDecisionDocument делегирует удаление документа в DocumentService.deleteDocument
  it('deleteLifecycleGroupDecisionDocument should call documentService.deleteDocument with correct url', () => {
    const id: IdDto = { id: 3 } as IdDto;
    const doc = { id: 100 } as DocumentDto;
    let deleted = false;

    service.deleteLifecycleGroupDecisionDocument(doc, id, () => deleted = true);

    expect(documentService.deleteDocumentCalls.length).toBe(1);
    const call = documentService.deleteDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/delete/${id.id}/decision`);
    expect(call.doc).toBe(doc);
    expect(deleted).toBeTrue();
  });

  // проверяет, что returnToGknt вызывает postBlock с правильным URL и телом формы
  it('returnToGknt should call postBlock with correct url and form content', () => {
    const id: IdDto = { id: 4 } as IdDto;
    // для целей теста структура формы не важна, поэтому приводим пустой объект через unknown
    const form = {} as unknown as ReturnFromCouncilWithoutExpertiseFormContent;

    service.returnToGknt(id, form).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/return/${id.id}`);
    expect(call.body).toBe(form);
  });

  // проверяет, что saveAnswerForBureauRemarks отправляет POST-запрос на /save-answer-for-remark
  it('saveAnswerForBureauRemarks should call postBlock with /save-answer-for-remark', () => {
    const group = {} as LifecycleGroupDto;

    service.saveAnswerForBureauRemarks(group).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/save-answer-for-remark`);
    expect(call.body).toBe(group);
  });

  // проверяет, что replyForBureauRemark отправляет POST-запрос на /reply-for-remark
  it('replyForBureauRemark should call postBlock with /reply-for-remark', () => {
    const group = {} as LifecycleGroupDto;

    service.replyForBureauRemark(group).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/reply-for-remark`);
    expect(call.body).toBe(group);
  });

  // проверяет, что getDraft делает GET-запрос на /get-conclusion-draft/{id}
  it('getDraft should call getBlock with /get-conclusion-draft/{id}', () => {
    const id: IdDto = { id: 6 } as IdDto;

    service.getDraft(id).subscribe?.(() => {});

    expect(http.getBlockCalls.length).toBe(1);
    const call = http.getBlockCalls[0];
    expect(call.url).toBe(`${service.url}/get-conclusion-draft/${id.id}`);
  });

  // проверяет, что saveDraft отправляет POST-запрос на /save-conclusion-draft/{id} с телом драфта
  it('saveDraft should call post with /save-conclusion-draft/{id}', () => {
    const id: IdDto = { id: 7 } as IdDto;
    const draft: any = { data: 'draft' };

    service.saveDraft(id, draft).subscribe?.(() => {});

    expect(http.postCalls.length).toBe(1);
    const call = http.postCalls[0];
    expect(call.url).toBe(`${service.url}/save-conclusion-draft/${id.id}`);
    expect(call.body).toBe(draft);
  });
});
