import {ChangeDetectionStrategy, Component, DestroyRef, input, output, signal} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";
import {validateFilesForUpload} from "@app/components/common-components/file-uploader/file-upload-validator";
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
  readonly isDragOver = signal(false);

  constructor(
    private _toasty: GlobalToastyService,
    protected _authService: AuthService,
    protected _http: HttpBackend,
    destroyRef: DestroyRef
  ) {
    super(_authService, _http, destroyRef);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onSuccess = (item: any, response: string) => {
      this._toasty.success("Файл успешно загружен.");
      let parsed: any = null;
      try {
        parsed = response ? JSON.parse(response) : null;
      } catch {
        parsed = response;
      }
      this.saved.emit(parsed);
    };
    this.onError = (item: any, response: string, status: number) => {
      if (status == 0) {
        response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 100 Мб';
      }
      this._toasty.err(status, response);
    };
  }

  getUrl() {
    return this.url();
  }

  onFilesChosen(files: File[]) {
    if (!files?.length) return;
    const result = validateFilesForUpload(files, this.typesAccept());
    if (!result.valid) {
      this._toasty.err(400, result.message);
      return;
    }
    this.file = files[0];
    this.progressValue = 0;
    this._toasty.info("Загрузка файла началась.");
    this.saveFile();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) {
      this.onFilesChosen(Array.from(files) as File[]);
    }
  }
}
