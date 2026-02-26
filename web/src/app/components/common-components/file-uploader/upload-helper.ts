import {DestroyRef, Directive, OnInit} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthService} from "@app/services/auth.service";
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpBackend } from "@angular/common/http";

@Directive()
export abstract class UploadHelper implements OnInit {

  progressValue: number = 0;
  file: File;

  protected _httpRaw: HttpClient;

  constructor(
    protected _authService: AuthService,
    httpBackend: HttpBackend,
    protected destroyRef: DestroyRef
  ) {
    this._httpRaw = new HttpClient(httpBackend);
  }

  ngOnInit(): void {
  }

  onSuccess: (item: unknown, response: string) => void = () => {};
  onError: (item: unknown, response: string, status: number) => void = () => {};
  onProgress: (fileItem: unknown, progress: number) => void = (_fileItem: unknown, progress: number) => {
    this.progressValue = progress;
  };

  getOptions() {
    return {};
  }

  abstract getUrl(): string;

  saveFile() {
    if (!this.file) {
      return;
    }

    const url = this.getUrl();
    const formData = new FormData();
    formData.append("file", this.file);

    const extraOptions: any = this.getOptions() || {};
    const extraHeaders = extraOptions.headers || {};

    // ВАЖНО: не задаём Content-Type вручную, чтобы браузер поставил multipart/form-data
    const headers = new HttpHeaders({
      Authorization: this._authService.getToken(),
      ...extraHeaders
    });

    const req = new HttpRequest("POST", url, formData, {
      reportProgress: true,
      headers
    });

    this._httpRaw
      .request(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.onProgress(null, progress);
          }
          if (event.type === HttpEventType.Response) {
            const body =
              typeof event.body === "string"
                ? event.body
                : JSON.stringify(event.body);
            this.onSuccess(null, body);
          }
        },
        error: (err) => {
          const status = err.status;
          let response: string;
          if (typeof err.error === "string") {
            response = err.error;
          } else if (err.error && typeof err.error === "object" && typeof (err.error as { message?: string }).message === "string") {
            response = (err.error as { message: string }).message;
          } else {
            response = err.message || "";
          }
          this.onError(null, response, status);
        },
      });
  }
}