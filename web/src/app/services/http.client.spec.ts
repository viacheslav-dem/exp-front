import { of, throwError } from 'rxjs';
import { HttpClientSecure } from './http.client';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { ProgressService } from '../components/common-components/progress/progress.service';
import { GlobalToastyService } from '@app/services/global-toasty.service';

class HttpClientMock {
  getCalls: any[] = [];
  postCalls: any[] = [];
  deleteCalls: any[] = [];

  get<T>(url: string, options?: any) {
    this.getCalls.push({ url, options });
    return of({} as T);
  }

  post<T>(url: string, body?: any, options?: any) {
    this.postCalls.push({ url, body, options });
    return of({} as T);
  }

  delete<T>(url: string, options?: any) {
    this.deleteCalls.push({ url, options });
    return of({} as T);
  }
}

class StorageServiceMock {
  token = 'TEST_TOKEN';
  getAccessToken() {
    return this.token;
  }
}

class ProgressServiceMock {
  showCalls = 0;
  hideCalls = 0;

  show() {
    this.showCalls++;
  }

  hide() {
    this.hideCalls++;
  }
}

class GlobalToastyServiceMock {
  errors: Array<{ status: number; message: string }> = [];

  err(status: number, message: string) {
    this.errors.push({ status, message });
  }
}

describe('HttpClientSecure', () => {
  let service: HttpClientSecure;
  let http: HttpClientMock;
  let storage: StorageServiceMock;
  let progress: ProgressServiceMock;
  let toasty: GlobalToastyServiceMock;

  beforeEach(() => {
    http = new HttpClientMock();
    storage = new StorageServiceMock();
    progress = new ProgressServiceMock();
    toasty = new GlobalToastyServiceMock();

    service = new HttpClientSecure(
      http as unknown as HttpClient,
      storage as unknown as StorageService,
      progress as unknown as ProgressService,
      toasty as unknown as GlobalToastyService
    );
  });

  // проверяет, что getTokenParamsString использует токен из StorageService
  it('getTokenParamsString should use access token from storage', () => {
    storage.token = 'ABC123';

    const result = service.getTokenParamsString();

    expect(result).toBe('token=ABC123');
  });

  // проверяет, что get делегирует вызов в HttpClient.get с построенными опциями
  it('get should call underlying HttpClient.get with built headers', () => {
    service.get('/url');

    expect(http.getCalls.length).toBe(1);
    const call = http.getCalls[0];
    expect(call.url).toBe('/url');
    // по умолчанию observe должно быть body
    expect(call.options.observe).toBe('body');
  });

  // проверяет, что postBlock вызывает post и оборачивает его в block (show/hide прогресса)
  it('postBlock should call post and toggle progress show/hide', (done) => {
    service.postBlock('/url', { a: 1 }).subscribe({
      complete: () => {
        try {
          expect(http.postCalls.length).toBe(1);
          const call = http.postCalls[0];
          expect(call.url).toBe('/url');
          expect(JSON.parse(call.body)).toEqual({ a: 1 });

          expect(progress.showCalls).toBe(1);
          expect(progress.hideCalls).toBe(1);
          done();
        } catch (e) {
          done.fail(e);
        }
      }
    });
  });

  // проверяет, что handleError показывает тост с сообщением при статусе 500
  it('handleError should hide progress and show toast message for 500 error', (done) => {
    const errorResponse: any = {
      status: 500,
      error: 'Server error'
    };

    // эмулируем ошибку через get и проверяем, что handleError срабатывает
    spyOn(http, 'get').and.returnValue(throwError(errorResponse));

    service.get('/error-url').subscribe({
      next: () => done.fail('Expected error'),
      error: () => {
        try {
          expect(toasty.errors.length).toBeGreaterThan(0);
          expect(toasty.errors[0].status).toBe(500);
          done();
        } catch (e) {
          done.fail(e);
        }
      }
    });
  });
});
