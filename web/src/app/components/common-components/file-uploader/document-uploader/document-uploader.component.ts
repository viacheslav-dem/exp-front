import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, input, output, signal, viewChild} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {ModalComponent} from "app/components/common-components/modal/modal.component";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";
import {getBasename, removeFileSuffix} from "app/support/utils";
import {IdDto} from "@app/dto/IdDto";
import { HttpBackend } from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {ChooseFilesComponent} from "@app/components/common-components/file-uploader/choose-files/choose-files.component";
import {isZipFile} from "@app/components/common-components/file-uploader/doc-type";
import {validateFilesForUpload} from "@app/components/common-components/file-uploader/file-upload-validator";

@Component({
    selector: 'app-document-uploader',
    templateUrl: 'document-uploader.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DocumentUploaderComponent extends UploadHelper {

  fileName: string;
  fileDescription: string;
  readonly isDragOver = signal(false);
  /** true с момента нажатия «Загрузить» до завершения (успех/ошибка). */
  readonly uploadInProgress = signal(false);

  readonly url = input<string>(undefined);
  readonly idDto = input<IdDto>(undefined);
  readonly typesAccept = input<string>(undefined);
  /** Если true, после выбора файла загрузка стартует сразу без модалки (название — из имени файла, описание — пустое). */
  readonly uploadWithoutModal = input<boolean>(false);
  readonly saved = output<any>();

  readonly fileLoaderModal = viewChild<ModalComponent>('fileLoaderModal');
  readonly chooseFilesComponent = viewChild(ChooseFilesComponent);

  constructor(
    private _toasty: GlobalToastyService,
    protected _authService: AuthService,
    httpBackend: HttpBackend,
    private cdr: ChangeDetectorRef,
    destroyRef: DestroyRef
  ) {
    super(_authService, httpBackend, destroyRef);
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

  ngOnInit() {
    super.ngOnInit();
    this.onProgress = (_item: any, progress: number) => {
      this.progressValue = progress;
      this.cdr.markForCheck();
    };
    this.onSuccess = (item: any, response: string) => {
      this.uploadInProgress.set(false);
      if (!this.uploadWithoutModal()) this.fileLoaderModal()?.hide();
      this._toasty.success("Файл успешно загружен.");
      this.saved.emit(JSON.parse(response));
      this.cdr.markForCheck();
    };
    this.onError = (item: any, response: string, status: number) => {
      this.uploadInProgress.set(false);
      if (!this.uploadWithoutModal()) this.fileLoaderModal()?.hide();
      const noServerMessage = status === 0 || !(response && response.trim());
      if (noServerMessage && this.file && this.file.size > (isZipFile(this.file) ? 50 : 10) * 1024 * 1024) {
        response = isZipFile(this.file)
          ? 'Загрузка была прервана. Возможно, архив превышает разрешённый размер в 50 Мб'
          : 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 10 Мб';
      }
      this._toasty.err(status, response);
      this.cdr.markForCheck();
    };
  }

  onFilesChosen(files: File[]) {
    if (!files?.length) return;
    const result = validateFilesForUpload(files, this.typesAccept());
    if (!result.valid) {
      this._toasty.err(400, result.message);
      this.cdr.markForCheck();
      return;
    }
    this.file = files[0];
    this.fileName = removeFileSuffix(getBasename(this.file.name));
    this.fileDescription = null;
    this.progressValue = 0;
    if (this.uploadWithoutModal()) {
      this.saveFile();
      return;
    }
    this.fileLoaderModal()?.show();
    this.cdr.markForCheck();
  }

  getUrl() {
    return `${this.url()}?id=${this.idDto().id}&name=${encodeURIComponent(this.fileName)}`
      + `&description=${this.fileDescription ? encodeURIComponent(this.fileDescription) : ''}`;
  }

  saveFile() {
    this.uploadInProgress.set(true);
    this.progressValue = 0;
    this.cdr.markForCheck();
    super.saveFile();
  }

  openFileDialog() {
    this.chooseFilesComponent()?.fileInput()?.nativeElement?.click();
  }

}
