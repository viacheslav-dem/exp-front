import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";
import { HttpBackend } from "@angular/common/http";

@Component({
    selector: 'app-silent-file-uploader',
    templateUrl: 'silent-file-uploader.component.html',
    standalone: false
})
export class SilentFileUploaderComponent extends UploadHelper {

  @Input() url;
  @Input() typesAccept: string;
  @Input() controlClass: any;
  @Output() saved = new EventEmitter();
  isDragOver: boolean = false;

  constructor(private _toasty: GlobalToastyService,
              protected _authService: AuthService,
              protected _http: HttpBackend) {
    super(_authService, _http);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onSuccess = (item: any, response: string) => {
      this._toasty.success("Файл успешно загружен.");
      this.saved.next(JSON.parse(response));
    };
    this.onError = (item: any, response: string, status: number) => {
      if (status == 0) {
        response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 100 Мб';
      }
      this._toasty.err(status, response);
    };
  }

  getUrl() {
    return this.url;
  }

  onFilesChosen(files: File[]) {
    this.file = files[0];
    this._toasty.info("Загрузка файла началась.");
    this.saveFile();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length) {
      this.onFilesChosen(Array.from(files) as File[]);
    }
  }
}
