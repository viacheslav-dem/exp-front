import {ChangeDetectionStrategy, Component, ElementRef, OnInit, input, output, viewChild} from "@angular/core";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-choose-files',
    templateUrl: 'choose-files.component.html',
    standalone: false,
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class ChooseFilesComponent implements OnInit {

  readonly onFilesChosen = output<FileList>();
  readonly controlClass = input<any>(undefined);
  readonly typesAccept = input<string>([
    DocType.DOCX.extension, DocType.DOC.extension,
    DocType.PDF.extension, DocType.TIFF.extension
].join(','));
  readonly fileInput = viewChild<ElementRef>('fileInput');

  constructor() {
  }

  ngOnInit() {
  }

  chooseFiles(event: any) {
    if (event.target.files.length > 0) {
      this.validateTypes(event.target.files);
      this.onFilesChosen.emit(event.target.files);
    }
    const el = this.fileInput()?.nativeElement;
    if (el) el.value = "";
  }

  private validateTypes(files: any) {
    // note that files is not array instance, so we can't use .forEach or .some
    for (let i = 0; i < files.length; ++i) {
      if (this.typesAccept().indexOf(files[i].type) == -1) {
        throw "Выбран файл недопустимого типа: " + files[i].name;
      }
      if (files[i].size > 10485760) {
        throw "Ваш файл превышает разрешённый размер в 10 Мб";
      }
    }
  }
}
