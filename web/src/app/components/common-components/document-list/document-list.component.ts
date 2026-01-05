import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, input} from '@angular/core';
import {FileEditorComponent} from "../file-editor/file-editor.component";
import {DocumentService} from "@app/services/document.service";
import {DocumentDto} from "@app/dto/DocumentDto";
import {ModalComponent} from "@app/components/common-components/modal/modal.component";
import {GlobalToastyService} from "@app/services/global-toasty.service";
import {DialogService} from "@app/components/dialogs/dialog.service";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.component.html',
    standalone: false,
    // Feature flag для безопасного rollout: в prod по умолчанию Default (см. environment.prod.ts)
    changeDetection: (environment.features.onPush.enabled && environment.features.onPush.groups.fileAndPdf)
      ? ChangeDetectionStrategy.OnPush
      : ChangeDetectionStrategy.Default
})
export class DocumentListComponent implements OnInit, OnDestroy {

  _documents: any[];
  public selectedDocument: any;
  readonly canDelete = input<boolean>(false);
  readonly canUpdate = input<boolean>(false);
  readonly url = input<string>('document');
  @Output() onUpdate: EventEmitter<DocumentDto> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @ViewChild(FileEditorComponent) fileEditor: FileEditorComponent;
  @ViewChild("fileViewerModal") fileViewerModal: ModalComponent;
  private subscriptions: Subscription[] = [];

  constructor(private _documentService: DocumentService,
              private _toasty: GlobalToastyService,
              private _dialogService: DialogService,
              private cdr: ChangeDetectorRef,
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
    // Важно для OnPush/zoneless: входные данные могли обновиться асинхронно у родителя
    this.cdr.markForCheck();
  }

  viewDocument(doc) {
    this.subscriptions.push(
      this._documentService.checkPdfView(doc).subscribe(res => {
        if (!res) {
          this._toasty.warn("Формат файла не поддерживается для предпросмотра. " +
            "Вместо этого, пожалуйста, скачайте его и откройте у себя на компьютере предустановленной программой");
        } else {
          this.subscriptions.push(
            this._dialogService.showPDFViewer("document", doc).subscribe()
          );
        }
        // Для OnPush/zoneless: обновления/модалки инициируются из async-подписки
        this.cdr.markForCheck();
      })
    );
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
    this.subscriptions.push(
      this._documentService.downloadDocument(doc, this.url()).subscribe()
    );
  }

  deleteDocument(doc) {
    this.onDelete.emit(doc);
  }

  downloadDocxDocument(doc: DocumentDto) {
    this.subscriptions.push(
      this._documentService.downloadDocument(doc, this.url() + '/docx').subscribe()
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
