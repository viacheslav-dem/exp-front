import {Observable, throwError as observableThrowError} from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {ProgressService} from "../components/common-components/progress/progress.service";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
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
    if (err.status == 412) {
      this.toasty.err(err.status, "Время сессии истекло. Пожалуйста, повторите вход.");
      this.progress.hide();
    } else if (err.status == 403) {
      this.toasty.err(err.status, "Доступ запрещён.");
    } else if (err.status > 404 && err.status < 500 && err.status != 412) {
      this.toasty.err(err.status, "Ошибка в данных: " + err.error);
    } else if (err.status == 500) {
      this.toasty.err(err.status, "Ошибка на сервере. Пожалуйста, обратитесь к администратору.");
    } else if (err.status > 500) {
      this.toasty.err(err.status, "Сервер недоступен. Пожалуйста, попробуйте позже.");
    } else {
      this.toasty.err(err.status, err.error);
    }
    return observableThrowError(err);
  }

  get<T>(url: string, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    return this.http.get<T>(url, opts).pipe(
      tap(res => this.log('get', url, null, opts, res)),
      catchError(err => this.handleError(err)),);
  }

  post<T>(url: string, body: any, options?: any): Observable<T> {
    let opts = this.buildHeaders(options);
    return this.http.post<T>(url, body == null ? "" : JSON.stringify(body), opts).pipe(
      tap(res => this.log('post', url, body, opts, res)),
      catchError(err => this.handleError(err)),);
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
