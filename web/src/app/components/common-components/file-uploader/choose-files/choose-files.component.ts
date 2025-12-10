import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {DocType} from "@app/components/common-components/file-uploader/doc-type";

@Component({
    selector: 'app-choose-files',
    templateUrl: 'choose-files.component.html',
    standalone: false
})
export class ChooseFilesComponent implements OnInit {

  @Output() onFilesChosen = new EventEmitter();
  @Input() controlClass: any;
  @Input() typesAccept: string = [
    DocType.DOCX.extension, DocType.DOC.extension,
    DocType.PDF.extension, DocType.TIFF.extension
  ].join(',');
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  chooseFiles(event: any) {
    if (event.target.files.length > 0) {
      this.validateTypes(event.target.files);
      this.onFilesChosen.emit(event.target.files);
    }
    this.fileInput.nativeElement.value = "";
  }

  private validateTypes(files: any) {
    // note that files is not array instance, so we can't use .forEach or .some
    for (let i = 0; i < files.length; ++i) {
      if (this.typesAccept.indexOf(files[i].type) == -1) {
        throw "Выбран файл недопустимого типа: " + files[i].name;
      }
      if (files[i].size > 10485760) {
        throw "Ваш файл превышает разрешённый размер в 10 Мб";
      }
    }
  }
}
