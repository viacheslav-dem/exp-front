import { ExpertReviewService } from './expert-review.service';
import { IdDto } from '@app/dto/IdDto';
import { ExpertReviewDto } from '@app/dto/ExpertReviewDto';
import { ExpertReviewPlainDto } from '@app/dto/ExpertReviewPlainDto';
import { ExpertReviewTermsMessages } from '@app/pipes/review-state.pipe';
import { DocumentDto } from '@app/dto/DocumentDto';
import { PageRequest } from '@app/components/common-components/page-and-filter/model/PageRequest';
import { ExpertPayInfoDto } from '@app/dto/ExpertPayInfoDto';

class AuthServiceMock {
  getCurrRole() {
    return 'EXPERT';
  }
}

class HttpClientSecureMock {
  postCalls: any[] = [];
  postBlockCalls: any[] = [];
  getBlockCalls: any[] = [];

  post(url: string, body?: any, options?: any) {
    this.postCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }

  postBlock(url: string, body?: any, options?: any) {
    this.postBlockCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }

  getBlock(url: string, options?: any) {
    this.getBlockCalls.push({ url, options });
    return { subscribe() {} } as any;
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

describe('ExpertReviewService', () => {
  let service: ExpertReviewService;
  let auth: AuthServiceMock;
  let http: HttpClientSecureMock;
  let documentService: DocumentServiceMock;

  beforeEach(() => {
    auth = new AuthServiceMock();
    http = new HttpClientSecureMock();
    documentService = new DocumentServiceMock();
    service = new ExpertReviewService(auth as any, http as any, documentService as any);
  });

  // проверяет, что сервис успешно создаётся
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // проверяет, что prepareReview вызывает базовый метод prepare с ExpertReviewTermsMessages
  it('prepareReview should delegate to base prepare with ExpertReviewTermsMessages', () => {
    const review = {} as ExpertReviewDto;
    const spy = spyOn<any>(service, 'prepare').and.callThrough();

    service.prepareReview(review);

    expect(spy).toHaveBeenCalledWith(review, ExpertReviewTermsMessages);
  });

  // проверяет, что finishReview отправляет POST-запрос на /finish/{id} без тела
  it('finishReview should call postBlock with /finish/{id}', () => {
    const id: IdDto = { id: 1 } as IdDto;
    service.finishReview(id).subscribe?.(() => {});

    const call = http.postBlockCalls[0];
    expect(call.url).toBe(`${service.url}/finish/${id.id}`);
    expect(call.body).toBeNull();
  });

  // проверяет, что rejectExpert отправляет причину отказа в теле запроса
  it('rejectExpert should send reason in body', () => {
    const id: IdDto = { id: 2 } as IdDto;
    const reason = 'some reason';
    service.rejectExpert(id, reason).subscribe?.(() => {});

    const call = http.postBlockCalls[0];
    expect(call.url).toBe(`${service.url}/reject-expert/${id.id}`);
    expect(call.body).toEqual({ value: reason });
  });

  // проверяет, что generateReviewDocument делегирует вызов в documentService.generateDocument с корректным URL
  it('generateReviewDocument should call documentService.generateDocument', () => {
    const id: IdDto = { id: 3 } as IdDto;
    const form = { field: 'value' };

    service.generateReviewDocument(id, form).subscribe?.(() => {});

    expect(documentService.generateDocumentCalls.length).toBe(1);
    const call = documentService.generateDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/generate/${id.id}/review`);
    expect(call.form).toBe(form);
  });

  // проверяет, что deleteReviewDocument удаляет документ через documentService и вызывает onDelete
  it('deleteReviewDocument should call documentService.deleteDocument with correct url and invoke onDelete', () => {
    const id: IdDto = { id: 4 } as IdDto;
    const doc = { id: 10 } as DocumentDto;
    let deleted = false;

    service.deleteReviewDocument(id, doc, () => deleted = true);

    expect(documentService.deleteDocumentCalls.length).toBe(1);
    const call = documentService.deleteDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/delete/${id.id}/review`);
    expect(call.doc).toBe(doc);
    expect(deleted).toBeTrue();
  });

  // проверяет, что getDraft делает GET-запрос с блокировкой на /get-draft/{id}
  it('getDraft should call http.getBlock with correct url', () => {
    const id: IdDto = { id: 5 } as IdDto;
    service.getDraft(id).subscribe?.(() => {});

    const call = http.getBlockCalls[0];
    expect(call.url).toBe(`${service.url}/get-draft/${id.id}`);
  });

  // проверяет, что getExpertPayInfo отправляет POST-запрос на /get-expert-pay-info/{expertId} с PageRequest в теле
  it('getExpertPayInfo should call postBlock with /get-expert-pay-info/{expertId}', () => {
    const expertId = 7;
    const page = { page: 0, size: 10 } as PageRequest;

    service.getExpertPayInfo(expertId, page).subscribe?.(() => {});

    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/get-expert-pay-info/${expertId}`);
    expect(call.body).toBe(page);
  });
});
