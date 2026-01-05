import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild, input} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {ModalComponent} from "app/components/common-components/modal/modal.component";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";
import {removeFileSuffix} from "app/support/utils";
import {IdDto} from "@app/dto/IdDto";
import { HttpBackend } from "@angular/common/http";
import {environment} from "../../../../../environments/environment";

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
  isDragOver: boolean = false;

  readonly url = input<string>(undefined);
  readonly idDto = input<IdDto>(undefined);
  readonly typesAccept = input<string>(undefined);
  @Output() saved = new EventEmitter();

  @ViewChild('fileLoaderModal') fileLoaderModal: ModalComponent;

  constructor(private _toasty: GlobalToastyService,
              protected _authService: AuthService,
              httpBackend: HttpBackend,
              private cdr: ChangeDetectorRef) {
    super(_authService, httpBackend);
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

  ngOnInit() {
    super.ngOnInit();
    this.onSuccess = (item: any, response: string) => {
      this.fileLoaderModal.hide();
      this._toasty.success("Файл успешно загружен.");
      this.saved.next(JSON.parse(response));
      // callbacks загрузчика могут приходить вне angular zone/из стороннего кода
      this.cdr.markForCheck();
    };
    this.onError = (item: any, response: string, status: number) => {
      this.fileLoaderModal.hide();
      if (this.file.size > 10485760) {
        response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 10 Мб';
      }
      this._toasty.err(status, response);
      this.cdr.markForCheck();
    };
  }

  onFilesChosen(files: File[]) {
    this.file = files[0];
    if (this.file != null) {
      this.fileName = removeFileSuffix(this.file.name);
      this.fileDescription = null;
      this.progressValue = 0;
      this.fileLoaderModal.show();
      this.cdr.markForCheck();
      this.onError = (item: any, response: string, status: number) => {
        if (this.file.size.valueOf() > 10*1024*1024) {
          response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 10 Мб';
        }
        this.fileLoaderModal.hide();
        this._toasty.err(status, response);
        this.cdr.markForCheck();
      };
    }
  }

  getUrl() {
    return `${this.url()}?id=${this.idDto().id}&name=${encodeURIComponent(this.fileName)}`
      + `&description=${this.fileDescription ? encodeURIComponent(this.fileDescription) : ''}`;
  }

  saveFile() {
    super.saveFile();
  }
}
