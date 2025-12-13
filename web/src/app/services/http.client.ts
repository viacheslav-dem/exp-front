import {Observable, throwError as observableThrowError} from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {ProgressService} from "../components/common-components/progress/progress.service";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import {GlobalToastyService} from "@app/services/global-toasty.service";

type HttpRequestOptions = {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

@Injectable()
export class HttpClientSecure {

  debug: boolean = false;

  constructor(private http: HttpClient,
              private storage: StorageService,
              private progress: ProgressService,
              private toasty: GlobalToastyService) {
  }

  getTokenParamsString() {
    return `token=${this.storage.getAccessToken()}`;
  }

  buildHeaders(options: any): HttpRequestOptions {
    if (options == null) options = {};
    if (options.observe == null)
      options.observe = 'body';
    
    // Преобразуем числовые параметры в строки для корректной передачи в query string
    if (options.params && typeof options.params === 'object' && !(options.params instanceof HttpParams)) {
      const paramsObj: any = {};
      for (const key in options.params) {
        if (options.params.hasOwnProperty(key)) {
          const value = options.params[key];
          // Преобразуем числа и другие примитивы в строки
          paramsObj[key] = value != null ? String(value) : value;
        }
      }
      options.params = paramsObj;
    }
    
    return options;
  }

  log(type: string, url: string, body: any, options: any, res: any) {
    if (!this.debug) return;
    let request: any = {};
    request.type = type;
    request.url = url;
    request.options = options;
    request.requestBody = body;
    request.response = res;
    console.log(request);
  }

  handleError(err: HttpErrorResponse) {
    // Игнорируем ошибки для определенных URL (например, когда отсутствие ресурса - нормальная ситуация)
    const ignoredUrls = [
      '/get/meth_rec',
      '/system-notification/get'
    ];
    const shouldIgnore = err.url && ignoredUrls.some(url => err.url.includes(url));
    if (shouldIgnore && err.status === 404) {
      // Не показываем ошибку для игнорируемых URL при 404
      return observableThrowError(err);
    }
    
    if (err.status == 412) {
      this.toasty.err(err.status, "Время сессии истекло. Пожалуйста, повторите вход.");
      this.progress.hide();
    } else if (err.status == 403) {
      this.toasty.err(err.status, "Доступ запрещён.");
    } else if (err.status == 400) {
      const errorMessage = err.error && typeof err.error === 'string' ? err.error : 
                          (err.error && err.error.message ? err.error.message : "Неверный запрос. Проверьте корректность данных.");
      this.toasty.err(err.status, "Ошибка в данных: " + errorMessage);
    } else if (err.status > 400 && err.status < 500 && err.status != 412 && err.status != 403) {
      let errorMessage = "Неверный запрос";
      if (err.error) {
        if (typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.error.message) {
          errorMessage = err.error.message;
        } else if (typeof err.error === 'object') {
          errorMessage = JSON.stringify(err.error);
        }
      }
      this.toasty.err(err.status, "Ошибка в данных: " + errorMessage);
    } else if (err.status == 500) {
      this.toasty.err(err.status, "Ошибка на сервере. Пожалуйста, обратитесь к администратору.");
    } else if (err.status > 500) {
      this.toasty.err(err.status, "Сервер недоступен. Пожалуйста, попробуйте позже.");
    } else {
      this.toasty.err(err.status, err.error || "Произошла ошибка");
    }
    return observableThrowError(err);
  }

  get<T>(url: string, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    return this.http.get<T>(url, opts).pipe(
      tap(res => this.log('get', url, null, opts, res)),
      catchError(err => {
        // Игнорируем 404 для определенных URL перед обработкой ошибки
        const ignoredUrls = ['/get/meth_rec', '/system-notification/get'];
        if (err.status === 404 && err.url && ignoredUrls.some(ignoredUrl => err.url.includes(ignoredUrl))) {
          // Не обрабатываем ошибку, просто пробрасываем дальше
          return observableThrowError(err);
        }
        return this.handleError(err);
      }));
  }

  post<T>(url: string, body: any, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    
    // Устанавливаем Content-Type для POST запросов с JSON телом
    let headers: HttpHeaders;
    if (opts.headers instanceof HttpHeaders) {
      headers = opts.headers;
    } else if (opts.headers && typeof opts.headers === 'object') {
      headers = new HttpHeaders(opts.headers);
    } else {
      headers = new HttpHeaders();
    }
    
    // Устанавливаем Content-Type только если он еще не установлен
    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    
    opts.headers = headers;
    
    // Не обрабатываем ошибки для запросов на refresh-token, чтобы они обрабатывались в interceptor'е
    const isRefreshTokenRequest = url.toLowerCase().includes('/refresh-token');
    
    return this.http.post<T>(url, body == null ? "" : JSON.stringify(body), opts).pipe(
      tap(res => this.log('post', url, body, opts, res)),
      catchError(err => {
        // Для refresh-token запросов не обрабатываем ошибки здесь, чтобы они обрабатывались в interceptor'е
        if (isRefreshTokenRequest) {
          return observableThrowError(err);
        }
        return this.handleError(err);
      }),);
  }

  put<T>(url: string, body: any, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    return this.http.put<T>(url, JSON.stringify(body), opts).pipe(
      tap(res => this.log('put', url, body, opts, res)),
      catchError(err => this.handleError(err)),);
  }

  options<T>(url: string, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    return this.http.options<T>(url, opts).pipe(
        tap(res => this.log('options', url, 'no body', opts, res)),
        catchError(err => this.handleError(err)),);
  }

  delete<T>(url: string, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    return this.http.delete<T>(url, opts).pipe(
      tap(res => this.log('delete', url, null, opts, res)),
      catchError(err => this.handleError(err)),);
  }

  getBlock<T>(url: string, options?: any): Observable<T> {
    return this.block(this.get<T>(url, options));
  }

  postBlock<T>(url: string, body: any, options?: any): Observable<T> {
    return this.block(this.post<T>(url, body, options));
  }

  putBlock<T>(url: string, body: any, options?: any): Observable<T> {
    return this.block(this.put<T>(url, body, options));
  }

  deleteBlock<T>(url: string, options?: any): Observable<T> {
    return this.block(this.delete<T>(url, options));
  }

  block<T>(observable: Observable<T>): Observable<T> {
    this.progress.show();
    return observable.pipe(
      tap(() => this.progress.hide()),
      catchError(err => {
        this.progress.hide();
        return observableThrowError(err);
      }),);
  }
}
