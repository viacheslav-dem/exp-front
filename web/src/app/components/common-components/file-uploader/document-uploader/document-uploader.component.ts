import {Component, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {AuthService} from "app/services/auth.service";
import {GlobalToastyService} from "app/services/global-toasty.service";
import {ModalComponent} from "app/components/common-components/modal/modal.component";
import {UploadHelper} from "app/components/common-components/file-uploader/upload-helper";
import {removeFileSuffix} from "app/support/utils";
import {IdDto} from "@app/dto/IdDto";

@Component({
  selector: 'app-document-uploader',
  templateUrl: 'document-uploader.component.html'
})
export class DocumentUploaderComponent extends UploadHelper {

  fileName: string;
  fileDescription: string;

  @Input() url: string;
  @Input() idDto: IdDto;
  @Input() typesAccept: string;
  @Output() saved = new EventEmitter();

  @ViewChild('fileLoaderModal') fileLoaderModal: ModalComponent;

  constructor(private _toasty: GlobalToastyService,
              protected _authService: AuthService) {
    super(_authService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.onSuccess = (item: any, response: string) => {
      this.fileLoaderModal.hide();
      this._toasty.success("Файл успешно загружен.");
      this.saved.next(JSON.parse(response));
    };
    this.onError = (item: any, response: string, status: number) => {
      this.fileLoaderModal.hide();
      if (this.file.size > 10485760) {
        response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 10 Мб';
      }
      this._toasty.err(status, response);
    };
  }

  onFilesChosen(files: File[]) {
    this.file = files[0];
    if (this.file != null) {
      this.fileName = removeFileSuffix(this.file.name);
      this.fileDescription = null;
      this.progressValue = 0;
      this.fileLoaderModal.show();
      this.onError = (item: any, response: string, status: number) => {
        if (this.file.size.valueOf() > 10*1024*1024) {
          response = 'Загрузка была прервана. Возможно, Ваш файл превышает разрешённый размер в 10 Мб';
        }
        this.fileLoaderModal.hide();
        this._toasty.err(status, response);
      };
    }
  }

  getUrl() {
    return `${this.url}?id=${this.idDto.id}&name=${encodeURIComponent(this.fileName)}`
      + `&description=${this.fileDescription ? encodeURIComponent(this.fileDescription) : ''}`;
  }

  saveFile() {
    super.saveFile();
  }
}
