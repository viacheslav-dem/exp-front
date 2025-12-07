import { ProjectService } from './project.service';
import { AuthService } from '@app/services/auth.service';
import { HttpClientSecure } from '@app/services/http.client';
import { DocumentService } from '@app/services/document.service';
import { IdDto } from '@app/dto/IdDto';
import { ProjectDto } from '@app/dto/ProjectDto';
import { ProjectLiDto } from '@app/dto/ProjectLiDto';
import { SearchPageRequest } from '@app/components/common-components/page-and-filter/model/SearchPageRequest';
import { DocumentDto } from '@app/dto/DocumentDto';

class AuthServiceMock {
  role = 'EXPERT';
  getCurrRole() {
    return this.role;
  }
}

class HttpClientSecureMock {
  postCalls: any[] = [];
  getBlockCalls: any[] = [];
  postBlockCalls: any[] = [];
  putBlockCalls: any[] = [];
  getCalls: any[] = [];

  post(url: string, body?: any, options?: any) {
    this.postCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }

  getBlock(url: string, options?: any) {
    this.getBlockCalls.push({ url, options });
    return { subscribe() {} } as any;
  }

  postBlock(url: string, body?: any, options?: any) {
    this.postBlockCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }

  putBlock(url: string, body?: any, options?: any) {
    this.putBlockCalls.push({ url, body, options });
    return { subscribe() {} } as any;
  }

  get(url: string, options?: any) {
    this.getCalls.push({ url, options });
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

describe('ProjectService', () => {
  let service: ProjectService;
  let auth: AuthServiceMock;
  let http: HttpClientSecureMock;
  let documentService: DocumentServiceMock;

  beforeEach(() => {
    auth = new AuthServiceMock();
    http = new HttpClientSecureMock();
    documentService = new DocumentServiceMock();
    service = new ProjectService(auth as any, http as any, documentService as any);
  });

  // проверяет, что сервис успешно создаётся
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // проверяет, что getMessagesByRole для роли EXPERT возвращает набор сообщений (термов)
  it('getMessagesByRole should return ExpertReviewTermsMessages for EXPERT', () => {
    auth.role = 'EXPERT';
    const result = service.getMessagesByRole();

    // Должен быть не пустым объектом/значением
    expect(result).toBeTruthy();
  });

  // проверяет, что prepareProject вызывает унаследованный метод prepare с нужными сообщениями
  it('prepareProject should delegate to base prepare with messages', () => {
    const project = {} as ProjectDto;
    const spy = spyOn<any>(service, 'prepare').and.callThrough();

    service.prepareProject(project as any);

    expect(spy).toHaveBeenCalled();
  });

  // проверяет, что getPage отправляет POST-запрос на /project/get с телом запроса
  it('getPage should call http.post with /project/get', () => {
    const req = {} as SearchPageRequest;
    service.getPage(req);

    expect(http.postCalls.length).toBe(1);
    const call = http.postCalls[0];
    expect(call.url).toContain('/project/get');
    expect(call.body).toBe(req);
  });

  // проверяет, что getProject делает GET-запрос с блокировкой на /get/{id}
  it('getProject should call getBlock with correct url', () => {
    const id: IdDto = { id: 10 } as IdDto;
    service.getProject(id).subscribe?.(() => {});

    expect(http.getBlockCalls.length).toBe(1);
    const call = http.getBlockCalls[0];
    expect(call.url).toBe(`${service.url}/get/${id.id}`);
  });

  // проверяет, что createProject вызывает putBlock на /create с телом проекта
  it('createProject should call putBlock with /create', () => {
    const project = {} as ProjectDto;
    service.createProject(project).subscribe?.(() => {});

    expect(http.putBlockCalls.length).toBe(1);
    const call = http.putBlockCalls[0];
    expect(call.url).toBe(`${service.url}/create`);
    expect(call.body).toBe(project);
  });

  // проверяет, что updateProject вызывает postBlock на /update/{id} с телом проекта
  it('updateProject should call postBlock with /update/{id}', () => {
    const id: IdDto = { id: 15 } as IdDto;
    const project = {} as ProjectDto;
    service.updateProject(id, project).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBe(1);
    const call = http.postBlockCalls[0];
    expect(call.url).toBe(`${service.url}/update/${id.id}`);
    expect(call.body).toBe(project);
  });

  // проверяет, что deleteDocument вызывает documentService.deleteDocument с корректным URL и вызывает onDelete
  it('deleteDocument should call documentService.deleteDocument with correct url', () => {
    const id: IdDto = { id: 20 } as IdDto;
    const doc = { id: 100 } as DocumentDto;
    let deleted = false;

    service.deleteDocument(id, doc, () => deleted = true);

    expect(documentService.deleteDocumentCalls.length).toBe(1);
    const call = documentService.deleteDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/delete/${id.id}/document/${doc.id}`);
    expect(call.doc).toBe(doc);
    expect(deleted).toBeTrue();
  });
});
