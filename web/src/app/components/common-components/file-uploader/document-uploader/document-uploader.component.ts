import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, input, output, signal, viewChild} from "@angular/core";
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
import {validateFilesForUpload, MAX_SINGLE_MB, MAX_ZIP_MB} from "@app/components/common-components/file-uploader/file-upload-validator";

export interface FileQueueItem {
  file: File;
  fileName: string;
  fileDescription: string;
}

@Component({
    selector: 'app-document-uploader',
    templateUrl: 'document-uploader.component.html',
    styleUrls: ['document-uploader.component.scss'],
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
  /** Прогресс загрузки текущего файла (0–100) для шаблона — signal для OnPush. */
  readonly progressValueDisplay = signal(0);
  /** Очередь файлов с редактируемыми названием и описанием для каждого. */
  private filesQueue: FileQueueItem[] = [];
  private currentFileIndex = 0;
  /** Размер очереди (для отображения «Файл X из Y»). */
  readonly uploadQueueSize = signal(0);
  readonly uploadQueueIndex = signal(0);

  readonly url = input<string>(undefined);
  readonly idDto = input<IdDto>(undefined);
  readonly typesAccept = input<string>(undefined);
  /** Если true, после выбора файла загрузка стартует сразу без модалки (название — из имени файла, описание — пустое). */
  readonly uploadWithoutModal = input<boolean>(false);
  readonly saved = output<any>();

  readonly fileLoaderModal = viewChild<ModalComponent>('fileLoaderModal');
  readonly chooseFilesComponent = viewChild(ChooseFilesComponent);

  private readonly _toasty = inject(GlobalToastyService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    protected _authService: AuthService,
    httpBackend: HttpBackend,
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
    if (this.uploadInProgress()) return;
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) {
      const arr = Array.from(files) as File[];
      this.onFilesChosen(this.uploadWithoutModal() ? [arr[0]] : arr);
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.onProgress = (_item: unknown, progress: number) => {
      this.progressValue = progress;
      this.progressValueDisplay.set(progress);
    };
    this.onSuccess = (item: unknown, response: string) => this.handleUploadSuccess(item, response);
    this.onError = (item: unknown, response: string, status: number) => this.handleUploadError(item, response, status);
  }

  onFilesChosen(files: FileList | File[]) {
    if (this.uploadInProgress()) return;
    const arr = Array.isArray(files) ? files : (files ? Array.from(files) : []);
    if (!arr.length) return;
    const result = validateFilesForUpload(arr, this.typesAccept());
    if (!result.valid) {
      this._toasty.err(400, result.message);
      this.cdr.markForCheck();
      return;
    }
    const filesToUse = this.uploadWithoutModal() ? [arr[0]] : arr.slice();
    this.filesQueue = filesToUse.map((file) => ({
      file,
      fileName: removeFileSuffix(getBasename(file.name)),
      fileDescription: '',
    }));
    this.currentFileIndex = 0;
    this.uploadQueueSize.set(this.filesQueue.length);
    this.uploadQueueIndex.set(0);
    const first = this.filesQueue[0];
    this.file = first.file;
    this.fileName = first.fileName;
    this.fileDescription = first.fileDescription;
    this.resetProgress();
    if (this.uploadWithoutModal()) {
      this.uploadNextInQueue();
      return;
    }
    this.fileLoaderModal()?.show();
    this.cdr.markForCheck();
  }

  /** Загружает следующий файл из очереди (вызывается после успеха или при старте). */
  uploadNextInQueue(): void {
    if (this.currentFileIndex >= this.filesQueue.length) {
      this.clearQueueAndReset();
      return;
    }
    const item = this.filesQueue[this.currentFileIndex];
    this.file = item.file;
    this.fileName = item.fileName;
    this.fileDescription = item.fileDescription ?? '';
    this.uploadQueueIndex.set(this.currentFileIndex);
    this.uploadInProgress.set(true);
    this.resetProgress();
    this.cdr.markForCheck();
    super.saveFile();
  }

  getUrl() {
    return `${this.url()}?id=${this.idDto().id}&name=${encodeURIComponent(this.fileName)}`
      + `&description=${this.fileDescription ? encodeURIComponent(this.fileDescription) : ''}`;
  }

  saveFile() {
    if (this.filesQueue.length > 0) {
      this.uploadNextInQueue();
      return;
    }
    this.uploadInProgress.set(true);
    this.resetProgress();
    this.cdr.markForCheck();
    super.saveFile();
  }

  openFileDialog() {
    this.chooseFilesComponent()?.fileInput()?.nativeElement?.click();
  }

  /** Элементы очереди для отображения в модалке (название/описание редактируются). */
  get queueItems(): FileQueueItem[] {
    return this.filesQueue;
  }

  /** Сбрасывает очередь, прогресс и при необходимости закрывает модалку. */
  private clearQueueAndReset(): void {
    this.uploadInProgress.set(false);
    this.filesQueue = [];
    this.uploadQueueSize.set(0);
    this.uploadQueueIndex.set(0);
    if (!this.uploadWithoutModal()) this.fileLoaderModal()?.hide();
    this.cdr.markForCheck();
  }

  private resetProgress(): void {
    this.progressValue = 0;
    this.progressValueDisplay.set(0);
  }

  private handleUploadSuccess(_item: unknown, response: string): void {
    this.currentFileIndex++;
    if (this.currentFileIndex < this.filesQueue.length) {
      this.uploadNextInQueue();
    } else {
      this.clearQueueAndReset();
    }
    this._toasty.success("Файл успешно загружен.");
    try {
      this.saved.emit(JSON.parse(response));
    } catch {
      this.saved.emit(null);
    }
    this.cdr.markForCheck();
  }

  private handleUploadError(_item: unknown, response: string, status: number): void {
    this.clearQueueAndReset();
    const noServerMessage = status === 0 || !(response && response.trim());
    const maxMb = this.file && isZipFile(this.file) ? MAX_ZIP_MB : MAX_SINGLE_MB;
    if (noServerMessage && this.file && this.file.size > maxMb * 1024 * 1024) {
      const msg = isZipFile(this.file)
        ? `Загрузка была прервана. Возможно, архив превышает разрешённый размер в ${MAX_ZIP_MB} Мб`
        : `Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в ${MAX_SINGLE_MB} Мб`;
      this._toasty.err(status, msg);
    } else {
      this._toasty.err(status, response);
    }
    this.cdr.markForCheck();
  }
}
