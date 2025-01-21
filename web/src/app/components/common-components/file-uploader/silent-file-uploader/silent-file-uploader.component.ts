import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";

@Component({
  selector: 'app-silent-file-uploader',
  templateUrl: 'silent-file-uploader.component.html'
})
export class SilentFileUploaderComponent extends UploadHelper {

  @Input() url;
  @Input() typesAccept: string;
  @Input() controlClass: any;
  @Output() saved = new EventEmitter();

  constructor(private _toasty: GlobalToastyService,
              protected _authService: AuthService) {
    super(_authService);
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
}
