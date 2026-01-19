import {ChangeDetectionStrategy, ChangeDetectorRef, Component, input, output} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";
import { HttpBackend } from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-silent-file-uploader',
    templateUrl: 'silent-file-uploader.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class SilentFileUploaderComponent extends UploadHelper {

  readonly url = input(undefined);
  readonly typesAccept = input<string>(undefined);
  readonly controlClass = input<any>(undefined);
  readonly saved = output<any>();
  isDragOver: boolean = false;

  constructor(private _toasty: GlobalToastyService,
              protected _authService: AuthService,
              protected _http: HttpBackend,
              private cdr: ChangeDetectorRef) {
    super(_authService, _http);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onSuccess = (item: any, response: string) => {
      this._toasty.success("Файл успешно загружен.");
      // Бэкенд может вернуть не-JSON (например, пустое тело/строку).
      // В проде это не должно ломать UX и "съедать" показ уведомления.
      let parsed: any = null;
      try {
        parsed = response ? JSON.parse(response) : null;
      } catch {
        parsed = response;
      }
      this.saved.emit(parsed);
      this.cdr.markForCheck();
    };
    this.onError = (item: any, response: string, status: number) => {
      if (status == 0) {
        response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 100 Мб';
      }
      this._toasty.err(status, response);
      this.cdr.markForCheck();
    };
  }

  getUrl() {
    return this.url();
  }

  onFilesChosen(files: File[]) {
    this.file = files[0];
    this.progressValue = 0;
    this._toasty.info("Загрузка файла началась.");
    this.saveFile();
    this.cdr.markForCheck();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
    this.cdr.markForCheck();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    this.cdr.markForCheck();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    this.cdr.markForCheck();
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) {
      this.onFilesChosen(Array.from(files) as File[]);
    }
  }
}
