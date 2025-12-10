import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileEditorComponent} from "../file-editor/file-editor.component";
import {DocumentService} from "@app/services/document.service";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.component.html',
    standalone: false
})
export class DocumentListComponent implements OnInit {

  _documents: any[];
  public selectedDocument: any;
  @Input() canDelete = false;
  @Input() canUpdate = false;
  @Input() url: string = 'document';
  @Output() onUpdate: EventEmitter<DocumentDto> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @ViewChild(FileEditorComponent) fileEditor: FileEditorComponent;
  @ViewChild("fileViewerModal") fileViewerModal: ModalComponent;

  constructor(private _documentService: DocumentService,
              private _toasty: GlobalToastyService,
              private _dialogService: DialogService,
              ) {
  }

  ngOnInit() {
  }

  @Input()
  set documents(documents) {
    if (documents == null) {
      documents = [];
    }
    if (documents instanceof Array)
      this._documents = documents.filter(d => d);
    else {
      this._documents = [documents];
    }
  }

  viewDocument(doc) {
    this._documentService.checkPdfView(doc).subscribe(res => {
      if (!res) {
        this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
          "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
      } else {
        this._dialogService.showPDFViewer("document", doc).subscribe();
        // this.selectedDocument = doc;
        // this.fileViewerModal.show();
      }
    });
  }

  editDocument(doc) {
    this.selectedDocument = doc;
    this.fileEditor.show();
  }

  updateDocument(doc: DocumentDto) {
    this.onUpdate.emit(doc);
  }

  hideEditor() {
    this.fileEditor.hide();
  }

  downloadDocument(doc: DocumentDto) {
    this._documentService.downloadDocument(doc, this.url).subscribe();
  }

  deleteDocument(doc) {
    this.onDelete.emit(doc);
  }

  downloadDocxDocument(doc: DocumentDto) {
    this._documentService.downloadDocument(doc, this.url + '/docx').subscribe();
  }
}
