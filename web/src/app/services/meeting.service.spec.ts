import { MeetingService } from './meeting.service';
import { IdDto } from '@app/dto/IdDto';
import { SearchPageRequest } from '@app/components/common-components/page-and-filter/model/SearchPageRequest';
import { MeetingPostDto } from '@app/dto/MeetingPostDto';
import { RemarksContainerDto } from '@app/dto/RemarksContainerDto';
import { DocumentDto } from '@app/dto/DocumentDto';

class HttpClientSecureMock {
  postCalls: any[] = [];
  getBlockCalls: any[] = [];
  postBlockCalls: any[] = [];
  putBlockCalls: any[] = [];

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
}

class AuthServiceMock {
  role = 'TEST_ROLE';
  getCurrRole() {
    return this.role;
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

describe('MeetingService', () => {
  let service: MeetingService;
  let http: HttpClientSecureMock;
  let auth: AuthServiceMock;
  let documentService: DocumentServiceMock;

  beforeEach(() => {
    http = new HttpClientSecureMock();
    auth = new AuthServiceMock();
    documentService = new DocumentServiceMock();
    service = new MeetingService(http as any, auth as any, documentService as any);
  });

  // проверяет, что сервис успешно создаётся
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // проверяет, что getPage отправляет POST-запрос с корректным URL и телом
  it('getPage should call http.post with role in url', () => {
    const req = {} as SearchPageRequest;
    service.getPage(req);

    expect(http.postCalls.length).toBe(1);
    const call = http.postCalls[0];
    expect(call.url).toContain('/meeting/get/');
    expect(call.url).toContain(auth.role);
    expect(call.body).toBe(req);
  });

  // проверяет, что finishMeeting вызывает postBlock с URL, содержащим id заседания и роль
  it('finishMeeting should use postBlock with role in url', () => {
    const id: IdDto = { id: 123 } as IdDto;
    service.finishMeeting(id).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBe(1);
    const call = http.postBlockCalls[0];
    expect(call.url).toBe(`${service.url}/finish/${id.id}/${auth.role}`);
  });

  // проверяет, что createMeeting вызывает putBlock с корректным URL и телом meeting
  it('createMeeting should call putBlock with correct url', () => {
    const meeting = {} as MeetingPostDto;
    service.createMeeting(meeting).subscribe?.(() => {});

    expect(http.putBlockCalls.length).toBe(1);
    const call = http.putBlockCalls[0];
    expect(call.url).toBe(`${service.url}/create/${auth.role}`);
    expect(call.body).toBe(meeting);
  });

  // проверяет, что editMeeting вызывает postBlock с корректным URL и телом meeting
  it('editMeeting should call postBlock with correct url', () => {
    const meeting = {} as MeetingPostDto;
    service.editMeeting(meeting).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/edit/${auth.role}`);
    expect(call.body).toBe(meeting);
  });

  // проверяет, что getRemarks вызывает postBlock по адресу /get-remarks с переданным контейнером
  it('getRemarks should call postBlock with /get-remarks', () => {
    const container = {} as RemarksContainerDto;
    service.getRemarks(container).subscribe?.(() => {});

    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/get-remarks`);
    expect(call.body).toBe(container);
  });

  // проверяет, что generateCouncilMeetingProtocol делегирует вызов в documentService.generateDocument с корректным URL
  it('generateCouncilMeetingProtocol should call documentService.generateDocument', () => {
    const id: IdDto = { id: 5 } as IdDto;
    const form: any = { field: 'value' };

    service.generateCouncilMeetingProtocol(id, form).subscribe?.(() => {});

    expect(documentService.generateDocumentCalls.length).toBe(1);
    const call = documentService.generateDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/generate/${id.id}/protocol`);
    expect(call.form).toBe(form);
  });

  // проверяет, что deleteMeetingProtocol удаляет документ через documentService и вызывает onDelete
  it('deleteMeetingProtocol should call documentService.deleteDocument with correct url', () => {
    const id: IdDto = { id: 7 } as IdDto;
    const doc = { id: 10 } as DocumentDto;
    let deleted = false;

    service.deleteMeetingProtocol(doc, id, () => deleted = true);

    expect(documentService.deleteDocumentCalls.length).toBe(1);
    const call = documentService.deleteDocumentCalls[0];
    expect(call.url).toBe(`${service.url}/delete/${id.id}/protocol`);
    expect(call.doc).toBe(doc);
    expect(deleted).toBeTrue();
  });

  // проверяет, что saveSectionRemarks отправляет POST-запрос на /save-section-remarks с контейнером замечаний
  it('saveSectionRemarks should call postBlock with /save-section-remarks', () => {
    const container = {} as RemarksContainerDto;

    service.saveSectionRemarks(container).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/save-section-remarks`);
    expect(call.body).toBe(container);
  });

  // проверяет, что saveBureauRemarks отправляет POST-запрос на /save-bureau-remarks с контейнером замечаний бюро
  it('saveBureauRemarks should call postBlock with /save-bureau-remarks', () => {
    const container = {} as RemarksContainerDto;

    service.saveBureauRemarks(container).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/save-bureau-remarks`);
    expect(call.body).toBe(container);
  });

  // проверяет, что rescheduleSectionMeeting отправляет POST-запрос на /reschedule-section с контейнером и возвращает Observable заседания
  it('rescheduleSectionMeeting should call postBlock with /reschedule-section', () => {
    const container = {} as RemarksContainerDto;

    service.rescheduleSectionMeeting(container).subscribe?.(() => {});

    expect(http.postBlockCalls.length).toBeGreaterThan(0);
    const call = http.postBlockCalls[http.postBlockCalls.length - 1];
    expect(call.url).toBe(`${service.url}/reschedule-section`);
    expect(call.body).toBe(container);
  });
});
